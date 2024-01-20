export const authRouter = express.Router();
authRouter.post('/send-verification-email', asyncHandler(sendEmailVerification));

// user.route.js

import express from "express";
import asyncHandler from 'express-async-handler';

import { userSignin, checkEmail, checkNick, userLogin, sendEmailVerification, userFindPass, userChangePass} from "../controllers/user.controller.js";

export const userRouter = express.Router({mergeParams: true});

userRouter.post('/signin', asyncHandler(userSignin));
userRouter.post('/signin/emailcheck', asyncHandler(checkEmail));
userRouter.post('/signin/nickcheck', asyncHandler(checkNick));
userRouter.post('/login', asyncHandler(userLogin));
userRouter.post('/auth', asyncHandler(sendEmailVerification));
userRouter.post('/findpass', asyncHandler(userFindPass));
userRouter.post('/changepass', asyncHandler(userChangePass));
