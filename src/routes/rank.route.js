import express from "express";
import asyncHandler from 'express-async-handler';
import { rankSearchController, rankController } from "../controllers/rank.controller.js";
export const rankRouter = express.Router();
export const rankSearchRouter = express.Router();

rankRouter.post('/rank', asyncHandler(rankController));
rankSearchRouter.post('/rankSearch', asyncHandler(rankSearchController));






