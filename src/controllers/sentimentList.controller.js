// sentiment.controller.js
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { sentimentList, sentimentPost } from "../services/sentimentList.service.js";

// 센티멘트 조회
export const sentimentListController = async (req, res, next) => {
    console.log("센티멘트 조회");
    res.send(response(status.SUCCESS, await sentimentList(req.params.userId, req.body, req.file)));
}


// 센티멘트 게시글 조회
export const sentimentPostController = async (req, res, next) => {
    console.log("센티멘트 게시글 조회");
    res.send(response(status.SUCCESS, await sentimentPost(req.params.userId, req.body, req.file)));
}