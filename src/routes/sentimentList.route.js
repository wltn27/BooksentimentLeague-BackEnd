import express from "express";
import asyncHandler from 'express-async-handler';
import { sentimentListController, sentimentPostController} from "../controllers/sentimentListcontroller.js";
export const sentimenListRouter = express.Router();
export const sentimenPostRouter = express.Router();

//전체 검색
sentimentListRouter.post('/sentimentList', asyncHandler(sentimentListController));

sentimentPostRouter.post('/sentimentPost', asyncHandler(sentimentPostController));

