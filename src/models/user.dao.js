// models/user.dao.js

import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { confirmEmail, confirmNick, getUserPassword, insertUserSql, getUserData, changeUserPassword, getUserId, getUserFromEmail, getUserTier,
    getFollowerCount, getFollowingCount, getSentimentCount, getLikeCount, getScrapCount} from "./../models/user.sql.js";

// DB에 유저 추가하기
export const addUser = async (data) => {
    try{
        const conn = await pool.getConnection();

        const result = await pool.query(insertUserSql, [data.email, data.password, data.nickname]);

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

export const getUserByEmail = async(email) => {
    const [user] = await db.query(getUserFromEmail, [email]);
    return user;
};

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
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}
