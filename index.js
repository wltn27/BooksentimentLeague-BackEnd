import { userRouter } from './src/routes/user.route.js';
import { sentimentRouter } from './src/routes/sentiment.route.js';
import { rankRouter } from './src/routes/rank.route.js';
/* import { searchRouter } from './src/routes/search.route.js';
*/

import { specs } from './config/swagger.config.js';
import { status } from './config/response.status.js';
import { response } from './config/response.js';

import SwaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

dotenv.config();    // .env 파일 사용 (환경 변수 관리)

const app = express();

// server setting - veiw, static, body-parser etc..
app.set('port', process.env.PORT || 3000)   // 서버 포트 지정
app.use((req, res, next) => {                             // cors 방식 허용
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});                           

app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({extended: false})); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(cookieParser());
app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'defaultSecret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS에서만 쿠키 전송
        httpOnly: true, // 클라이언트 스크립트에서 쿠키에 접근 불가
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1주일 동안 유효
    }
}));
//swagger settings
app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(specs));

// router setting
app.use('/users', userRouter);
app.use('/users/:userId', userRouter);
app.use('/sentiments', sentimentRouter);

app.use('/sentiments/:sentimentId', sentimentRouter);
app.use('/ranks/', rankRouter);
/**app.use('/search', searchRouter);

 */

app.get('/', (req, res, next) => {
    res.send(response(status.SUCCESS, "루트 페이지!"));
})

app.use((err, req, res, next) => {
    // 템플릿 엔진 변수 설정 
    res.locals.message = err.message;   
    // 개발환경이면 에러를 출력하고 아니면 출력하지 않기
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; 
    console.log("error", err);
    res.status(err.data.status || status.INTERNAL_SERVER_ERROR).send(response(err.data));
});

app.listen(app.get('port'), () => {
    console.log(`Example app listening on port ${app.get('port')}`);
})