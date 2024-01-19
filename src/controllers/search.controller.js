// search.controller.js
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { bookSearch, sentimentSearch, userSearch } from "../services/sentiment.service.js";


//관련서적 검색
export const searchPost1= async (req, res, next) => {
    console.log("관련서적 검색 요청");

    res.send(response(status.SUCCESS, await bookSearch(req.params.book-id, req.body)));
}

//관련 센티멘트 검색
export const searchPost2 = async (req, res, next) => {
    console.log("센티멘트 검색 요청");

    res.send(response(status.SUCCESS, await sentimentSearch(req.params.sentiment-id, req.body)));
}

//관련 유저 검색
export const searchPost3 = async (req, res, next) => {
    console.log("닉네임 검색 요청");

    res.send(response(status.SUCCESS, await userSearch(req.params.user-id, req.body)));
}

