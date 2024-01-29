// sentiment.route.js
import express from "express";
import asyncHandler from 'express-async-handler';
import { upload} from '../middleware/ImageUploader.js';

// import controller
import { wrSentiment, rewrSentiment, delSentiment, delImage } from "../controllers/sentiment.controller.js";
export const sentimentRouter = express.Router({mergeParams: true});

// 센티멘트 작성
sentimentRouter.post('/:userId/write', upload.single('image', 10) ,asyncHandler(wrSentiment));


// 센티멘트 수정
sentimentRouter.patch('/:user-Id/rewrite/:sentimentId', asyncHandler(rewrSentiment),
);
/*
await Promise.all([
    asyncHandler(delImage), // 비동기 함수 1
  // 다른 비동기 함수들 추가 가능
]
*/
// 센티멘트 삭제
sentimentRouter.delete('/:userId/delete/:sentimentId', asyncHandler(delSentiment));



