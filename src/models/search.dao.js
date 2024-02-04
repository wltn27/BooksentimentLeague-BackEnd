// sentiment.dao.js
import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import { getSentiment, getSentimentCommentCount } from "./../models/search.sql.js";

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
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}