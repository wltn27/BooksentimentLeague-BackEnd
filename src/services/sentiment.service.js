// sentiment.service.js

import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { pool } from "../../config/db.config.js";
import session from 'express-session';

// import DTOs
import { sentimentDTO, commentDTO } from "../dtos/sentiment.dto.js";

// import DAOs
import { addSentiment, getSentiment } from "../models/sentiment.dao.js";
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
        "image" : file.path,
        'book_image' : body.book_image,
        'season' : 1 // body에 season 없음 -> req에 시즌이 없음 -> 1로 정해놓음 
    });

    if (insertSentimnetData == -1 ) {
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
    
        const modifiedData = await modifySentiment(sentimentId, {
          /* "nickname" : "string",
		      "created_at" : "2023-12-18 12:34", // 얘네는req에 없음... 
          근데 얘네는 센티멘트 수정페이지에서 고치는것이 아니고 닉네임은 유저 정보 변경에서 생성시간은 변경 불가능
          -> 안고쳐도 됨
          */
		      "sentiment_title" : body.sentiment_title,
		      "book_title" : body.book_title,
		      "score" : body.score,
		      "content" : body.content,
		      "image": body.image,
		      /* 
          댓글도 여기서 수정 못함
          "comments" : [
					  { comment_id : 1, nick : "str", content : "댓글 내용", parent_id : NULL }, // 얘네도 req에 없음 
					  { comment_id : 2, nick : "str", content : "댓글 내용", parent_id : 1 } // 위 댓글의 대댓글
					]
          */
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