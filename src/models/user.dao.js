// models/user.dao.js

import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { confirmEmail, insertUserSql, getUserID, confirmNick, getUserPassword, getUserIdFromLoginId } from "./../models/user.sql.js";

export const addUser = async (data) => {
    try{
        const conn = await pool.getConnection();

        const [confirm] = await pool.query(confirmEmail, data.email); // email 중복 되는지 확인

        if(confirm[0].isExistEmail){
            conn.release();
            return -1;
        }

        const result = await pool.query(insertUserSql, [data.email, data.password, data.nickname]);

        conn.release();
        return result[0].insertId;
        
     }catch (err) {
         throw new BaseError(status.PARAMETER_IS_WRONG);
     }
}

export const getUser = async (userId) => {
    try {
        const conn = await pool.getConnection();
        const [user] = await pool.query(getUserID, userId);

        if(user.length == 0){
            return -1;
        }

        conn.release();
        return user;
        
     } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
     }
}

export const existNick = async (nickname) => {
    try {
        const conn = await pool.getConnection();

        const [confirm] = await pool.query(confirmNick, nickname);

        if(confirm[0].isExistNick){
            conn.release();
            return -1;
        }

        conn.release();
        return confirm;
        
     } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
     }
}

export const confirmUser = async (data) => {
    try{
        const conn = await pool.getConnection();
        
        const [confirm] = await pool.query(confirmEmail, data.email);
        
        if(confirm[0].isExistEmail == 0){
            conn.release();
            return -1;
        }
        
        const [password] = await pool.query(getUserPassword, data.email);
        conn.release();

        if(password[0].password != data.password)
            return -2;
        else {
            const user_id = await pool.query(getUserIdFromLoginId, data.email);
            return user_id[0][0].user_id;
        }
        
    }catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}