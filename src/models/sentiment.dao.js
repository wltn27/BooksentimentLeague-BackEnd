// sentiment.dao.js
import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import { insertSentimentSql, confirmSentiment, getSentimentInfo, getUserId, getNickname, insertUserSentiment, getSentimentId } from "./sentiment.sql.js";
import { updateSentimentSql, deleteSentimentSql, deleteUserSentimentSql } from "./sentiment.sql.js";
import { getImageSql, insertImageSql, deleteImageSql } from "./sentiment.sql.js";
import { insertCommentQuery, insertUserCommentQuery, selectInsertedCommentQuery, findCommentByIdQuery,
         deleteCommentQuery, deleteUserCommentQuery, insertAlarmQuery,
         totalSentiment, totalRecommend, updateTier, getTierId, tierAlarm, getCommentList } from "./../models/sentiment.sql.js";
import { getAlarmInfo, alarmStatus, getAlarmStatus } from "./sentiment.sql.js";
import { deleteImageFromS3 } from '../middleware/imageUploader.js';

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
        //console.log('sentimentResult: ', sentimentResult);
        const sentimentCount = sentimentResult.length;
        console.log('sentimentCount: ', sentimentCount);

        const [recommendResult] = await pool.query(totalRecommend, [userId]);
        //console.log('recommendResult: ', recommendResult);
        const recommendCount = recommendResult[0].totalLikes;
        console.log('recommendCount: ', recommendCount);

        let checkTier; // 체크한 티어 
        
        if (sentimentCount >= 50 && recommendCount >= 500) {
            // 그랜드 마스터
            checkTier = 6;
        } else if (sentimentCount >= 30 && recommendCount >= 300) {
            // 마스터
            checkTier = 5;
        } else if (sentimentCount >= 10 && recommendCount >= 100) {
            // 다이아
            checkTier = 4;
        } else if (sentimentCount >= 5 && recommendCount >= 30) {
            // 골드
            checkTier = 3;
        } else if (sentimentCount >= 1) {
            // 실버
            checkTier = 2;
        } else {
            // 루키
            checkTier = 1;
        }
        
        const [currentTierResult] = await pool.query(getTierId, [userId]);
        let currentTier = currentTierResult[0].currentTier;
        if(checkTier != currentTier) {
            const [tier] = await pool.query(updateTier, [checkTier, userId]);
            console.log('tier: ', tier);
            console.log('사용자 티어 상승');
            // 알람생성 해야함
            const title = '티어 상승 알림';
            const content = '마이페이지에서 티어를 확인하세요!';
            const createdAt = new Date(); // 생성날짜
            // DB에 알람 데이터 삽입
            const [alarmResult] = await pool.query(tierAlarm, [userId, title , content, createdAt]);
            //console.log('alarmResult: ', alarmResult);
        };
        
        conn.release();
        //console.log("return : ", result);
        //console.log("return : ", result);
        return result[0].insertId; // sentimnet_id 반환

    } catch (err) {
        console.log(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// Sentiment 정보 얻기 
export const getSentiment = async (sentimentID) => {
    try {
        const conn = await pool.getConnection();
        const [sentiment] = await pool.query(getSentimentInfo, [sentimentID]); // 여기 안에 닉네임이 없음

        if(sentiment == ''){            // 센티멘트가 없을 때
            return false;
        }

        const [userIdResult] = await pool.query(getUserId, [sentimentID]);
        const userId = userIdResult[0].user_id;

        const [nicknameResult] = await pool.query(getNickname, userId);
        const nickname = nicknameResult[0].nickname;
        const [imageResult] = await pool.query(getImageSql, [sentimentID]);
        
        if (imageResult.length > 0  && imageResult[0].image !== '' ) {
            const imagePaths = imageResult.map(result => result.image);
            sentiment[0].image_path = imagePaths;
        } else {
            // 이미지가 없는 경우 image_path를 null로 설정
            sentiment[0].image_path = null;
        }

        sentiment[0].nickname = nickname;

        
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

// 댓글 조회하기
export const getComment = async (sentimentId) => {
    const conn = await pool.getConnection();
    const [commentList] = await pool.query(getCommentList, sentimentId);

    for(let i =0; i < commentList.length; i++){
        Object.assign(commentList[i], { nickname: (await pool.query(getNickname, commentList[i].user_id))[0][0].nickname });
    }

    conn.release();
    return commentList;
};

// 댓글 작성하기
export const createComment = async (sentimentId, userId, parent_id, content) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const parentId = parent_id === undefined ? null : parent_id;
        const [commentResult] = await conn.query(insertCommentQuery, [userId, sentimentId, parent_id, content]);
        const commentId = commentResult.insertId;
        await conn.query(insertUserCommentQuery, [commentId, userId]);
        
        const [rows] = await conn.query(selectInsertedCommentQuery);
        
        // sentiment 작성자 ID 조회 (sentimentId를 사용하여 조회)
        const [sentimentUser] = await conn.query(`SELECT user_id FROM sentiment WHERE sentiment_id = ?`, [sentimentId]);
        const sentimentUserId = sentimentUser[0].user_id;
        
        // 알림 제목 설정(댓글/대댓글 구분)
        const title = parent_id ? "새로운 대댓글이 달렸습니다: " : "새로운 댓글이 달렸습니다: ";
        
        // 알림 추가
        await conn.query(insertAlarmQuery, [sentimentUserId, title, content]);
        await conn.commit();
        conn.release();
        return rows[0];
     } catch (err) {
        await conn.rollback();
        console.log(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
     }
};

// 댓글 존재 확인
export const findCommentById = async (commentId) => {
    const conn = await pool.getConnection();
    const [rows] = await pool.query(findCommentByIdQuery, [commentId]);
    conn.release();
    return rows[0];
};

// 댓글 삭제하기
export const removeComment = async (commentId) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        await conn.query(deleteUserCommentQuery, [commentId]);
        await conn.query(deleteCommentQuery, [commentId]);
        await conn.commit();
        conn.release();
    } catch (err) {
        await conn.rollback();
        throw err;
    }    
};