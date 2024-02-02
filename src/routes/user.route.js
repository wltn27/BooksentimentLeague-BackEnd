// user.route.js

import express from "express";
import asyncHandler from 'express-async-handler';
import { upload } from '../middleware/imageUploader.js';
import { userSignin, checkEmail, checkNick, userLogin, sendEmailVerification, userFindPass, userChangePass, refreshToken, userLogout, myPage, 
        userFollow, userLikeSentiment, userLikeCommment, userScrapSentiment, updateMyPage, sentiment, scrap, follower, following,
        getAlarm, updateAlarm } from "../controllers/user.controller.js";

export const userRouter = express.Router({mergeParams: true});

userRouter.post('/signin', asyncHandler(userSignin));
userRouter.post('/signin/emailcheck', asyncHandler(checkEmail));
userRouter.post('/signin/nickcheck', asyncHandler(checkNick));
userRouter.post('/login', asyncHandler(userLogin));
userRouter.post('/logout', asyncHandler(userLogout));
userRouter.post('/auth', asyncHandler(sendEmailVerification));
userRouter.post('/findpass', asyncHandler(userFindPass));
userRouter.post('/changepass', asyncHandler(userChangePass));
userRouter.post('/follow', asyncHandler(userFollow));
userRouter.post('/like/sentiment/:sentimentId', asyncHandler(userLikeSentiment));
userRouter.post('/like/comment/:commentId', asyncHandler(userLikeCommment));
userRouter.post('/scrap/:sentimentId', asyncHandler(userScrapSentiment));

userRouter.get('/refreshtoken', asyncHandler(refreshToken));
userRouter.get('/mypage', asyncHandler(myPage));
userRouter.get('/sentiment', asyncHandler(sentiment));
userRouter.get('/scrap', asyncHandler(scrap));
userRouter.get('/follower', asyncHandler(follower));
userRouter.get('/following', asyncHandler(following));
userRouter.get('/notifications', asyncHandler(getAlarm));

userRouter.patch('/notifications/:alarmId', asyncHandler(updateAlarm));
userRouter.patch('/mypage', upload.single('Img_file'), asyncHandler(updateMyPage));