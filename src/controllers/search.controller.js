// sentiment.controller.js
import { StatusCodes } from "http-status-codes";
import { BaseError } from "../../config/error.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import { readSearchListSentiment, readSearchListNick, searchForBooks } from './../providers/search.provider.js';

// 도서 검색 API
export const getSearchBooks = async (req, res) => {
    try {
      const title = req.query.query;
      const bookData = await searchForBooks(title, 5, 1, req.body.userId);   // 5개씩, 처음부터
      if(bookData == '')
        return res.status(StatusCodes.OK).json({message : "검색어에 맞는 결과가 없습니다."});
      res.status(StatusCodes.OK).json({ bookData });
    } catch (error) {
      console.error('Search Books Error:', error);
      return new BaseError(status.FAIL_SEARCH_BOOK);
    }
};

// 검색결과 리스트(전체) 조회
export const getSearchListAll = async (req, res, next ) => {
    console.log("검색결과 리스트(전체) 요청");
    
    const searchBookObject = await searchForBooks(req.query.query, 3, 1, req.body.userId);
    const searchSentimentObject = await readSearchListSentiment(req.query.query, 3, 0);
    const searchNicknameObject = await readSearchListNick(req.query.query, 3, 0, req.body.userId);

    if(searchBookObject == '' && searchSentimentObject == '' && searchNicknameObject == '')
        return res.status(StatusCodes.OK).json({message : "검색어에 맞는 결과가 없습니다."});
    return res.status(StatusCodes.OK).send({searchBookObject, searchSentimentObject, searchNicknameObject});
}

// 검색결과 리스트(센티멘트) 조회
export const getSearchListSentiment = async (req, res, next ) => {
    console.log("검색결과 리스트(센티멘트) 조회 요청");

    const searchListObject = await readSearchListSentiment(req.query.query, 10, req.body.cursorId);

    if(searchListObject == '')
        return res.status(StatusCodes.OK).json({message : "검색어에 맞는 결과가 없습니다."});
    return res.status(StatusCodes.OK).json(searchListObject);
}

// 검색결과 리스트(닉네임) 조회
export const getSearchListNick = async (req, res, next ) => {
    console.log("검색결과 리스트(닉네임) 조회 요청");

    const searchListObject = await readSearchListNick(req.query.query, 10, req.body.cursorId, req.body.userId);

    if(searchListObject == '')
        return res.status(StatusCodes.OK).json({message : "검색어에 맞는 결과가 없습니다."});
    return res.status(StatusCodes.OK).json(searchListObject);
}