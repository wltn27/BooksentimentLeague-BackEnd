// sentiment.controller.js
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import { insertSentiment } from "../services/sentiment.service.js";
import { updateSentiment } from "../services/sentiment.service.js";
import { deleteSentiment } from "../services/sentiment.service.js";
// mport { update } from "../providers/sentiment.provider.js";

// 센티멘트 작성
export const wrSentiment = async (req, res, next ) => {
    console.log("센티멘트 작성 요청");

    res.send(response(status.SUCCESS, await insertSentiment(req.params.user-id, req.body)));
}

// 센티멘트 수정
export const rewrSentiment = async (req, res, next ) => {
    console.log("센티멘트 수정 요청");
    res.send(response(status.SUCCESS, await updateSentiment(req.params.sentiment-id, req.body)));
}

// 센티멘트 삭제
export const delSentiment = async (req, res, next ) => {
    console.log("센티멘트 삭제 요청");
    res.send(response(status.SUCCESS, await deleteSentiment(req.params.sentiment-id)));
}