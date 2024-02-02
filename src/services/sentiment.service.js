import { config } from '../../config/db.config.js';
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { WriteCommentResponseDTO, DeleteCommentResponseDTO } from "./../dtos/sentiment.response.dto.js"
import { createComment, findCommentById, removeComment } from "../models/sentiment.dao.js";

export const insertComment = async (sentimentId, userId, parent_id, content) => {
    try {
        const newComment = await createComment(sentimentId, userId, parent_id, content);
        return WriteCommentResponseDTO(newComment);
    } catch (error) {
        console.error('Error in insertComment:', error);
        throw error;
    }
}

export const deleteComment = async (commentId, userData) => {
    try {
        // 삭제하려는 댓글이 존재하는지 확인
        const comment = await findCommentById(commentId);
        if (!comment) {
            throw new Error('Comment not found');
        }

        // 삭제하려는 댓글 작성자와 현재 사용자가 같은지 확인
        if (comment.user_id !== userData[0].user_id) {
            throw new BaseError(status.COMMENT_NOT_DELETE);
        }

        await removeComment(commentId);
        return DeleteCommentResponseDTO();
    } catch (error) {
        console.error('Error in deleteComment:', error);
        throw error;
    }
};