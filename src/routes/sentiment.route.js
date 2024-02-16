// sentiment.route.js
import express from "express";
import asyncHandler from 'express-async-handler';
import { upload } from '../middleware/imageUploader.js';

// import controller
import { wrSentiment, rewrSentiment, delSentiment, getSentiment } from "../controllers/sentiment.controller.js";
import { getAlarm, updateAlarm } from "../controllers/sentiment.controller.js";
import { wrComment, delComment } from "../controllers/sentiment.controller.js";
import { sentimentList, sentimentListFollowing } from "../controllers/sentiment.controller.js";

export const sentimentRouter = express.Router({mergeParams: true});
export const alarmtRouter = express.Router({mergeParams: true});

// 센티멘트 조회
sentimentRouter.get('/:sentimentId', asyncHandler(getSentiment));

// 센티멘트 작성
sentimentRouter.post('/:userId/write', upload.array('Img_file', 5) , asyncHandler(wrSentiment));

// 센티멘트 수정
sentimentRouter.patch('/:userId/rewrite/:sentimentId',upload.array('Img_file', 5) , asyncHandler(rewrSentiment));

// 센티멘트 삭제
sentimentRouter.delete('/:userId/delete/:sentimentId', asyncHandler(delSentiment));

// 댓글 작성
sentimentRouter.post('/comments/:userId/write', asyncHandler(wrComment));

// 댓글 삭제
sentimentRouter.delete('/comments/:commentId/:userId/delete', asyncHandler(delComment));

// 알림 조회
alarmtRouter.get('/', asyncHandler(getAlarm));

// 알림 상태 업데이트
alarmtRouter.patch('/', asyncHandler(updateAlarm));

// 센티멘트 리스트 조회
sentimentRouter.get('/list/:cursorId', asyncHandler(sentimentList));

// 팔로우한 사람의 센티멘트 리스트 조회
sentimentRouter.get('/follow/:userId/:cursorId', asyncHandler(sentimentListFollowing));
