// sentiment.service.js

import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { pool } from "../../config/db.config.js";
import session from 'express-session';
import { deleteImageFromS3 } from '../middleware/ImageUploader.js';
// import DTOs
import { sentimentDTO, commentDTO } from "../dtos/sentiment.dto.js";

// import DAOs
import { addSentiment, getSentiment, modifyImage } from "../models/sentiment.dao.js";
import { modifySentiment } from "../models/sentiment.dao.js";
import { eliminateSentiment } from "../models/sentiment.dao.js";
import { getUserId } from "../models/sentiment.sql.js";


// 센티멘트 작성
export const insertSentiment = async(userId, body, file) => {
    //console.log(body);
    const insertSentimnetData = await addSentiment(userId, {
        //'sentiment_id' : body.sentiment_id,
        'user_id' : userId,
        'sentiment_title' : body.sentiment_title,
        'book_title' : body.book_title,
        'score' : body.score,
        'content' : body.content,
        "image" : file.location,
        'book_image' : body.book_image,
        'season' : 1 // body에 season 없음 -> req에 시즌이 없음 -> 1로 정해놓음 
    });

    if (insertSentimnetData == -1 ) { // 추후 이미지 삽입 dao를 따로 짜서 로직을 변경해야함
        throw new BaseError(status.SENTIMENT_ALREADY_EXIST);
    } else {
        return sentimentDTO(await getSentiment(insertSentimnetData));
    }
}

// 센티멘트 수정
export const updateSentiment = async (sentimentId, body ) => {
    try {
      /*
      const postId = await pool.query(getUserId,[sentimentId]);
      const currentId = req.session.userId;
      if ( postId == currentId ) { // 현재 로그인한 사용자와 작성자의 id가 동일한지 확인 */
        const existingSentiment = await getSentiment(sentimentId);
        // 디버깅을 위한 로그
        console.log('Existing Sentiment:', existingSentiment);
        if (!existingSentiment) {
          throw new BaseError(status.SENTIMENT_NOT_FOUND);
        }
        
        // 이미지 삭제 또는 추가 삽입 로직 추가


        // 이후 실행하여 변경된 image 테이블에 저장된 데이터를 포함하여 전체적으로 업데이트
        const modifiedData = await modifySentiment(sentimentId, {
        
		      "sentiment_title" : body.sentiment_title,
		      "book_title" : body.book_title,
		      "score" : body.score,
		      "content" : body.content,
		      "image": body.image,
		   
        });
    
        // 수정된 센티멘트 정보 반환
        return sentimentDTO(await getSentiment(modifiedData));

      } catch (err) {
        console.error('Error:', err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
      }

}

// 센티멘트 삭제 
export const deleteSentiment = async (sentimentId) => {
  try {
    // 센티멘트 존재 여부 확인
     
    const sentimentInfo = await getSentiment(sentimentId);

    if (sentimentInfo === -1) {
      return { message: '센티멘트를 찾을 수 없습니다.' };
    }
  
      // 센티멘트 삭제 실행
      await eliminateSentiment(sentimentId);
  
      // 삭제 후 반환
      return { message: '센티멘트가 성공적으로 삭제되었습니다.' };
    } catch (err) {
      console.error(err);
      throw new BaseError(status.PARAMETER_IS_WRONG);
    }

}

// 이미지 삭제
export const deleteImage = async(file) => {
   // 이미지 삭제 로직
   const key = file.key; // 이미지의 S3 키를 얻는 방법에 따라 key를 설정하세요.
   try {
     await deleteImageFromS3(key);
     console.log('Image deleted from S3:', key);
   } catch (error) {
     console.error('Error deleting image from S3:', error);
   }

   const deleteImageResult = await modifyImage(key);
}