// sentiment.controller.js
import { StatusCodes } from "http-status-codes";
import { BaseError } from "../../config/error.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
//import { getUserId } from "../models/sentiment.sql.js";

import { insertComment, deleteComment, insertSentiment, updateSentiment, deleteSentiment } from './../services/sentiment.service.js';
import { readSentiment, readComment } from './../providers/sentiment.provider.js';
import { getUser } from "../models/user.dao.js";
import { sentimentListProv, sentimentFollowProv} from '../providers/sentiment.provider.js';

dotenv.config();

// 센티멘트 조회
export const getSentiment = async (req, res, next ) => {
    console.log("센티멘트 조회 요청");
    
    const sentimentObject = await readSentiment(req.params.sentimentId);
    const commentObject = await readComment(req.params.sentimentId);

    if(!sentimentObject)
        return res.status(StatusCodes.NOT_FOUND).json(new BaseError(status.SENTIMENT_NOT_FOUND));
    return res.status(StatusCodes.OK).json([{"sentiment" : sentimentObject}, commentObject])
}

// 센티멘트 작성
export const wrSentiment = async (req, res, next ) => {
    console.log("센티멘트 작성 요청");
    
    res.send(response(status.SUCCESS, await insertSentiment(req.params.userId, req.body, req.files)));
}

// 센티멘트 수정
export const rewrSentiment = async (req, res, next ) => {
    console.log("센티멘트 수정 요청");
 
    /*
    const currentId = req.params.user-id;
    const postId = await pool.query(getUserId,[req.params.sentiment-id]);
    if ( currentId == postId ) {
        */
    res.send(response(status.SUCCESS, await updateSentiment(req.params.sentimentId, req.body, req.files)));
    /*
    } else {
        console.log("현재 사용자와 작성자가 일치하지 않습니다.");
        res.send(response(status.NOT_EQUAL_USER));
    }
    */
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
        return new BaseError(status.FAIL_COMMENT_WRITE);
    }
};

// 댓글 삭제
export const delComment = async (req, res, next) => {
    try {
        console.log("댓글 삭제 요청!");
        const { commentId, userId } = req.params;
        
        // const token = req.cookies.refreshToken;
        // const data = jwt.verify(token, process.env.REFRESH_SECRET);
        // const userData = await getUser(data.user_id); // 사용자 정보 반환
        const comment = await deleteComment(commentId, userId);
        
        console.log("댓글 삭제 성공!");
        res.status(StatusCodes.OK).json(comment);
    } catch (error) {
        console.error('Error in deleteComment:', error);
        return new BaseError(status.FAIL_COMMENT_DELETE);
    }
};

// 알림 조회
export const getAlarm = async (req, res, next) => {
    console.log("알림 조회 요청");
    res.send(response(status.SUCCESS, await getAlarmService(req.params.userId)));
}

// 알림 상태 업데이트
export const updateAlarm = async (req, res, next) => {
    console.log("알림 상태 업데이트 요청");
    res.send(response(status.SUCCESS, await updateAlarmService(req.params.userId, req.params.alarmId)));
}

// 센티멘트 리스트 조회
export const sentimentList = async (req, res, next) => {
    console.log("센티멘트 리스트 조회 요청");
    try {
        const result = await sentimentListProv(req.params.cursorId || 1);
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// 팔로우한 사람 센티멘트 리스트 조회
export const sentimentListFollowing = async (req, res, next) => {
    console.log("팔로우한 사람의 센티멘트 리스트 조회 요청");
    res.send(response(status.SUCCESS, await sentimentFollowProv(req.params.userId, req.params.cursorId || 1)));
}