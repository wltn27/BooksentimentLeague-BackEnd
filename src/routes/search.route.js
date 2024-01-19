// search.route.js

import express from "express";
import asyncHandler from 'express-async-handler';
import { searchPost1, searchPost2, searchPost3 } from "../controllers/search.controller.js";
export const searchRouter = express.Router({mergeParams: true});

searchRouter.post('/search', asyncHandler(userSignin));

//관련 서적
sentimentRouter.post('/search/book', asyncHandler(searchPost1));
//관련 센티멘트
sentimentRouter.post('/search/sentiment', asyncHandler(searchPost2));
//관련 유저
sentimentRouter.post('/search/user', asyncHandler(searchPost3));





