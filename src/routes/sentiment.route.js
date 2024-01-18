// sentiment.route.js
import express from "express";
import asyncHandler from 'express-async-handler';

// import controller
import { wrSentiment, rewrSentiment, delSentiment } from "../controllers/sentiment.controller.js";

export const sentimentRouter = express.Router({mergeParams: true});

// 센티멘트 작성
sentimentRouter.post('/:user-id/write', asyncHandler(wrSentiment));

// 센티멘트 수정
sentimentRouter.patch('/:sentiment-id/rewrite', asyncHandler(rewrSentiment));

// 센티멘트 삭제
sentimentRouter.delete('/:sentiment-id/delete', asyncHandler(delSentiment));
