// search.route.js

import express from "express";
import asyncHandler from 'express-async-handler';
import { searchAllController, searchBookController, searchSentimentController, searchUserController } from "../controllers/search.controller.js";
export const searchRouter = express.Router();

//전체 검색
searchRouter.post('/search', asyncHandler(searchAllController));

//관련 서적
searchRouter.post('/search/book', asyncHandler(searchBookController));
//관련 센티멘트
searchRouter.post('/search/sentiment', asyncHandler(searchSentimentController));
//관련 유저
searchRouter.post('/search/user', asyncHandler(searchUserController));





