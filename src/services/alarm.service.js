// alarm.service.js
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { pool } from "../../config/db.config.js";

// import DTOs
import { alarmDTO, sentimentDTO } from "../dtos/alarm.dto.js";

// import DAOs
import { addSentiment, getSentiment, modifyImage } from "../models/alarm.dao.js";


// 알림 조회
export const insertSentiment = async (userId, body, files) => {
  const img_array = files.map(file=>file.location);
  const insertSentimentData = await addSentiment(userId, {
    //'sentiment_id' : body.sentiment_id,
    'user_id': userId,
    'sentiment_title': body.sentiment_title,
    'book_title': body.book_title,
    'score': body.score,
    'content': body.content,
    "image": img_array,
    'book_image': body.book_image,
    'author' : body.author,
    'publisher' : body.publisher,
    'season': 1 // body에 season 없음 -> req에 시즌이 없음 -> 1로 정해놓음 
  });
  console.log('insertSentimentData : ', insertSentimentData);
  if (insertSentimentData == -1) { 
    throw new BaseError(status.SENTIMENT_ALREADY_EXIST);
  } else {
    console.log('sentimentDTO: ', sentimentDTO(await getSentiment(insertSentimentData)))
    return alarmDTO(await getSentiment(insertSentimentData));
  }
}

// 알림 상태 업데이트
export const updateSentiment = async (sentimentId, body, files) => {
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

    // 이미지 삭제 로직
    console.log('update Sentiment body: ', body);
    
      
    //이미지 레코드 삭제
    await modifyImage(sentimentId, body, files);

    // 이후 실행하여 변경된 image 테이블에 저장된 데이터를 포함하여 전체적으로 업데이트
    const modifiedData = await modifySentiment(sentimentId, {

      "sentiment_title": body.sentiment_title,
      "book_title": body.book_title,
      "score": body.score,
      "content": body.content,
    });

    // 수정된 센티멘트 정보 반환
    return alarmDTO(await getSentiment(modifiedData));

  } catch (err) {
    console.error('Error:', err);
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
}