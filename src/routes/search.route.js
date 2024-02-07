// search.route.js
import express from "express";
import asyncHandler from 'express-async-handler';

// import controller
import { getSearchBooks, getSearchListSentiment, getSearchListNick } from "../controllers/search.controller.js";
//getSearchListAll

export const searchRouter = express.Router({mergeParams: true});

searchRouter.get('/title', asyncHandler(getSearchBooks));

//searchRouter.get('/', asyncHandler(getSearchListAll));
searchRouter.get('/book', asyncHandler(getSearchBooks));
searchRouter.get('/sentiment', asyncHandler(getSearchListSentiment));
searchRouter.get('/nickname', asyncHandler(getSearchListNick));
