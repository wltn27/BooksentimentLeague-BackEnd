// sentiment.route.js
import express from "express";
import asyncHandler from 'express-async-handler';
import { upload} from '../middleware/ImageUploader.js';

// import controller
import { wrSentiment, rewrSentiment, delSentiment } from "../controllers/sentiment.controller.js";
export const sentimentRouter = express.Router({mergeParams: true});

// 센티멘트 작성
// upload.array('image', 5) : 최대 이미지 다섯개까지 업로드 가능 / upload.single('image') : 단일 이미지 업로드
sentimentRouter.post('/:userId/write', upload.single('Img_file', 5) , asyncHandler(wrSentiment));


// 센티멘트 수정
sentimentRouter.patch('/:userId/rewrite/:sentimentId',upload.single('Img_file', 5) , asyncHandler(rewrSentiment),
);
/*
await Promise.all([
    asyncHandler(delImage), // 비동기 함수 1
  // 다른 비동기 함수들 추가 가능
]
*/
// 센티멘트 삭제
sentimentRouter.delete('/:userId/delete/:sentimentId', asyncHandler(delSentiment));



