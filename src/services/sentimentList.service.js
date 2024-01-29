import sentimentDao from '../models/sentimentList.dao.js'; 
import { mapToSentimentDto } from '../dtos/sentimentList.dto.js'; 
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";



// 센티멘트 리스트 조회
export const SentimentList = async (sentimentId, page = 1) => {
  try {
    // 추천수 많은 순으로 정렬하고, 페이징 처리하여 센티멘트 데이터 조회
    const sentimentData = await sentimentDao.getSentimentsByUserIdSortedByRecommend(sentimentId, page);

    if (!sentimentData || sentimentData.length === 0) {
      // 조회된 데이터가 없을 경우 에러 처리
      throw new BaseError(status.SENTIMENT_NOT_FOUND);
    }

    // 조회된 센티멘트 데이터를 DTO로 매핑
    const sentimentDtoList = sentimentData.map(sentiment => mapToSentimentDto(sentiment));

    return sentimentDtoList;
  } catch (error) {
    // 예외 발생 시 에러 처리
    throw error;
  }
};


// 센티멘트 조회
export const SentimentPost = async (userId, requestBody, file) => {
    try {
      // sentimentDao를 통해 센티멘트 데이터 조회
      const sentimentData = await sentimentDao.getSentimentsByUserId(userId);
  
      if (!sentimentData || sentimentData.length === 0) {
        // 조회된 데이터가 없을 경우 에러 처리
        throw new BaseError(status.SENTIMENT_NOT_FOUND);
      }
  
      // 조회된 센티멘트 데이터를 DTO로 매핑
      const sentimentDtoList = sentimentData.map(sentiment => mapToSentimentDto(sentiment));
  
      return sentimentDtoList;
    } catch (error) {
      // 예외 발생 시 에러 처리
      throw error;
    }
  };
  