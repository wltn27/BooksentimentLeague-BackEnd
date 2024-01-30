// sentiment.controller.js
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import express from "express";
import asyncHandler from 'express-async-handler';
import session from 'express-session';

// 로그인 세션 저장 
export const setUserInLocals = async (req, res, next ) => {
    res.locals.user = req.session.user;
    next();
};
