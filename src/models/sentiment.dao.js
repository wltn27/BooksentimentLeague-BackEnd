// sentiment.dao.js
import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import { insertSentimentSql, confirmSentiment, getSentimentInfo, getUserId, getNickname} from "./sentiment.sql.js";
import { updateSentimentSql, updateImageSql, deleteSentimentSql } from "./sentiment.sql.js";
import { getImageSql, insertImageSql, deleteImageSql } from "./sentiment.sql.js";


function getCurrentDateTime() {
    const currentDate = new Date();
    
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}


// Sentiment 데이터 삽입
export const addSentiment = async(userId, data) => {
    try {
        console.log(userId);
        const conn = await pool.getConnection();
        // userId에 해당하는 닉네임 가져오기
        const [nicknameResult] = await pool.query(getNickname, userId);
        const nickname = nicknameResult[0].nickname;
        
        const [confirm] = await pool.query(confirmSentiment, [userId, data.book_title]);
        const newDate = new Date();

        console.log("Data: ", data);
        console.log("Confirm Result:", confirm);
        
        if (confirm[0].isExistSentiment) {
            conn.release();
            throw new BaseError(status.SENTIMENT_ALREADY_EXIST);
        }
        
        /*
        try {
            const result = await pool.query(insertSentimentSql, [
                userId,
                data.sentiment_title,
                data.book_title,
                parseFloat(data.score),
                data.content,
                data.book_image,
                data.season,
                currentDate
            ]);
        
            console.log('Query Result:', result);
        } catch (error) {
            console.error('Error:', error);
        }
        */

        const result = await pool.query(insertSentimentSql, [
            userId,
            data.sentiment_title,
            data.book_title,
            parseFloat(data.score),
            data.content,
            data.book_image,
            data.season,
            newDate
        ]);
        //const result = await pool.query(insertSentimentSql,[data.sentiment_title, data.book_title, parseFloat(data.score), data.content, data.book_image, data.season, currentDate]);
        //console.log("Result of Insert Query:", result); // 추가한 로그


        // If image data is available, insert it into the image table
        if (data.image) {
            const imageResult = await pool.query(insertImageSql, [result[0].insertId, data.image]);
            console.log("Result of Image Insert Query:", imageResult); // 추가한 로그
        }

        conn.release();
        console.log("return : ",result);
        return result[0].insertId; // sentimnet_id 반환

    } catch (err) {
        console.log(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// Sentiment 정보 얻기 
export const getSentiment = async(sentimentID) => {
    try {
        console.log(sentimentID);
        const conn = await pool.getConnection();
        const [sentiment] = await pool.query( getSentimentInfo, [sentimentID]); // 여기 안에 닉네임이 없음
        
        const [userIdResult] = await pool.query(getUserId, [sentimentID]);
        console.log("userIdResutlt : ", userIdResult);
        const userId = userIdResult[0].user_id;

        const [nicknameResult] = await pool.query(getNickname, userId);
        const nickname = nicknameResult[0].nickname;
        const [imageResult] = await pool.query(getImageSql, [sentimentID]);
        const image = imageResult[0].image;
        
        sentiment[0].nickname = nickname;
        sentiment[0].image_path=image;
        console.log(sentiment);
        if(sentiment.length == 0) {
            return -1;
        }

        conn.release();
        return sentiment;

    } catch (err) {
        console.log("ERROR: ",err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 센티멘트 수정하기
export const modifySentiment = async(sentimentID, data) => {
    try {
        console.log(sentimentID);
        const conn = await pool.getConnection();

        const originalDate = new Date();
        console.log(originalDate);
        // 데이터베이스에서 해당 sentimentID에 해당하는 센티멘트 정보를 가져옴
        const [sentiment] = await pool.query(getSentimentInfo, [sentimentID]);

        if (sentiment.length === 0) {
            // 해당 sentimentID에 해당하는 센티멘트가 없으면 -1 반환
            return -1;
        }

        // 가져온 센티멘트 정보를 기반으로 수정할 데이터 업데이트
        const updateResult = await pool.query(updateSentimentSql, [data.sentiment_title, data.book_title, data.score, data.content,  originalDate, sentimentID]);
        console.log("updateResult: ", updateResult);

        // 만약 이미지 데이터가 존재한다면, 이미지 테이블에서 업데이트
        if (data.image) {
            const updateImageResult = await pool.query(updateImageSql, [data.image, sentimentID]);
        }

        conn.release();
    
        return sentimentID; 

    } catch (err) {
        console.log('ERROR: ', err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 센티멘트 삭제하기 
export const eliminateSentiment = async(sentimentID) => {
    try {
        const conn = await pool.getConnection();

        // Delete image record associated with sentimentID
        const deleteImageResult = await pool.query(deleteImageSql, [sentimentID]);
        console.log('deleteImageResult:', deleteImageResult);
        // 삭제 SQL 실행
        const [result] = await conn.query(deleteSentimentSql, [sentimentID]);

        console.log('result:', result);

        // 삭제된 행이 없는 경우 에러 처리
        if (result.affectedRows === 0) {
            conn.release();
            throw new BaseError(status.RESOURCE_NOT_FOUND, 'Sentiment not found');
        }

        if (deleteImageResult.affectedRows === 0) {
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
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
    
}

// 이미지 삭제하기
export const modifyImage = async(key) => {

}

// 이미지 삽입 
