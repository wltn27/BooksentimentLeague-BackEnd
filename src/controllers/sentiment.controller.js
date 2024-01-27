import { StatusCodes } from "http-status-codes";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { insertComment, deleteComment } from './../services/sentiment.service.js';

dotenv.config();

export const wrComment = async (req, res, next) => {
    try {
        console.log("댓글 작성 요청!");
        const { sentimentId, userId } = req.params;
        const { parent_id, content } = req.body;
        const comment = await insertComment(sentimentId, userId, parent_id, content);
        console.log("댓글 작성 성공!");
        res.status(StatusCodes.OK).json(comment);
    } catch (error) {
        console.error('Error in writeComment:', error);
        res.status(500).json({ error: error.message });
    }
};

export const delComment = async (req, res, next) => {
    try {
        console.log("댓글 삭제 요청!");
        const { commentId } = req.params;
        // const userId = req.body;
        const comment = await deleteComment(commentId);
        console.log("댓글 삭제 성공!");
        res.status(StatusCodes.OK).json(comment);
    } catch (error) {
        console.error('Error in deleteComment:', error);
        res.status(500).json({ error: error.message });
    }
};