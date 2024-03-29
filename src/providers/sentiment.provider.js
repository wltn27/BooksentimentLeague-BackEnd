
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getSentiment, getComment } from "../models/sentiment.dao.js";
import { getSentimentListDao, getSentimentFollowDao } from "../models/sentiment.dao.js";
import { sentimentResponseDTO, commentResponseDTO } from "./../dtos/sentiment.response.dto.js";
import { sentimentListDTO } from "./../dtos/sentiment.response.dto.js";

// 센티멘트 조회
export const readSentiment = async (sentimentId) => {
    const sentiment = await getSentiment(sentimentId);
    if(!sentiment)
        return false;
    return sentimentResponseDTO(sentiment);
}

// 댓글 조회
export const readComment = async (sentimentId) => {
    const comment = await getComment(sentimentId);

    return commentResponseDTO(comment);
}

// 센티멘트 리스트 조회 
export const sentimentListProv = async (page_num) => {
    const list = await getSentimentListDao(page_num);

    if (Array.isArray(list.list) && list.list.length > 0) {
        return {"list" : sentimentListDTO(list.list, list.total_num), "total_page_num" : Math.floor(list.total_num / 15) + (list.total_num % 15 > 0 ? 1 : 0)};
    }
    return list;
}

// 팔로우한 사람의 센티멘트 리스트 조회
export const sentimentFollowProv = async (userId, page_num) => {
    const list = await getSentimentFollowDao(userId, page_num);
    if (Array.isArray(list.list) && list.list.length > 0) {
        return {"list" : sentimentListDTO(list.list, list.total_num), "total_page_num" : Math.floor(list.total_num / 15) + (list.total_num % 15 > 0 ? 1 : 0)};
    }
    return list;
}