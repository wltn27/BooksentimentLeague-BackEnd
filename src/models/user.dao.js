// models/user.dao.js

import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { confirmEmail, confirmNick, getUserPassword, insertUserSql, getUserData, changeUserPassword, getUserId, getUserFromEmail, insertFollow, confirmFollow, deleteFollow } from "./../models/user.sql.js";

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
export const getUserIdFromEmail = async (email) => {
    try{
        const conn = await pool.getConnection();
        
        const [userId] = await pool.query(getUserId, email);
        conn.release();

        return userId[0].user_id;
        
    }catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

export const getUserByEmail = async (email) => {
    const [user] = await db.query(getUserFromEmail, [email]);
    return user;
};

// 팔로우하기 함수
export const updateUserFollow = async (followingId, userId) => {
    try {
        const conn = await pool.getConnection();
        console.log(userId)
        const [user] = await pool.query(insertFollow, [followingId, userId]);

        conn.release();
        return true;
        
    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 언팔로우하기 함수
export const updateUserUnFollow = async (followingId, userId) => {
    try {
        const conn = await pool.getConnection();
        console.log(userId)
        const [user] = await pool.query(deleteFollow, [followingId, userId]);

        conn.release();
        return true;
        
    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 팔로우 중복되는 지 확인
export const existFollow = async (followingId, userId) => {
    try{
        const conn = await pool.getConnection();
        const [confirm] = await pool.query(confirmFollow, [followingId, userId]);
        
        conn.release();
        return confirm[0].isExistFollow === 1; // 중복이 있으면 true, 없으면 false 반환

    }catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}