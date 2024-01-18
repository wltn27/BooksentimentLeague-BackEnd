// user.route.js

import express from "express";
import asyncHandler from 'express-async-handler';

import { userSignin, checkNick, userLogin } from "../controllers/user.controller.js";

export const userRouter = express.Router({mergeParams: true});

userRouter.post('/signin', asyncHandler(userSignin));
userRouter.post('/signin/nickcheck', asyncHandler(checkNick));
userRouter.post('/login', asyncHandler(userLogin));