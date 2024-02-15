// search.route.js
import express from "express";
import asyncHandler from 'express-async-handler';

// import controller
import { getSearchListAll, getSearchBooks, getSearchListSentiment, getSearchListNick } from "../controllers/search.controller.js";

export const searchRouter = express.Router({mergeParams: true});

searchRouter.get('/title', asyncHandler(getSearchBooks));

searchRouter.get('/', asyncHandler(getSearchListAll));
searchRouter.get('/book/:cursorId', asyncHandler(getSearchBooks));
searchRouter.get('/sentiment/:cursorId', asyncHandler(getSearchListSentiment));
searchRouter.get('/nickname/:cursorId', asyncHandler(getSearchListNick));
