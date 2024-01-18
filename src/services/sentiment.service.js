// sentiment.service.js

import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

// import DTOs
import { wrSentimentDTO, rewrSentimentDTO } from "../dtos/sentiment.dto.js";

// import DAOs
import { addSentiment, getSentiment } from "../models/sentiment.dao.js";
import { modifySentiment } from "../models/sentiment.dao.js";
import { eliminateSentiment } from "../models/sentiment.dao.js";


// 센티멘트 작성
export const insertSentiment = async(userId, body) => {
    const insertSentimnetData = await addSentiment(userId, {
        'sentiment_id' : body.sentiment_id,
        'user_id' : body.user_id,
        'book_title' : body.book_title,
        'score' : body.score,
        'content' : body.content,
        'book_image' : body.book_image,
        'season' : body.season
    });

    if (insertSentimnetData == -1 ) {
        throw new BaseError(status.SENTIMENT_ALREADY_EXIST);
    } else {
        return wrSentimentDTO(await getSentiment(insertSentimnetData));
    }
}

// 센티멘트 수정
export const updateSentiment = async (sentimentId, body ) => {
    try {
        // 현재 로그인한 사용자와 작성자의 id가 동일한지 확인... 해야하는데 어케하죠 ?
        // const equalUser = await 
        // if (equalUser) { 참이라면 밑에 실행 }
        const existingSentiment = await getSentiment(sentimentId);
    
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
		      "image_path": body.image,
		      /* 
          댓글도 여기서 수정 못함
          "comments" : [
					  { comment_id : 1, nick : "str", content : "댓글 내용", parent_id : NULL }, // 얘네도 req에 없음 
					  { comment_id : 2, nick : "str", content : "댓글 내용", parent_id : 1 } // 위 댓글의 대댓글
					]
          */
        });
    
        // 수정된 센티멘트 정보 반환
        return rewrSentimentDTO(await getSentiment(modifiedData));

      } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
      }

}

// 센티멘트 삭제 
export const deleteSentiment = async (sentimentId) => {
  try {
      // 센티멘트 존재 여부 확인
      const existingSentiment = await getSentiment(sentimentId);
  
      if (!existingSentiment) {
        return { message: '센티멘트를 찾을 수 없습니다.' };
      }
  
      // 센티멘트 삭제 실행
      await eliminateSentiment(sentimentId);
  
      // 삭제 후 반환
      return { message: '센티멘트가 성공적으로 삭제되었습니다.' };
    } catch (err) {
      throw new BaseError(status.PARAMETER_IS_WRONG);
    }

}