import { StatusCodes } from "http-status-codes";
import { sendEmail } from '../services/user.service.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { joinUser, checkingNick, checkingEmail, loginUser, findUser, changeUser, saveVerificationCode, updateUserData} from './../services/user.service.js';
import { readMyPage, readFollowerList, readFollowingList, readSentimentList, readScrapList} from './../providers/user.provider.js';
import { getUser } from "../models/user.dao.js";
dotenv.config();

export const userSignin = async (req, res, next) => {
    const signIn = req.body;
    console.log("회원 가입을 요청하였습니다.");
    const signInMessage = await joinUser(signIn);
    
    console.log("회원 가입 성공");
    return res.status(StatusCodes.OK).json(signInMessage)
}

export const checkEmail = async (req, res, next) => {
    const email = req.body.email;
    console.log("이메일 중복 확인을 요청하였습니다.");
    const checkingEmailMessage = await checkingEmail(email);
    
    console.log("사용 가능한 이메일입니다.");
    return res.status(StatusCodes.OK).json(checkingEmailMessage);
}

export const checkNick = async (req, res, next) => {
    const nickname = req.body.nickname;
    console.log("닉네임 중복 확인을 요청하였습니다.");
    const checkingNickMessage = await checkingNick(nickname);
    
    console.log("사용 가능한 닉네임입니다.");
    return res.status(StatusCodes.OK).json(checkingNickMessage);
}

export const userLogin = async (req, res, next) => {
    const logIn = req.body;
    console.log("로그인을 요청하였습니다!");
    const loginUserData = await loginUser(logIn);
    
    try {
        console.log(loginUserData);
        // access token 발급
        const accessToken = jwt.sign({
            user_id :  loginUserData.user_id,
            email : loginUserData.email,
            nickname : loginUserData.nickname,
        }, process.env.ACCESS_SECRET, {
            expiresIn : '1m',
            issuer : 'book_sentiment_league'
        })
        console.log("accessToken");
        // refresh token 발급
        const refreshToken = jwt.sign({
            user_id :  loginUserData.user_id,
            email : loginUserData.email,
            nickname : loginUserData.nickname
        }, process.env.REFRESH_SECRET, {
            expiresIn : '24h',
            issuer : 'book_sentiment_league'
        })
        console.log("refreshToken");
        res.cookie("accessToken", accessToken, {
            secure : false,
            httpOnly : true,
        })

        res.cookie("refreshToken", refreshToken, {
            secure : false,
            httpOnly : true,
        })
        console.log("res");
        if (!req.session[loginUserData.user_id]) {
            // 세션 저장
            req.session[loginUserData.user_id] = {
                email: logIn.email,
                isAuthenticated: true
            };
        }

        console.log(req.session[loginUserData.user_id]);

        console.log("로그인에 성공하였습니다.");
        return res.status(StatusCodes.OK).json(loginUserData);

    } catch (err){
        res.status(500).json(err);
    }
}

export const sendEmailVerification = async (req, res, next) => {
    console.log("Received request:", req.body);
    const { email } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6자리 인증번호 생성

    // redis에 인증번호 저장 service 함수
    try {
        await saveVerificationCode(email, verificationCode);      // redis에 코드 저장
        await sendEmail(email, 'Your Verification Code', `Your code is: ${verificationCode}`);
        res.status(200).send('Verification email sent');
    } catch (error) {
        res.status(500).send('Error sending verification email');
    }
};

export const userFindPass = async (req, res, next) => {
    const { email, verificationCode}= req.body;
    console.log("비밀 번호 찾기를 요청하였습니다!");
    const findUserData = await findUser(email, verificationCode);

    console.log("비밀번호 찾기를 성공하였습니다.");
    return res.status(StatusCodes.OK).json(findUserData);
}

export const userChangePass = async (req, res, next) => {
    const password = req.body.password;
    const userId = req.params.userId;
    console.log("비밀 번호 변경을 요청하였습니다!");
    const changeUserData = await changeUser(password, userId);

    console.log("비밀번호 변경을 성공하였습니다.");
    return res.status(StatusCodes.OK).json(changeUserData);
}

export const refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        const data = jwt.verify(token, process.env.REFRESH_SECRET);

        const userData = await getUser(data.user_id); // 사용자 정보 반환

        // access token 발급
        const accessToken = jwt.sign({
            user_id :  userData[0].user_id,
            email : userData[0].email,
            nickname : userData[0].nickname,
        }, process.env.ACCESS_SECRET, {
            expiresIn : '1m',
            issuer : 'book_sentiment_league'
        });

        res.cookie("accessToken", accessToken, {
            secure : false,
            httpOnly : true,
        })

        res.status(StatusCodes.OK).json("Access Token Recreated");
    } 
     catch (err) {
         res.status(StatusCodes.BAD_GATEWAY).json(err);
    }
}

export const userLogout = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        const data = jwt.verify(token, process.env.ACCESS_SECRET);

        if (req.session[data.user_id]) {
            // 로그인된 상태
            console.log('로그아웃합니다.');
            
            req.session.destroy(function(err) {
                if (err) {throw err;}
                
                console.log('세션을 삭제하고 로그아웃되었습니다.');
            });
        }

        res.cookie('accessToken', '');
        res.status(200).json("Logout Success");
    } catch (err){
        res.status(500).json(err);
    }
}

export const myPage = async (req, res, next) => {
    const user_id = req.params.userId;
    console.log("마이페이지 조회를 요청하였습니다.");

    //if (req.session[user_id]) {
        //로그인 되어 있는 상태
        console.log("로그인 되어 있는 상태");
        const result = await readMyPage(user_id, req.file);

        res.status(200).json(result);
    // } else {
    //     res.status(500).json({"message" : "로그인 해와라"})
    // }
}

export const updateMyPage = async (req, res, next) => {
    const user_id = req.params.userId;
    const userData = req.body;
    console.log("마이페이지 수정을 요청하였습니다.");

    console.log("req.file", req.file);

    //if (req.session[user_id] || true) {
        //로그인 되어 있는 상태
        console.log("로그인 되어 있는 상태");
        const result = await updateUserData(user_id, userData, req.file);

        res.status(200).json(result);
    // } else {
    //     res.status(500).json({"message" : "로그인 해와라"})
    // }
}

export const follower = async (req, res, next) => {
    const user_id = req.params.userId;

    const result = await readFollowerList(user_id);
    
    res.status(200).json({"nicknames" : result});
}

export const following = async (req, res, next) => {
    const user_id = req.params.userId;

    const result = await readFollowingList(user_id);
    
    res.status(200).json({"nicknames" : result});
}

export const sentiment = async (req, res, next) => {
    const user_id = req.params.userId;

    const sentimentListDTO = await readSentimentList(user_id);
    
    res.status(200).json(sentimentListDTO);
}

export const scrap = async(req, res, next) => {
    const user_id = req.params.userId;

    const scrapListDTO = await readScrapList(user_id);
    
    res.status(200).json(scrapListDTO);
}