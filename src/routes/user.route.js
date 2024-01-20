
import express from 'express';
import asyncHandler from 'express-async-handler';
import { sendEmailVerification } from '../controllers/user.controller.js';

export const userRouter = express.Router({mergeParams: true});
userRouter.post('/signin/auth', asyncHandler(sendEmailVerification));

export const authRouter = express.Router();
authRouter.post('/send-verification-email', asyncHandler(sendEmailVerification));

// user.route.js

import express from "express";
import asyncHandler from 'express-async-handler';

import { userSignin, checkEmail, checkNick, userLogin, userFindPass } from "../controllers/user.controller.js";

export const userRouter = express.Router({mergeParams: true});

userRouter.post('/signin', asyncHandler(userSignin));
userRouter.post('/signin/emailcheck', asyncHandler(checkEmail));
userRouter.post('/signin/nickcheck', asyncHandler(checkNick));
userRouter.post('/login', asyncHandler(userLogin));
userRouter.post('/findpass', asyncHandler(userFindPass));
