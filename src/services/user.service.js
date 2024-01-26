import { config } from '../../config/db.config.js';
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { signinResponseDTO, checkEmailResponseDTO, checkNickResponseDTO, loginResponseDTO, successResponseDTO , errorResponseDTO, followResponseDTO, LikeSentimentResponseDTO} from "./../dtos/user.response.dto.js"
import { addUser, getUser,  existEmail, existNick, confirmPassword, getUserIdFromEmail, updateUserPassword, updateUserFollow, existFollow, updateUserUnFollow, unlikeSentiment, likeSentiment, checkSentimentOwner, checkUserLikeStatus} from "../models/user.dao.js";
import nodemailer from 'nodemailer';
import Redis from 'redis';

export const joinUser = async (body) => {
   
    if(!await existEmail(body.email))
        throw new BaseError(status.EMAIL_ALREADY_EXIST);
    
    if(!await existNick(body.nickname))
        throw new BaseError(status.NICKNAME_ALREADY_EXIST);
    
    
    let joinUserId = await addUser({
        'email' : body.email,
        'password' : body.password,
        'nickname' : body.nickname
     })

    return signinResponseDTO(await getUser(joinUserId));
}

export const checkingEmail = async (email) => {

    if(!await existEmail(email)){
        throw new BaseError(status.EMAIL_ALREADY_EXIST);
    }
    return checkEmailResponseDTO(); 
}

export const checkingNick = async (nickname) => {

    if(!await existNick(nickname)){
        throw new BaseError(status.NICKNAME_ALREADY_EXIST);
    }
    return checkNickResponseDTO(); 
}

export const loginUser = async (body) => {

    if(await existEmail(body.email))
        throw new BaseError(status.EMAIL_NOT_EXIST);

    if(!await confirmPassword(body))
        throw new BaseError(status.EMAIL_ALREADY_EXIST);

    const user_id = await getUserIdFromEmail(body.email);

    return loginResponseDTO(await getUser(user_id));
}

export const findUser = async (email, verificationCode) => {
    if(await existEmail(email))
        throw new BaseError(status.EMAIL_NOT_EXIST);

    const client = Redis.createClient();
    await client.connect();

    if(verificationCode != await client.get(email)){
        throw new BaseError(status.AUTH_NOT_EQUAL);
    }
    
    return // 성공했다는 json 반환
    
}

export const changeUser = async (password, userId) => {
    if(await updateUserPassword(password, userId)){
        throw new BaseError(status.INTERNAL_SERVER_ERROR);
    }
    return // 성공했다는 json 반환
}

export const saveVerificationCode = async (email, verificationCode) => {
    try{
        const client = Redis.createClient();
        console.log(`email: ${email}, verificationCode: ${verificationCode}`);
        await client.connect();
        await client.setEx(`${email}`, 300, `${verificationCode}`, (err, result) => {
            if (err) {
              console.error('Error setting data in Redis:', err);
            } else {
              console.log('Data stored successfully!');
            }
        });
        await client.quit();
    }
    catch (error){
        throw new BaseError(status.EMAIL_NOT_EXIST); // error status 변경 필요
    }    
};

export const sendEmail = async (to, subject, text) => {
    console.log(`to: ${to} subject: ${subject} text: ${text}`);
    const mailOptions = {
      from: config.emailUser,
      to,
      subject,
      text,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      return successResponseDTO('Email sent successfully');
    } catch (error) {
      return errorResponseDTO('Error sending email', error);
    }
};

const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    secure: false, // 추후 보안 설정 필요
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
});

export const followUser = async (followingId, userId) => {
    try {
        // 팔로우 상태 확인
        const isFollowing = await existFollow(followingId, userId);
        
        if (isFollowing) {
            // 이미 팔로우 중인 경우, 언팔로우 수행
            await updateUserUnFollow(followingId, userId);
            // return { message: "언팔로우 성공" };
            return followResponseDTO("following"); // "following" 상태 반환
        } else {
            // 팔로우 수행
            await updateUserFollow(followingId, userId);
            // return { message: "팔로우 성공" };
            return followResponseDTO("follow"); // "follow" 상태 반환
        }
    } catch (error) {
        console.error('Error in followUser:', error);
        throw error;
    }
}

export const likeSentimentUser = async (userId, sentimentId) => {
    try {
        // 사용자가 자신의 센티먼트에 추천을 시도하는지 확인
        const isOwner = await checkSentimentOwner(sentimentId, userId);
        if (isOwner) {
            throw new Error("본인 센티멘트는 추천할 수 없습니다.");  // 임시
        }

        // 이미 추천이 되어 있는지 확인
        const userLikeStatus = await checkUserLikeStatus(userId, sentimentId);
        console.log(userLikeStatus);

        // 추천 취소 또는 추천 로직
        if (userLikeStatus) {
            await unlikeSentiment(userId, sentimentId); // 추천 취소
            return LikeSentimentResponseDTO(false);
        } else {
            await likeSentiment(userId, sentimentId); // 추천
            return LikeSentimentResponseDTO(true);
        }
    } catch (error) {
        console.error('Error in likeSentimentUser:', error);
        throw error;
    }
};
