// sentiment.route.js

import express from "express";
import asyncHandler from 'express-async-handler';
import { wrComment, delComment } from "../controllers/sentiment.controller.js";

export const sentimentRouter = express.Router({mergeParams: true});

sentimentRouter.post('/comments/:userId/write', asyncHandler(wrComment));
sentimentRouter.delete('/comments/:commentId/delete', asyncHandler(delComment));