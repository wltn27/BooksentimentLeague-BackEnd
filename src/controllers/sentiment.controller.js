// sentiment.controller.js
import { StatusCodes } from "http-status-codes";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
//import { getUserId } from "../models/sentiment.sql.js";

import { insertSentiment } from "../services/sentiment.service.js";
import { updateSentiment } from "../services/sentiment.service.js";
import { deleteSentiment } from "../services/sentiment.service.js";
import { insertComment, deleteComment } from './../services/sentiment.service.js';
import { getUser } from "../models/user.dao.js";

dotenv.config();

// 센티멘트 작성
export const wrSentiment = async (req, res, next ) => {
    console.log("센티멘트 작성 요청");
    console.log("body", req.body);
    console.log("files", req.files);
    res.send(response(status.SUCCESS, await insertSentiment(req.params.userId, req.body, req.files)));
}

// 센티멘트 수정
export const rewrSentiment = async (req, res, next ) => {
    console.log("센티멘트 수정 요청");
    console.log("body", req.body);
    console.log("files", req.files); 
    res.send(response(status.SUCCESS, await updateSentiment(req.params.sentimentId, req.body, req.files)));
}

// 센티멘트 삭제
export const delSentiment = async (req, res, next ) => {
    console.log("센티멘트 삭제 요청");
    res.send(response(status.SUCCESS, await deleteSentiment(req.params.sentimentId, req.file)));
}

// 댓글 작성
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

// 댓글 삭제
export const delComment = async (req, res, next) => {
    try {
        console.log("댓글 삭제 요청!");
        const { commentId } = req.params;
        
        const token = req.cookies.refreshToken;
        const data = jwt.verify(token, process.env.REFRESH_SECRET);
        const userData = await getUser(data.user_id); // 사용자 정보 반환

        const comment = await deleteComment(commentId, userData);
        console.log("댓글 삭제 성공!");
        res.status(StatusCodes.OK).json(comment);
    } catch (error) {
        console.error('Error in deleteComment:', error);
        res.status(500).json({ error: error.message });
    }
};

