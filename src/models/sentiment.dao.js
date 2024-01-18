// sentiment.dao.js

import { pool } from "../../config/db.connect.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import { insertSentimentSql, confirmSentimentID, getSentimentInfo, getNickname} from "./sentiment.sql.js";
import { updateSentimentSql, updateImageSql, deleteSentimentSql } from "./sentiment.sql.js";

  
// Sentiment 데이터 삽입
export const addSentiment = async(userId, data) => {
    try {
        const conn = await pool.getConnection();

        // userId에 해당하는 닉네임 가져오기
        const [nicknameResult] = await pool.query(getNickname, userId);
        const nickname = nicknameResult[0].nickname;

        const [confirm] = await pool.query( confirmSentimentID, data.sentiment_id);

        if ( confirm[0].isExistSentimentId) { // 워크북보고 따라만든거라 있긴한데 센티멘트 작성에서 센티멘트 id가 중복될 수가 없을 듯..?
            conn.release();
            return -1;
        }

        const result = await pool.query(insertSentimentSql,[data.sentiment_title, data.book_title, data.score, data.content, data.img, nickname]);
        
        conn.release();
        return result[0].insertId; // sentimnet_id 반환

    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// Sentiment 정보 얻기 
export const getSentiment = async(sentimentID) => {
    try {
        const conn = await pool.getConnection();
        const [sentiment] = await pool.query( getSentimentInfo, sentimentID);

        console.log(sentiment);

        if(sentiment.length == 0) {
            return -1;
        }

        conn.release();
        return sentiment;

    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 센티멘트 수정하기
export const modifySentiment = async(sentimentID, data) => {
    try {
        const conn = await pool.getConnection();

        // 데이터베이스에서 해당 sentimentID에 해당하는 센티멘트 정보를 가져옴
        const [sentiment] = await pool.query(getSentimentInfo, [sentimentID]);

        if (sentiment.length === 0) {
            // 해당 sentimentID에 해당하는 센티멘트가 없으면 -1 반환
            return -1;
        }

        // 가져온 센티멘트 정보를 기반으로 수정할 데이터 업데이트
        const updateResult = await pool.query(updateSentimentSql, [data.book_title, data.score, data.content, data.image, new Date(), sentimentID]);

        // image 테이블의 레코드를 업데이트
        const updateImageResult = await pool.query(updateImageSql, [data.image_path, sentimentID]);

        conn.release();

        return { updateResult, updateImageResult };

    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 센티멘트 삭제하기 
export const eliminateSentiment = async(sentimentID) => {
    try {
        const conn = await pool.getConnection();

        // 삭제 SQL 실행
        const [result] = await conn.query(deleteSentimentSql, [sentimentID]);

        console.log(sentiment);

        // 삭제된 행이 없는 경우 에러 처리
        if (result.affectedRows === 0) {
            conn.release();
            throw new BaseError(status.RESOURCE_NOT_FOUND, 'Sentiment not found');
        }

        // 성공적으로 삭제된 경우
        const sentiment = {
            sentimentID: sentimentID,
            message: 'Sentiment deleted successfully',
        };

        // 연결 해제 및 결과 반환
        conn.release();
        return sentiment;

    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
    
}