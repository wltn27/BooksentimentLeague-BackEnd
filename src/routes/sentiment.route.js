// sentiment.route.js
import express from "express";
import asyncHandler from 'express-async-handler';
import {upload} from "../middleware/image.uploader.js";
//import { multerMiddleware } from '../middleware/image.uploader.js';

// import controller
import { wrSentiment, rewrSentiment, delSentiment } from "../controllers/sentiment.controller.js";
export const sentimentRouter = express.Router({mergeParams: true});

// 센티멘트 작성
sentimentRouter.post('/:userId/write', upload.single('image'), asyncHandler(wrSentiment));
// GET /sentiments/:userId/write 에 대한 라우팅
//sentimentRouter.get('/:userId/write', asyncHandler(getSentiment));

// 센티멘트 수정
sentimentRouter.patch('/:user-Id/rewrite/:sentimentId', upload.single('image'), asyncHandler(rewrSentiment));

// 센티멘트 삭제
sentimentRouter.delete('/:userId/delete/:sentimentId', asyncHandler(delSentiment));



