// search.controller.js
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { bookSearch, sentimentSearch, userSearch } from "../services/search.service.js";


// 전체 검색
export const searchAllController = async (req, res, next) => {
    console.log("전체 검색 요청");

    res.send(response(status.SUCCESS, await searchAll(req.body)));
}



//관련서적 검색
export const searchBookController = async (req, res, next) => {
    console.log("관련서적 검색 요청");
    document.write('hi');
    res.send(response(status.SUCCESS, await bookSearch(req.params.book-id, req.body)));
}

//관련 센티멘트 검색
export const searchSentimentController = async (req, res, next) => {
    console.log("센티멘트 검색 요청");

    res.send(response(status.SUCCESS, await sentimentSearch(req.params.sentiment-id, req.body)));
}

//관련 유저 검색
export const searchUserController = async (req, res, next) => {
    console.log("닉네임 검색 요청");

    res.send(response(status.SUCCESS, await userSearch(req.params.user-id, req.body)));
}

