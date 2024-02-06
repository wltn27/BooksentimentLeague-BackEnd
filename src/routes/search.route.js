// search.route.js
import express from "express";
import asyncHandler from 'express-async-handler';

// import controller
import { getSearchListSentiment, getSearchListNick } from "../controllers/search.controller.js";
//getSearchListAll, getSearchListBook

export const searchRouter = express.Router({mergeParams: true});

// searchRouter.get('/', asyncHandler(getSearchListAll));
// searchRouter.get('/book', asyncHandler(getSearchListBook));
searchRouter.get('/sentiment', asyncHandler(getSearchListSentiment));
searchRouter.get('/nickname', asyncHandler(getSearchListNick));