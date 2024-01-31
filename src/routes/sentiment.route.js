// sentiment.route.js
import express from "express";
import asyncHandler from 'express-async-handler';
import { upload} from '../middleware/ImageUploader.js';

// import controller
import { wrSentiment, rewrSentiment, delSentiment } from "../controllers/sentiment.controller.js";
export const sentimentRouter = express.Router({mergeParams: true});

// 센티멘트 작성
sentimentRouter.post('/:userId/write', upload.array('Img_file', 5) , asyncHandler(wrSentiment));

// 센티멘트 수정
sentimentRouter.patch('/:userId/rewrite/:sentimentId',upload.array('Img_file', 5) , asyncHandler(rewrSentiment));

// 센티멘트 삭제
sentimentRouter.delete('/:userId/delete/:sentimentId', asyncHandler(delSentiment));

import { getAlarm, updateAlarm } from "../controllers/alarm.controller.js";

export const alarmtRouter = express.Router({mergeParams: true});

// 알림 조회
alarmtRouter.get('/:userId/notifications', asyncHandler(getAlarm));

// 알림 상태 업데이트
alarmtRouter.patch('/users/:userId/notifications/:alarmId', asyncHandler(updateAlarm));