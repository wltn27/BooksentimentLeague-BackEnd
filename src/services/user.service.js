import { transporter, config } from '../../config/mail.config.js';
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { addUser, getUser,  existEmail, existNick, confirmPassword, getUserIdFromEmail, updateUserPassword, 
    updateUserFollow, existFollow, updateUserUnFollow, unlikeSentiment, likeSentiment, checkSentimentOwner, checkUserSentimentLikeStatus, unlikeComment, 
    likeComment, checkCommentOwner, checkUserCommentLikeStatus, unscrapSentiment, scrapSentiment, checkUserSentimentScrapStatus, changeUserInfo, updateAlarmDao} from "../models/user.dao.js";
import { signinResponseDTO, checkEmailResponseDTO, checkNickResponseDTO, loginResponseDTO, successResponseDTO , errorResponseDTO, 
        followResponseDTO, LikeSentimentResponseDTO, LikeCommentResponseDTO, ScrapSentimentResponseDTO} from "./../dtos/user.response.dto.js"   
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const joinUser = async (body) => {
   
    if(!await existEmail(body.email))
        return new BaseError(status.EMAIL_ALREADY_EXIST);
    
    if(!await existNick(body.nickname))
        return new BaseError(status.NICKNAME_ALREADY_EXIST);
    
    let joinUserId = await addUser({
        'email' : body.email,
        'password' : body.password,
        'nickname' : body.nickname
    })

    return signinResponseDTO(await getUser(joinUserId));
}

export const checkingEmail = async (email) => {

    if(!await existEmail(email)){
        return false;
    }
    return true; 
}

export const checkingNick = async (nickname) => {

    if(!await existNick(nickname)){
        return false;
    }
    return true; 
}

export const checkingAuth = async (email, verificationCode) => {
    if(!await existEmail(email))
        return new BaseError(status.EMAIL_ALREADY_EXIST);

        const client = createClient({
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT
            }
        });    

    await client.connect();

    if(verificationCode != await client.get(email)){
        return new BaseError(status.AUTH_NOT_EQUAL);
    }

    await client.quit();
    
    return {"message" : "인증 성공하였습니다."};
}

export const loginUser = async (body) => {

    if(await existEmail(body.email))
        return new BaseError(status.EMAIL_NOT_EXIST);

    if(!await confirmPassword(body))
        return new BaseError(status.PASSWORD_NOT_EQUAL);

    const user_id = await getUserIdFromEmail(body.email);
    const userData = await getUser(user_id);
    return userData[0];
}

export const findUser = async (email, verificationCode) => {
    if(await existEmail(email))
        return new BaseError(status.EMAIL_NOT_EXIST);

        const client = createClient({
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT
            }
        });    

    await client.connect();

    if(verificationCode != await client.get(email)){
        return new BaseError(status.AUTH_NOT_EQUAL);
    }

    await client.quit();
    
    // userId 반환 추가
    const userId = await getUserIdFromEmail(email);
    return {
        "message" : "인증 성공하였습니다.",
        userId: userId
    };
}

export const changeUser = async (password, userId) => {
    if(!await updateUserPassword(password, userId)){
        return new BaseError(status.INTERNAL_SERVER_ERROR);
    }
    return {"message" : "비밀번호 변경에 성공하였습니다."};
}

export const saveVerificationCode = async (email, verificationCode) => {
    try{
        const client = createClient({
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT
            }
        });   
        
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
        return new BaseError(status.NOT_SAVE_AUTH);
    }    
};

