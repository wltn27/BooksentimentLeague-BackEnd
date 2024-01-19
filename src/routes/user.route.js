import express from 'express';
import asyncHandler from 'express-async-handler';
import { sendEmailVerification } from '../controllers/user.controller.js';

export const userRouter = express.Router({mergeParams: true});
userRouter.post('/signin/auth', asyncHandler(sendEmailVerification));

export const authRouter = express.Router();
authRouter.post('/send-verification-email', asyncHandler(sendEmailVerification));