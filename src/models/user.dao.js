// models/user.dao.js

import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { confirmEmail, confirmNick, getUserPassword, insertUserSql, getUserData, changeUserPassword, getUserId, getUserFromEmail, getUserTier, updateUserData,
        getFollowerCount, getFollowingCount, getSentimentCount, getLikeCount, getScrapCount, getFollower, getFollowingStatus, getFollowing, getFollowerStatus, getSentiment,
        getScrap, getSentimentCommentCount, getSentimentLikeCount, getSentimentScrapCount, insertFollow, confirmFollow, deleteFollow, likeSentimentQuery, unlikeSentimentQuery, 
        checkSentimentOwnerQuery, checkUserSentimentLikeStatusQuery, likeCommentQuery, unlikeCommentQuery, checkCommentOwnerQuery, checkUserCommentLikeStatusQuery, scrapSentimentQuery, 
        unscrapSentimentQuery, checkUserSentimentScrapStatusQuery, getAlarmInfo, alarmStatus, getAlarmStatus, getImageSql, insertUserTierSql, getUnreadAlarmCount } from "./../models/user.sql.js";
import { deleteImageFromS3 } from '../middleware/imageUploader.js';



// DB에 유저 추가하기
export const addUser = async (data) => {
    try{
        const conn = await pool.getConnection();

        const result = await pool.query(insertUserSql, [data.email, data.password, data.nickname]);

        await pool.query(insertUserTierSql, result[0].insertId); // user_tier 관계 추가
        conn.release();
        return result[0].insertId;
        
     }catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
     }
}

// 유저 정보 가져오기
export const getUser = async (userId) => {
   try {
        const conn = await pool.getConnection();
        const [user] = await pool.query(getUserData, userId);

        if(user.length == 0){
            return false;
        }

        conn.release();
        return user;
        
     } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
     }
}