export const sendEmail = async (to, subject, text) => {
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

export const updateUserData = async (user_id, userData, file) => {
    const result = await changeUserInfo(user_id, userData, file.location);
    
    if(!result){
        return new BaseError(status.INTERNAL_SERVER_ERROR);
    }
    
    return result;
};

export const followUser = async (followingId, userId) => {
    try {
        // followingId와 userId가 유효한지 확인
        if (!followingId || !userId || followingId <= 0 || userId <= 0) {
            console.error('Invalid followingId or userId');
            throw new BaseError(status.INVALID_INPUT);
        }

        // 팔로우 상태 확인
        const isFollowing = await existFollow(followingId, userId);
        
        if (isFollowing) {
            // 이미 팔로우 중인 경우, 언팔로우 수행
            await updateUserUnFollow(followingId, userId);
            return followResponseDTO("follow"); // "follow" 상태 반환
        } else {
            // 팔로우 수행
            await updateUserFollow(followingId, userId);
            return followResponseDTO("following"); // "following" 상태 반환
        }
    } catch (error) {
        console.error('Error in followUser:', error);
        return new BaseError(status.FAIL_USER_FOLLOW);
    }
}

export const likeSentimentUser = async (userId, sentimentId) => {
    try {
        // 사용자가 자신의 센티먼트에 추천을 시도하는지 확인
        const isSentimentOwner = await checkSentimentOwner(sentimentId, userId);
        if (isSentimentOwner) {
            return new BaseError(status.SENTIMENT_NOT_SELF);
        }

        // 이미 추천이 되어 있는지 확인
        const userSentimentLikeStatus = await checkUserSentimentLikeStatus(userId, sentimentId);

        // 추천 취소 또는 추천 로직
        if (userSentimentLikeStatus) {
            await unlikeSentiment(userId, sentimentId); // 추천 취소
            return LikeSentimentResponseDTO(false);
        } else {
            await likeSentiment(userId, sentimentId); // 추천
            return LikeSentimentResponseDTO(true);
        }
    } catch (error) {
        console.error('Error in likeSentimentUser:', error);
        return new BaseError(status.FAIL_LIKE_SENTIMENT);
    }
};

export const likeCommentUser = async (userId, commentId) => {
    try {
        // 사용자가 자신의 댓글에 추천을 시도하는지 확인
        const isCommentOwner = await checkCommentOwner(commentId, userId);
        if (isCommentOwner) {
            return new BaseError(status.COMMENT_NOT_SELF);
        }

        // 이미 추천이 되어 있는지 확인
        const userCommentLikeStatus = await checkUserCommentLikeStatus(userId, commentId);

        // 추천 취소 또는 추천 로직
        if (userCommentLikeStatus) {
            await unlikeComment(userId, commentId); // 추천 취소
            return LikeCommentResponseDTO(false);
        } else {
            await likeComment(userId, commentId); // 추천
            return LikeCommentResponseDTO(true);
        }
    } catch (error) {
        console.error('Error in likeCommentUser:', error);
        return new BaseError(status.FAIL_LIKE_COMMENT);
    }
};

export const scrapSentimentUser = async (userId, sentimentId) => {
    try {
        // 사용자가 자신의 센티먼트에 스크랩을 시도하는지 확인
        const isSentimentOwner = await checkSentimentOwner(sentimentId, userId);
        if (isSentimentOwner) {
            return new BaseError(status.SCRAP_NOT_SELF);
        }

        // 이미 스크랩이 되어 있는지 확인
        const userSentimentScrapStatus = await checkUserSentimentScrapStatus(userId, sentimentId);

        // 스크랩 취소 또는 스크랩 로직
        if (userSentimentScrapStatus) {
            await unscrapSentiment(userId, sentimentId); // 스크랩 취소
            return ScrapSentimentResponseDTO(false);
        } else {
            await scrapSentiment(userId, sentimentId); // 스크랩
            return ScrapSentimentResponseDTO(true);
        }
    } catch (error) {
        console.error('Error in scrapSentimentUser:', error);
        return new BaseError(status.FAIL_SCRAP_SENTIMENT);
    }
};

// 알림 상태 업데이트
export const updateAlarmService = async (userId, alarmId) => {
    try {
      const readStatus = await updateAlarmDao(alarmId);
      return readStatus;
  
    } catch (err) {
      console.error('Error in updateAlarmService:', err);
      return new BaseError(status.FAIL_UPDATE_ALARM);
    }
  }