// sentiment.dao.js
import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import { getSentiment, getSentimentCommentCount, getBookSentimentData } from "./../models/search.sql.js";

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

export const getSentimentData = async(booktitle, author, publisher) => {
    try {
        const [results] = await pool.query(getBookSentimentData, [booktitle, author, publisher]);
        if (results.length > 0) {
            // 성공적으로 감정 데이터를 찾고 집계함
            const { avr_score, eval_num } = results[0];
            return {
                avr_score: avr_score || 0, // null일 경우 기본값 0
                eval_num: eval_num || 0 // 감정 표현이 없는 경우 기본값 0
            };
        } else {
            // 감정 표현이 없는 경우 기본값 반환
            return { avr_score: 0, eval_num: 0 };
        }
    } catch (error) {
        console.error('감정 데이터 가져오기 에러:', error);
        throw new BaseError(status.SERVER_ERROR, '감정 데이터 가져오기 실패');
    }
};