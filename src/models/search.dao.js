// sentiment.dao.js
import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import { getSentiment, getSentimentCommentCount, getNickname, getBookSentimentData, getSentimentPageNum, getNicknamePageNum } from "./../models/search.sql.js";

export const getSentimentList = async(searchWord, limit, cursorId) => {
    try{
        const conn = await pool.getConnection();

        const validatedCursorId = Number(cursorId);
        if (isNaN(validatedCursorId)) {
            // cursorId가 유효하지 않을 경우 기본값 설정
            cursorId = 0;
        } else {
            cursorId = validatedCursorId;
        }
        
        const [sentimentObject] = await pool.query(getSentiment, [`%${searchWord}%`, `%${searchWord}%`, `%${searchWord}%`, limit, Number(cursorId)]);

        for(let i =0; i < sentimentObject.length; i++){
            Object.assign(sentimentObject[i], { comment_num: (await pool.query(getSentimentCommentCount, sentimentObject[i].sentiment_id))[0][0].comment_num });
        }

        const total_num = (await conn.query(getSentimentPageNum, [`%${searchWord}%`, `%${searchWord}%`, `%${searchWord}%`]))[0][0].total_num;

        conn.release();
        return {sentimentObject, total_num};
    } catch (err) {
        console.error(err);
        throw new BaseError(status.fail_sentiment_list);
    }
}

export const getNicknameList = async(searchWord, limit, cursorId, userId) => {
    try{
        const conn = await pool.getConnection();
        
        const [nicknameObject] = await pool.query(getNickname, [userId, `%${searchWord}%`, limit, Number(cursorId)]);

        for(let i =0; i < nicknameObject.length; i++){
            if(nicknameObject[i].user_id == userId)
                nicknameObject[i].follow_status = "myself";
        }

        const total_num = (await conn.query(getNicknamePageNum, [`%${searchWord}%`, `%${searchWord}%`, `%${searchWord}%`]))[0][0].total_num;
        conn.release();
        return {nicknameObject, total_num};
    } catch (err) {
        console.error(err);
        throw new BaseError(status.fail_nickname_list);
    }
}

export const getSentimentData = async(booktitle, author, publisher) => {
    try {
        const [results] = await pool.query(getBookSentimentData, [booktitle, author, publisher]);
     
        if (results.length > 0) {
            // 성공적으로 감정 데이터를 찾고 집계
            return results;
        } else {
            // 감정 표현이 없는 경우 기본값 반환
            return { avr_score: 0, eval_num: 0 };
        }
    } catch (error) {
        console.error('감정 데이터 가져오기 에러:', error);
        throw new BaseError(status.SERVER_ERROR, '감정 데이터 가져오기 실패');
    }
};