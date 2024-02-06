// sentiment.dao.js
import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import { getSentiment, getSentimentCommentCount, getNickname } from "./../models/search.sql.js";

export const getSentimentList = async(searchWord, cursorId) => {
    try{
        const conn = await pool.getConnection();
        
        const [sentimentObject] = await pool.query(getSentiment, [`%${searchWord}%`, `%${searchWord}%`, cursorId]);

        for(let i =0; i < sentimentObject.length; i++){
            Object.assign(sentimentObject[i], { comment_num: (await pool.query(getSentimentCommentCount, sentimentObject[i].sentiment_id))[0][0].comment_num });
        }

        conn.release();
        return sentimentObject;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.fail_sentiment_list);
    }
}

export const getNicknameList = async(searchWord, cursorId, userId) => {
    try{
        const conn = await pool.getConnection();
        
        const [nicknameObject] = await pool.query(getNickname, [userId, `%${searchWord}%`, cursorId]);

        for(let i =0; i < nicknameObject.length; i++){
            if(nicknameObject[i].user_id == userId)
                nicknameObject[i].follow_status = "myself";
        }

        conn.release();
        return nicknameObject;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.fail_nickname_list);
    }
}