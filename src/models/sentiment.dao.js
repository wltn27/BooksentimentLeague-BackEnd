// sentiment.dao.js
import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import { insertSentimentSql, confirmSentiment, getSentimentInfo, getUserId, getNickname, insertUserSentiment } from "./sentiment.sql.js";
import { getSentimentId } from "./sentiment.sql.js";
import { updateSentimentSql, deleteSentimentSql, deleteUserSentimentSql } from "./sentiment.sql.js";
import { getImageSql, insertImageSql, deleteImageSql } from "./sentiment.sql.js";
import { modifyImageSql } from "./sentiment.sql.js";
import { deleteImageFromS3 } from '../middleware/ImageUploader.js';

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

        // user_sentiment 테이블 동기화
        const [sentimentIdResult] = await pool.query(getSentimentId);
        //console.log('sentimentIdResult: ', sentimentIdResult);
        const sentimentId = sentimentIdResult[0].lastId;
        //console.log('sentimentId: ',sentimentId);
        const [insertResult] = await pool.query(insertUserSentiment, [userId, sentimentId]);
        //console.log('insertResult: ',insertResult);        


        // 이미지가 있다면 DB에 삽입
        if (data.image) {
            console.log('data.image : ', data.image);
            // 각 이미지 URL에 대해 반복
            for (const imageUrl of data.image) {
                const imageResult = await pool.query(insertImageSql, [result[0].insertId, imageUrl]);
                console.log("Result of Image Insert Query:", imageResult);
            }
        }

        // 티어 체크
        const [sentimentResult] = await pool.query(totalSentiment, userId);
        console.log('sentimentResult: ', sentimentResult);
        const sentimentCount = sentimentResult.length;
        console.log('sentimentCount: ', sentimentCount);

        const [recommendResult] = await pool.query(totalRecommend, [userId]);
        console.log('recommendResult: ', recommendResult);
        const recommendCount = recommendResult[0].totalLikes;
        console.log('recommendCount: ', recommendCount);

        if (recommendCount < 30) { // 추천수 0~29개
            if (sentimentCount === 0) { // 루키
                // 사용자-티어 테이블 데이터 삽입
                const [tierResult] = await pool.query(makeTier, [userId, 1]);
                console.log('tierResult: ', tierResult);
                return tierResult[0].inserId;

            } else if (sentimentCount < 5) { // 실버
                // 사용자-티어 테이블 데이터 업데이트
                const [tierResult] = await pool.query(updateTier, [2, userId]);
                console.log('tierResult: ', tierResult);
                return tierResult[0].inserId;
            }

        } else if (recommendCount < 100) { // 추천수 30~99개
            if (sentimentCount <10 ) { // 골드

            } else if ( sentimentCount < 30) { // 다이아

            }
            

        } else if (recommendCount < 300 ) { // 추천수 100~299개
            // 사용자-티어 테이블 데이터 업데이트
            const [tierResult] = await pool.query(getTier, [userId]); // 티어 정보 가져오기
            const [upgradeTier] = await pool.query(updateTier, [3, userId]);
            const tier = tierResult[0].tier; // 티어 데이터
            const createdAt = new Date(); // 생성날짜
            console.log('tierResult: ', tierResult);
            // DB에 알람 데이터 삽입
            const [alarmResult] = await pool.query(tierAlarm, [userId, '제목', '내용', createdAt]);
            return tierResult[0].inserId;

        } else if (sentimentCount < 30 && recommendCount >= 100) {// 추천수 300~499개
            // 사용자-티어 테이블 데이터 업데이트
            const [tierResult] = await pool.query(updateTier, [4, userId]);
            console.log('tierResult: ', tierResult);
            return tierResult[0].inserId;

        } else if (sentimentCount < 50 && recommendCount >= 300) {// 마스터
            // 사용자-티어 테이블 데이터 업데이트
            const [tierResult] = await pool.query(updateTier, [5, userId]);
            console.log('tierResult: ', tierResult);
            return tierResult[0].inserId;

        } else if (sentimentCount >= 50 && recommendCount >= 500) {// 그랜드 마스터
            // 사용자-티어 테이블 데이터 업데이트
            const [tierResult] = await pool.query(updateTier, [6, userId]);
            console.log('tierResult: ', tierResult);
            return tierResult[0].inserId;
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
        if (imageResult.length > 0 && imageResult[0].image !== '') {
            const imagePaths = imageResult.map(result => result.image);
            sentiment[0].image_path = imagePaths;
        } else {
            // 이미지가 없는 경우 image_path를 null로 설정
            sentiment[0].image_path = null;
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

                if (!s3Url || !isValidUrl(s3Url)) {
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
        const [result2] = await pool.query(deleteUserSentimentSql, [sentimentID]);
        const [result] = await pool.query(deleteSentimentSql, [sentimentID]);
        
        //console.log('result:', result);
        //console.log('result2:', result2);

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
                if (newImg !== '') { // 빈 문자열 체크
                    console.log('body.image: ', newImg);
                    await pool.query(insertImageSql, [sentimentId, newImg]); // DB에 삽입
                }
            }
        }

        // 새로운 파일로 업로드된 이미지 삽입
        if (files && files.length > 0) {
            for (const file of files) {
                const newImage = file.location;
                if (newImage !== '') { // 빈 문자열 체크
                    console.log('files.location: ', newImage);
                    await pool.query(insertImageSql, [sentimentId, newImage]); // DB에 삽입
                }
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

// -----------------------------------------
import { totalSentiment, totalRecommend } from "./sentiment.sql.js";
import { makeTier, updateTier } from "./sentiment.sql.js";
import { tierAlarm } from "./sentiment.sql.js";
import { getAlarmInfo, alarmStatus, getAlarmStatus } from "./sentiment.sql.js";


// 티어 알람 생성 -> 티어가 상승하면 바로 
export const makeTierAlarm = async (userId) => {
    const conn = await pool.getConnection();
    const [tierResult] = await pool.query(getTier, [userId]); // 티어 정보 가져오기
    const tier = tierResult[0].tier; // 티어 데이터
    const createdAt = new Date(); // 생성날짜

    // DB에 알람 데이터 삽입
    const [alarmResult] = await pool.query(tierAlarm, [userId, '제목', '내용', createdAt]);
}

// 알람 조회
export const getAlarmDao = async (userId) => {
    try {
        const conn = await pool.getConnection();
        const [alarm] = await pool.query(getAlarmInfo, [userId]);

        if (alarm.length == 0) {
            return -1;
        }

        conn.release();
        return alarm;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 알람 업데이트
export const updateAlarmDao = async (alarmId) => {
    try {
        const conn = await pool.getConnection();
        await pool.query(alarmStatus, [alarmId]);
        const [readResult] = await pool.query(getAlarmStatus, [alarmId]);
        conn.release();
        return readResult[0].read_at;
    } catch (err) {
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}