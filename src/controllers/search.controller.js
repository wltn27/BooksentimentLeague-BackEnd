// sentiment.controller.js
import { StatusCodes } from "http-status-codes";
import { BaseError } from "../../config/error.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { readSearchListAll, readSearchListBook, readSearchListSentiment, readSearchListNick } from './../providers/search.provider.js';


// 도서 검색 api 구현되면 그때 함

// // 검색결과 리스트(전체) 조회
// export const getSearchListAll = async (req, res, next ) => {
//     console.log("검색결과 리스트(전체) 요청");
    
//     const searchListObject = await readSearchListAll(req.query.query);

//     if(!searchListObject)
//         return res.status(StatusCodes.NOT_FOUND).json(new BaseError(status.SENTIMENT_NOT_FOUND));
//     return res.status(StatusCodes.OK).json([{"sentiment" : searchListObject}, commentObject])
// }

// // 검색결과 리스트(관련 서적) 조회
// export const getSearchListBook = async (req, res, next ) => {
//     console.log("검색결과 리스트(관련 서적) 요청");
// }

// 검색결과 리스트(센티멘트) 조회
export const getSearchListSentiment = async (req, res, next ) => {
    console.log("검색결과 리스트(센티멘트) 조회 요청");

    const searchListObject = await readSearchListSentiment(req.query.query);

    if(!searchListObject)
        return res.status(StatusCodes.NOT_FOUND).json(new BaseError(status.SENTIMENT_NOT_FOUND));
    return res.status(StatusCodes.OK).json([{"sentiment" : searchListObject}, commentObject])
}

// 검색결과 리스트(닉네임) 조회
export const getSearchListNick = async (req, res, next ) => {
    console.log("검색결과 리스트(닉네임) 조회 요청");

}