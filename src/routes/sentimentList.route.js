import express from "express";
import asyncHandler from 'express-async-handler';
import { sentimentListController, sentimentPostController} from "../controllers/sentimentList.controller.js";
export const sentimentListRouter = express.Router();
export const sentimentPostRouter = express.Router();

//전체 검색
sentimentListRouter.post('/sentimentList', asyncHandler(sentimentListController));

sentimentPostRouter.post('/sentimentPost', asyncHandler(sentimentPostController));
