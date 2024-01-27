import { config } from '../../config/db.config.js';
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { WriteCommentResponseDTO } from "./../dtos/sentiment.response.dto.js"
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

export const deleteComment = async (commentId) => {
    try {
        // 삭제하려는 댓글이 존재하는지 확인
        const comment = await findCommentById(commentId);
        if (!comment) {
            throw new Error('Comment not found');
        }

        // // 삭제하려는 댓글 작성자와 현재 사용자가 같은지 확인
        // console.log("comment.user_id:", comment.user_id);
        // console.log("userId:", userId);
        // if (comment.user_id !== userId) {
        //     throw new Error('본인 댓글 외에는 삭제할 수 없습니다.');
        // }

        await removeComment(commentId); // 나중에 DTO 부분 수정;
    } catch (error) {
        console.error('Error in deleteComment:', error);
        throw error;
    }
};