// 유저 정보 수정하기
export const updateUserPassword = async (password, userId) => {
    try {
        const conn = await pool.getConnection();
        console.log(userId)
        const [user] = await pool.query(changeUserPassword, [password, userId]);

        if(user.changedRows != 1){              // 비밀번호가 바뀌지 않았다면
            return false;
        }

        conn.release();
        return true;
        
    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 이메일 중복되는 지 확인
export const existEmail = async (email) => {
    try{
        const conn = await pool.getConnection();
        
        const [confirm] = await pool.query(confirmEmail, email);
        
        if(confirm[0].isExistEmail){
            conn.release();
            return false;
        }
        
        conn.release();
        return true;

    }catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 닉네임 중복되는 지 확인
export const existNick = async (nickname) => {
    try {
        const conn = await pool.getConnection();

        const [confirm] = await pool.query(confirmNick, nickname);

        if(confirm[0].isExistNick){
            conn.release();
            return false;
        }

        conn.release();
        return true;
        
     } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
     }
}

// 비밀번호 확인
export const confirmPassword = async (data) => {
    try{
        const conn = await pool.getConnection();
        
        const [password] = await pool.query(getUserPassword, data.email);
        conn.release();
        if(password[0].password != data.password)
            return false;
        else {
            return password[0].password;
        }
        
    }catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 이메일로 유저 고유 번호 반환하기
export const getUserIdFromEmail = async(email) => {
    try{
        const conn = await pool.getConnection();
        
        const [userId] = await pool.query(getUserId, email);
        conn.release();

        return userId[0].user_id;
        
    }catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 이메일로 유저 정보 얻기
export const getUserByEmail = async(email) => {
    const [user] = await db.query(getUserFromEmail, [email]);
    return user;
};

// 마이 페이지 정보 받기
export const getMyPage = async(user_id) => {
    try{
        const conn = await pool.getConnection();
        const [userData] = await pool.query(getUserData, user_id);

        Object.assign(userData[0], { tier: (await pool.query(getUserTier, user_id))[0][0].tier});
        Object.assign(userData[0], { follower_num: (await pool.query(getFollowerCount, user_id))[0][0].follower_num });
        Object.assign(userData[0], { following_num: (await pool.query(getFollowingCount, user_id))[0][0].following_num });
        Object.assign(userData[0], { sentiment_num: (await pool.query(getSentimentCount, [user_id, 1]))[0][0].sentiment_num });
        Object.assign(userData[0], { like_num: (await pool.query(getLikeCount, [user_id, 1]))[0][0].like_num });
        Object.assign(userData[0], { scrap_num: (await pool.query(getScrapCount, [user_id, 1]))[0][0].scrap_num });

        conn.release();

        return userData[0];    

    }catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 마이 페이지 정보 수정하기
export const changeUserInfo = async(user_id, userData, image_path) => {
    try{
        const conn = await pool.getConnection();
        
        const oldImg = await pool.query(getImageSql, [user_id]);
        console.log('oldImg: ', oldImg[0][0]);

        // 프로필 이미지가 없다면 
        if(oldImg[0][0].profile_image != ''){
            const imgUrl = new URL(oldImg[0][0].profile_image);
            const key = imgUrl.pathname.substring(1);
            await deleteImageFromS3(key); // S3에서 삭제
        }   

        const [user] = await pool.query(updateUserData, [{'status_message': userData.status_message}, {'profile_image': image_path}, user_id]);

        console.log(user);

        if(user.changedRows != 1){              // 마이페이지 유저 정보가 바뀌지 않았다면
            return false;
        }

        conn.release();
        return true;    
    }catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 팔로우하기 함수
export const updateUserFollow = async (followingId, userId) => {
    try {
        const conn = await pool.getConnection();
        console.log(userId)
        await pool.query(insertFollow, [followingId, userId]);

        conn.release();
        return true;
        
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

export const getFollowerList = async(user_id) => {
    try{
        const conn = await pool.getConnection();
        
        const followObject = [];
        followObject.push(await pool.query(getFollower, user_id));
        followObject.push(await pool.query(getFollowerStatus, [user_id, user_id, user_id]));

        conn.release();
        return followObject;
    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 언팔로우하기 함수
export const updateUserUnFollow = async (followingId, userId) => {
    try {
        const conn = await pool.getConnection();
        console.log(userId)
        await pool.query(deleteFollow, [followingId, userId]);

        conn.release();
        return true;
        
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

export const getFollowingList = async(user_id) => {
    try{
        const conn = await pool.getConnection();
        
        const followObject = [];
        followObject.push(await pool.query(getFollowing, user_id));
        followObject.push(await pool.query(getFollowingStatus, [user_id, user_id, user_id]));

        conn.release();
        return followObject;
    }catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 팔로우 중복되는 지 확인
export const existFollow = async (followingId, userId) => {
    try {
        const conn = await pool.getConnection();
        const [confirm] = await pool.query(confirmFollow, [followingId, userId]);
        
        conn.release();
        return confirm[0].isExistFollow === 1; // 중복이 있으면 true, 없으면 false 반환

    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

export const getSentimentList = async(user_id, num, cursorId) => {
    try{
        const conn = await pool.getConnection();
        
        const [sentimentObject] = await pool.query(getSentiment, [user_id, num, cursorId]); // 닉네임, 티어는 토큰에서 활용하는 방안으로

        for(let i =0; i < sentimentObject.length; i++){
            Object.assign(sentimentObject[i], { comment_num: (await pool.query(getSentimentCommentCount, [user_id, i]))[0][0].comment_num });
            Object.assign(sentimentObject[i], { like_num: (await pool.query(getSentimentLikeCount, [user_id, i]))[0][0].like_num });
            Object.assign(sentimentObject[i], { scrap_num: (await pool.query(getSentimentScrapCount, [user_id, i]))[0][0].scrap_num });
        }
        conn.release();
        return sentimentObject;
    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

export const getScrapList = async(user_id) => {
    try{
        const conn = await pool.getConnection();
        
        const [scrapObject] = await pool.query(getScrap, user_id); // 닉네임, 티어는 토큰에서 활용하는 방안으로

        for(let i =0; i < scrapObject.length; i++){
            Object.assign(scrapObject[i], { comment_num: (await pool.query(getSentimentCommentCount, [user_id, i]))[0][0].comment_num });
            Object.assign(scrapObject[i], { like_num: (await pool.query(getSentimentLikeCount, [user_id, i]))[0][0].like_num });
            Object.assign(scrapObject[i], { scrap_num: (await pool.query(getSentimentScrapCount, [user_id, i]))[0][0].scrap_num });
        }

        conn.release();
        return scrapObject;
    }catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 추천하기 - 센티멘트
export const likeSentiment = async (userId, sentimentId) => {
    try {
        const conn = await pool.getConnection();
        await pool.query(likeSentimentQuery, [userId, sentimentId]);

        conn.release();
        return true;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 추천 취소하기 - 센티멘트
export const unlikeSentiment = async (userId, sentimentId) => {
    try {
        const conn = await pool.getConnection();
        await pool.query(unlikeSentimentQuery, [userId, sentimentId]);
    
        conn.release();
        return true;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 이미 추천된 센티멘트인지 확인
export const checkUserSentimentLikeStatus = async (userId, sentimentId) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await pool.query(checkUserSentimentLikeStatusQuery, [userId, sentimentId]);
        
        conn.release();
        return rows.length > 0 && rows[0].like === 1; // 이미 추천된 상태면 true, 아니면 false 반환
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 현재 사용자가 센티멘트 작성자인지 확인
export const checkSentimentOwner = async (sentimentId, userId) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await pool.query(checkSentimentOwnerQuery, [sentimentId]);
        
        conn.release();
        return rows.length > 0 && rows[0].user_id === Number(userId);
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 추천하기 - 댓글
export const likeComment = async (userId, commentId) => {
    try {
        const conn = await pool.getConnection();
        await pool.query(likeCommentQuery, [userId, commentId]);

        conn.release();
        return true;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 추천 취소하기 - 댓글
export const unlikeComment = async (userId, commentId) => {
    try {
        const conn = await pool.getConnection();
        await pool.query(unlikeCommentQuery, [userId, commentId]);
    
        conn.release();
        return true;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 이미 추천된 댓글인지 확인
export const checkUserCommentLikeStatus = async (userId, commentId) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await pool.query(checkUserCommentLikeStatusQuery, [userId, commentId]);
        
        conn.release();
        return rows.length > 0 && rows[0].like === 1; // 이미 추천된 상태면 true, 아니면 false 반환
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 현재 사용자가 댓글 작성자인지 확인
export const checkCommentOwner = async (commentId, userId) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await pool.query(checkCommentOwnerQuery, [commentId]);
        
        conn.release();
        return rows.length > 0 && rows[0].user_id === Number(userId);
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 스크랩하기
export const scrapSentiment = async (userId, sentimentId) => {
    try {
        const conn = await pool.getConnection();
        await pool.query(scrapSentimentQuery, [userId, sentimentId]);

        conn.release();
        return true;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 스크랩 취소하기
export const unscrapSentiment = async (userId, sentimentId) => {
    try {
        const conn = await pool.getConnection();
        await pool.query(unscrapSentimentQuery, [userId, sentimentId]);
    
        conn.release();
        return true;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 이미 스크랩된 센티멘트인지 확인
export const checkUserSentimentScrapStatus = async (userId, sentimentId) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await pool.query(checkUserSentimentScrapStatusQuery, [userId, sentimentId]);
        
        conn.release();
        return rows.length > 0 && rows[0].scrap === 1; // 이미 추천된 상태면 true, 아니면 false 반환
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 알람 조회
export const getAlarmDao = async (userId) => {
    try {
        const conn = await pool.getConnection();
        const [alarm] = await pool.query(getAlarmInfo, [userId]);

        if (alarm.length == 0) {
            return -1;
        }

        conn.release();
        return alarm;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 알람 업데이트
export const updateAlarmDao = async (alarmId) => {
    try {
        const conn = await pool.getConnection();
        await pool.query(alarmStatus, [alarmId]);
        const [readResult] = await pool.query(getAlarmStatus, [alarmId]);
        conn.release();
        return readResult[0].read_at;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

export const countUnreadNotifications = async (userId) => {
    const conn = await pool.getConnection();
    const [rows] = await pool.query(getUnreadAlarmCount, [userId]);
    return rows[0].unreadCount;
}