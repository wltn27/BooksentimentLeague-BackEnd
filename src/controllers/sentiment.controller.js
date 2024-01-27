import { StatusCodes } from "http-status-codes";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { insertComment } from './../services/sentiment.service.js';

dotenv.config();

export const writeComment = async (req, res, next) => {
    try {
        const { sentimentId, userId } = req.params;
        const { parent_id, content } = req.body;
        const comment = await insertComment(sentimentId, userId, parent_id, content);
        res.status(StatusCodes.OK).json(comment);
    } catch (error) {
        console.error('Error in writeComment:', error);
        res.status(500).json({ error: error.message });
    }
};
