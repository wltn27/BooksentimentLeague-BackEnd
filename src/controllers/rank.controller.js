// rankt.controller.js
import { StatusCodes } from "http-status-codes";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import { getRankingListProvider } from "../providers/rank.provider.js";

dotenv.config();

// 랭킹 리스트 조회
export const getRankingList = async (req, res, next ) => {
    console.log("랭킹 리스트 조회 요청");
    /*
    const token = req.cookies.refreshToken;
    console.log('token : ', token);
    const data = jwt.verify(token, process.env.REFRESH_SECRET);
    console.log('data : ', data);
    const userData = data.nickname; // 사용자 정보 반환
    */
    res.send(response(status.SUCCESS, await getRankingListProvider(req.query.season || 1, req.body.cursorId)));
}