import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { StatusCodes } from "http-status-codes";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { joinUser, checkingNick, checkingEmail, loginUser, findUser, changeUser, saveVerificationCode, followUser, likeSentimentUser, likeCommentUser, scrapSentimentUser, 
        updateUserData, sendEmail, updateAlarmService} from './../services/user.service.js';
import { readMyPage, readFollowerList, readFollowingList, readSentimentList, readScrapList, getAlarmService} from './../providers/user.provider.js';
import { getUser } from "../models/user.dao.js";
import { checkEmailResponseDTO, checkNickResponseDTO} from "./../dtos/user.response.dto.js"

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
    
    if(checkingEmailMessage)
        return res.status(StatusCodes.OK).json(checkEmailResponseDTO());
    else
        return res.status(StatusCodes.BAD_REQUEST).json(new BaseError(status.EMAIL_ALREADY_EXIST));
}

export const checkNick = async (req, res, next) => {
    const nickname = req.body.nickname;
    console.log("닉네임 중복 확인을 요청하였습니다.");
    const checkingNickMessage = await checkingNick(nickname);
    
    if(checkingNickMessage)
        return res.status(StatusCodes.OK).json(checkNickResponseDTO());
    else
        return res.status(StatusCodes.BAD_REQUEST).json(new BaseError(status.NICKNAME_ALREADY_EXIST));
}

export const userLogin = async (req, res, next) => {
    const logIn = req.body;
    console.log("로그인을 요청하였습니다!");
    const loginUserData = await loginUser(logIn);
    
    try {
        // access token 발급
        const accessToken = jwt.sign({
            user_id :  loginUserData.user_id,
            email : loginUserData.email,
            nickname : loginUserData.nickname,
        }, process.env.ACCESS_SECRET, {
            expiresIn : '1m',
            issuer : 'book_sentiment_league'
        })
        
        // refresh token 발급
        const refreshToken = jwt.sign({
            user_id :  loginUserData.user_id,
            email : loginUserData.email,
            nickname : loginUserData.nickname
        }, process.env.REFRESH_SECRET, {
            expiresIn : '24h',
            issuer : 'book_sentiment_league'
        })
        
        res.cookie("accessToken", accessToken, {
            secure : false,
            httpOnly : true,
        })

        res.cookie("refreshToken", refreshToken, {
            secure : false,
            httpOnly : true,
        })
    
        if (!req.session[loginUserData.user_id]) {
            // 세션 저장
            req.session[loginUserData.user_id] = {
                email: logIn.email,
                isAuthenticated: true
            };
        }

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
        res.status(200).send({"messgae" : "메일로 인증번호를 전송하였습니다."});
    } catch (error) {
        res.status(500).send({"messgae" : "인증번호 전송에 실패하였습니다."});
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

        res.status(StatusCodes.OK).json({"message" : "access token을 재 발행햇습니다."});
    } 
     catch (err) {
        res.status(StatusCodes.BAD_GATEWAY).json({"message" : "access token을 발행하지 못 했습니다."});
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
        res.status(200).json({"message" : "로그아웃에 성공하였습니다."});
    } catch (err){
        res.status(500).json({"message" : "로그아웃에 실패하였습니다."});
    }
}

export const userFollow = async (req, res, next) => {
    try {
        const followingId = req.body.followingId;
        const userId = req.params.userId;
        const result = await followUser(followingId, userId);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error('Error in userFollow:', error);
        return res.status(500).json({message: error.data.message});
    }
}

export const myPage = async (req, res, next) => {
    const user_id = req.params.userId;
    console.log("마이페이지 조회를 요청하였습니다.");

    if (req.session[user_id] || true) {
        //로그인 되어 있는 상태
        console.log("로그인 되어 있는 상태");
        const userData = await readMyPage(user_id);
        const sentimentData = await readSentimentList(user_id, 3, 0);

        res.status(200).json([userData, sentimentData]);
    } else {
        res.status(500).json({"message" : "로그인 해오십쇼!"})
    }
}

export const updateMyPage = async (req, res, next) => {
    const user_id = req.params.userId;
    const userData = req.body;
    console.log("마이페이지 수정을 요청하였습니다.");
 
    if (req.session[user_id] || true) {
        //로그인 되어 있는 상태
        console.log("로그인 되어 있는 상태");
        const result = await updateUserData(user_id, userData, req.file);

        res.status(200).json(result);
    } else {
        res.status(500).json({"message" : "로그인 해오십쇼"})
    }
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
    const cursorId = req.body.cursorId;

    const sentimentListDTO = await readSentimentList(user_id, 10, cursorId);
    
    res.status(200).json(sentimentListDTO);
}

export const scrap = async(req, res, next) => {
    const user_id = req.params.userId;

    const scrapListDTO = await readScrapList(user_id);
    
    res.status(200).json(scrapListDTO);
}

export const userLikeSentiment = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const sentimentId = req.params.sentimentId;
        const result = await likeSentimentUser(userId, sentimentId);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error('Error in userLikeSentiment:', error);
        return res.status(500).json({message: error.data.message});
    }
}

export const userLikeCommment = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const commentId = req.params.commentId;
        const result = await likeCommentUser(userId, commentId);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error('Error in userLikeCommment:', error);
        return res.status(500).json({message: error.data.message});
    }
}

export const userScrapSentiment = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const sentimentId = req.params.sentimentId;
        const result = await scrapSentimentUser(userId, sentimentId);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error('Error in userScrapSentiment:', error);
        return res.status(500).json({message: error.data.message});
    }
}

export const getAlarm = async (req, res, next) => {
    try {
        console.log("알림 조회 요청");
        const userId = req.params.userId;
        const result = await getAlarmService(userId);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error('Error in getAlarm:', error);
        return res.status(500).json({message: error.data.message});
    }
}

export const updateAlarm = async (req, res, next) => {
    try {
        console.log("알림 상태 업데이트 요청");
        const userId = req.params.userId;
        const alarmId = req.params.alarmId;
        const result = await updateAlarmService(userId, alarmId);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error('Error in updateAlarmService:', error);
        return res.status(500).json({message: error.data.message});
    }
}