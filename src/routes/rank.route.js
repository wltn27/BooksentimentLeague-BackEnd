// sentiment.route.js
import express from "express";
import asyncHandler from 'express-async-handler';

// import controller
import { getRankingList } from "../controllers/rank.controller.js";

export const rankRouter = express.Router({mergeParams: true});

rankRouter.get('/:cursorId', asyncHandler(getRankingList));