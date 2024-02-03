// sentiment.provider.js
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getSentiment, getComment } from "../models/sentiment.dao.js";
import { sentimentResponseDTO, commentResponseDTO } from "./../dtos/sentiment.response.dto.js"

// 센티멘트 조회
export const readSentiment = async (sentimentId) => {
    const sentiment = await getSentiment(sentimentId);

    return sentimentResponseDTO(sentiment);
}

// 댓글 조회
export const readComment = async (sentimentId) => {
    const comment = await getComment(sentimentId);

    return commentResponseDTO(comment);
}