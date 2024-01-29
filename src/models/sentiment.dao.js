// sentiment.dao.js
import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import { insertSentimentSql, confirmSentiment, getSentimentInfo, getUserId, getNickname } from "./sentiment.sql.js";
import { updateSentimentSql, deleteSentimentSql } from "./sentiment.sql.js";
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

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (e) {
        return false;
    }
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
            data.author,
            data.publisher,
            data.season,
            newDate
        ]);
        //const result = await pool.query(insertSentimentSql,[data.sentiment_title, data.book_title, parseFloat(data.score), data.content, data.book_image, data.season, currentDate]);
        //console.log("Result of Insert Query:", result); // 추가한 로그
        

        // If image data is available, insert it into the image table
        if (data.image) {
            console.log('data.image : ', data.image);
            // 각 이미지 URL에 대해 반복
            for (const imageUrl of data.image) {
                const imageResult = await pool.query(insertImageSql, [result[0].insertId, imageUrl]);
                console.log("Result of Image Insert Query:", imageResult);
            }
        }

        conn.release();
        console.log("return : ", result);
        console.log('result[0].id : ', result[0].insertid);
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
        const userId = userIdResult[0].user_id;

        const [nicknameResult] = await pool.query(getNickname, userId);
        const nickname = nicknameResult[0].nickname;
        const [imageResult] = await pool.query(getImageSql, [sentimentID]);
        console.log('imageResult : ', imageResult);
        if (imageResult.length > 0) {
            const imagePaths = imageResult.map(result => result.image);
            sentiment[0].image_path = imagePaths;
        }

        sentiment[0].nickname = nickname;

        console.log(sentiment);
        if (sentiment.length == 0) {
            return -1;
        }

        conn.release();
        console.log('sentiment: ', sentiment);
        return sentiment;

    } catch (err) {
        console.log("ERROR: ", err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 센티멘트 수정하기 -> 이미지 업데이트와 별개 
export const modifySentiment = async (sentimentID, data) => {
    try {
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

        // 이미지 DB 및 S3에서 삭제
        if (img[0].length > 0) {
            const imageInfos = img[0].filter(info => typeof info === 'object' && 'image' in info);

            for (const imageInfo of imageInfos) {
                const s3Url = imageInfo.image;
                console.log("s3Url: ", s3Url);

                if (!s3Url|| !isValidUrl(s3Url)) {
                    console.error('s3ObjectUrl is undefined or empty.');
                    continue; 
                } else {
                    // URL에서 객체 키 추출
                    const key = new URL(s3Url).pathname.slice(1);
                    console.log(key);

                    // 이미지 DB에서 삭제
                    const deleteImageResult = await pool.query(deleteImageSql, [sentimentID, key]);
                    console.log('deleteImageResult:', deleteImageResult);

                    // S3에서 삭제
                    await deleteImageFromS3(key);

                    // 삭제된 행이 없는 경우 에러 처리
                    if (deleteImageResult.affectedRows === 0) {
                        conn.release();
                        throw new BaseError(status.RESOURCE_NOT_FOUND, 'Image not found');
                    }
                }
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
export const modifyImage = async (sentimentId, body, files) => {
    try {
        const conn = await pool.getConnection();
        console.log('image_paths: ', body.image);

        const oldImg = await pool.query(getImageSql, [sentimentId]);
        console.log('oldImg: ', oldImg);

        const imageArray = oldImg[0].map(imageInfo => imageInfo.image);
        console.log('imageArray: ', imageArray);

        // body.image와 db에 삽입된 이미지를 비교하여 삭제할 이미지 추출
        const imagesToDelete = imageArray.filter(imageValue => !body.image || !body.image.includes(imageValue));
        console.log('imagesToDelete: ', imagesToDelete);

        // imagesToDelete 배열에 있는 이미지 삭제
        for (const deleteImg of imagesToDelete) {
            console.log('deleteImg: ', deleteImg);
            const imgUrl = new URL(deleteImg);
            const key = imgUrl.pathname.substring(1);
            await deleteImageFromS3(key); // S3에서 삭제
            await pool.query(deleteImageSql, [sentimentId, deleteImg]); // DB에서 삭제
        }

        // body.image에 있는 이미지 삽입
        if (body.image !== undefined && body.image !== null) {
            const newImages = Array.isArray(body.image) ? body.image : [body.image]; // body.image가 배열이 아니라면 배열로 변환
            for (const newImg of newImages) {
                console.log('body.image: ', newImg);
                await pool.query(insertImageSql, [sentimentId, newImg]); // DB에 삽입
            }
        }

        // 새로운 파일로 업로드된 이미지 삽입
        if (files.length > 0) {
            for (const file of files) {
                const newImage = file.location;
                console.log('files.location: ', newImage);
                await pool.query(insertImageSql, [sentimentId, newImage]); // DB에 삽입
            }
        }

        // 연결 해제 및 결과 반환
        conn.release();
        return { "message": "이미지가 수정되었습니다." };
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}
