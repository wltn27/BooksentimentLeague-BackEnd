import { config } from '../../config/db.config.js';
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { WriteCommentResponseDTO } from "./../dtos/sentiment.response.dto.js"
import { createComment } from "../models/sentiment.dao.js";

export const insertComment = async (sentimentId, userId, parent_id, content) => {
    try {
        const newComment = await createComment(sentimentId, userId, parent_id, content);
        return WriteCommentResponseDTO(newComment);
    } catch (error) {
        console.error('Error in insertComment:', error);
        throw error;
    }
}