// sentiment.dao.js
import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import { insertSentimentSql, confirmSentiment, getSentimentInfo, getUserId, getNickname } from "./sentiment.sql.js";
import { updateSentimentSql,  deleteSentimentSql } from "./sentiment.sql.js";
import { getImageSql, insertImageSql, deleteImageSql } from "./sentiment.sql.js";
import { modifyImageSql } from "./sentiment.sql.js";
import { deleteImageFromS3 } from '../middleware/ImageUploader.js';

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
export const addSentiment = async (userId, data) => {
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
        console.log("return : ", result);
        return result[0].insertId; // sentimnet_id 반환

    } catch (err) {
        console.log(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// Sentiment 정보 얻기 
export const getSentiment = async (sentimentID) => {
    try {
        console.log(sentimentID);
        const conn = await pool.getConnection();
        const [sentiment] = await pool.query(getSentimentInfo, [sentimentID]); // 여기 안에 닉네임이 없음

        const [userIdResult] = await pool.query(getUserId, [sentimentID]);
        console.log("userIdResutlt : ", userIdResult);
        const userId = userIdResult[0].user_id;

        const [nicknameResult] = await pool.query(getNickname, userId);
        const nickname = nicknameResult[0].nickname;
        const [imageResult] = await pool.query(getImageSql, [sentimentID]);
        console.log('imageResult : ', imageResult);
        if (imageResult.length > 0) {
            const image = imageResult[0].image;
            sentiment[0].image_path = image;
        }

        sentiment[0].nickname = nickname;

        console.log(sentiment);
        if (sentiment.length == 0) {
            return -1;
        }

        conn.release();
        return sentiment;

    } catch (err) {
        console.log("ERROR: ", err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 센티멘트 수정하기 -> 이미지 업데이트와 별개 
export const modifySentiment = async (sentimentID, data) => {
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
        const updateResult = await pool.query(updateSentimentSql, [data.sentiment_title, data.book_title, data.score, data.content, originalDate, sentimentID]);
        console.log("updateResult: ", updateResult);

        conn.release();

        return sentimentID;

    } catch (err) {
        console.log('ERROR: ', err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 센티멘트 삭제하기 -> 이미지 삭제도 같이 수행 
export const eliminateSentiment = async (sentimentID) => {
    try {
        const conn = await pool.getConnection();
        const img = await pool.query(getImageSql, [sentimentID]);
        console.log("img: ", img);
        // 이미지 DB에서 삭제
        const deleteImageResult = await pool.query(deleteImageSql, [sentimentID]);
        console.log('deleteImageResult:', deleteImageResult);

        // s3에서 삭제
        for (var i = 0; i < img.length; i++) {
            const s3Url = img[i][0].image;
            console.log("s3Url: ", s3Url);
            if (!s3Url) {
                console.error('s3ObjectUrl is undefined or empty.');
            } else {
                // URL에서 객체 키 추출
                const key = new URL(s3Url).pathname.slice(1);
                console.log(key);
                await deleteImageFromS3(key);
            }
        }

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
            sentiment: sentimentID,
            img: img,
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

// 이미지 수정하기
export const modifyImage = async (sentimentId, image_paths, files) => { // key = 이미지 경로
    try {
        const conn = await pool.getConnection(); // file.key -> files[0].key
        console.log('image_paths: ', image_paths);
        /* 복수 이미지일 때
        for (const image_path of image_paths) {
            const oldImg = await pool.query(getImageSql,[sentimentId]);
            console.log('oldImg : ', oldImg);
            console.log('image_path: ', image_path);
            if (oldImg.includes(image_path)){
                console.log(image_path, '가 존재합니다');
            }
            else {
                const key = new URL(image_path).pathname.substring(1);
                await deleteImageFromS3(key);
            }
        }
        */
        const oldImg = await pool.query(getImageSql, [sentimentId]);
        console.log('oldImg: ', oldImg);
        const imageArray = [];

        // oldImg 배열에서 image 값을 추출하여 imageArray에 저장
        for (let i = 0; i < oldImg.length; i++) {
            // oldImg[i][0]이 정의되어 있을 때만 작업 수행
            if (oldImg[i][0]) {
                const imageValue = oldImg[i][0].image;
                if (imageValue) {
                    imageArray.push(imageValue);
                }
            }
        }
        console.log('imageArray: ', imageArray);

        // 중첩 배열을 평탄화하여 검색
        if (image_paths !== null) {
            // 중첩 배열을 평탄화하고, image_paths에 해당하지 않는 요소들을 필터링하여 delImg 배열에 추가
            const delImg = imageArray.filter(imageValue => imageValue !== image_paths);
            console.log('delImg: ', delImg);
            // delImg 배열이 빈 배열이 아닌 경우에만 if 문 실행
            if (delImg.length > 0 && delImg[0] !== undefined) {
                for (let i = 0; i < delImg.length; i++) {
                    const deleteImg = oldImg[i][0].image;
                    console.log('else delImg: ', deleteImg);
                    const imgUrl = new URL(deleteImg);
                    const key = imgUrl.pathname.substring(1); // 복수면 deleteImg[i].pathname.substring(1)
                    await deleteImageFromS3(key); // S3에서 삭제
                    await pool.query(modifyImageSql, [deleteImg]); // DB에서 삭제
                    /* 멀티 이미지일 경우
                    console.log('delImg[i]: ', delImg[i]);
                    const key = new URL(delImg[i]).pathname.substring(1);
                    await deleteImageFromS3(key); // S3에서 삭제
                    await pool.query(modifyImageSql, [delImg]); // DB에서 삭제
                    */
                }
            } else { // delImg가 빈배열일경우 
                // 각 행의 첫 번째 열의 이미지 경로에 접근
                const newImage = files.location
                console.log('file.locaiotn: ', files.location);
                const newImgResult = await pool.query(insertImageSql, [sentimentId, newImage]);
                console.log('newImgResult: ', newImgResult);
            }
            // 여러 이미지면 files[i].location
            /*
            for (var i=0;i<files.length;i++){
                const newImage = files[i].location;
    
            }
            */

        }
        // 연결 해제 및 결과 반환
        conn.release();
        return { "message": "이미지가 수정되었습니다." };
    }
    catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}