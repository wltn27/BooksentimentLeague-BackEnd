// sentiment.controller.js
import { StatusCodes } from "http-status-codes";
import { BaseError } from "../../config/error.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import { readSearchListSentiment, searchForBooks } from './../providers/search.provider.js';
// readSearchListAll, readSearchListBook, readSearchListNick

// 도서 검색 API
export const getSearchBooks = async (req, res) => {
    try {
      const { title } = req.query.query;
      const bookData = await searchForBooks(title);
      res.status(StatusCodes.OK).json({ bookData });
    } catch (error) {
      console.error('Search Books Error:', error);
      res.status(500).json({ message: "도서 검색에 실패했습니다." });
    }
};

// 도서 검색 api 구현되면 그때 함

// // 검색결과 리스트(전체) 조회
// export const getSearchListAll = async (req, res, next ) => {
//     console.log("검색결과 리스트(전체) 요청");
    
//     const searchListObject = await readSearchListAll(req.query.query);

//     if(!searchListObject)
//         return res.status(StatusCodes.NOT_FOUND).json(new BaseError(status.SENTIMENT_NOT_FOUND));
//     return res.status(StatusCodes.OK).json([{"sentiment" : searchListObject}, commentObject])
// }

// 검색결과 리스트(센티멘트) 조회
export const getSearchListSentiment = async (req, res, next ) => {
    console.log("검색결과 리스트(센티멘트) 조회 요청");

    const searchListObject = await readSearchListSentiment(req.query.query, req.body.cursorId);

    if(searchListObject == '')
        return res.status(StatusCodes.OK).json({"sentimentObject" : searchListObject});
    return res.status(StatusCodes.OK).json(searchListObject)
}

// 검색결과 리스트(닉네임) 조회
export const getSearchListNick = async (req, res, next ) => {
    console.log("검색결과 리스트(닉네임) 조회 요청");

}