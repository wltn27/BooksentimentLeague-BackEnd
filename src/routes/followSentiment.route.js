// followSentiment.route.js

import express from "express";
import asyncHandler from 'express-async-handler';
import { followSentimentsController } from "../controllers/followSentiment.controller.js";
export const followSentimentRouter = express.Router();

followSentimentRouter.post('/followSentiments', asyncHandler(followSentimentsController));
