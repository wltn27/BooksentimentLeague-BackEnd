// sentiment.controller.js
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
//import { getUserId } from "../models/sentiment.sql.js";

import { insertSentiment } from "../services/sentiment.service.js";
import { updateSentiment } from "../services/sentiment.service.js";
import { deleteSentiment } from "../services/sentiment.service.js";
import { deleteImage } from "../services/sentiment.service.js";

// 센티멘트 작성
export const wrSentiment = async (req, res, next ) => {
    console.log("센티멘트 작성 요청");
    console.log("body", req.body);
    console.log("files", req.file);
    res.send(response(status.SUCCESS, await insertSentiment(req.params.userId, req.body, req.file)));
}

// 센티멘트 수정
export const rewrSentiment = async (req, res, next ) => {
    console.log("센티멘트 수정 요청");
    console.log("body", req.body);
    console.log("files", req.file);
    /*
    const currentId = req.params.user-id;
    const postId = await pool.query(getUserId,[req.params.sentiment-id]);
    if ( currentId == postId ) {
        */
        res.send(response(status.SUCCESS, await updateSentiment(req.params.sentimentId, req.body)));
    /*
    } else {
        console.log("현재 사용자와 작성자가 일치하지 않습니다.");
        res.send(response(status.NOT_EQUAL_USER));
    }
    */
}

// 센티멘트 삭제
export const delSentiment = async (req, res, next ) => {
    console.log("센티멘트 삭제 요청");
    res.send(response(status.SUCCESS, await deleteSentiment(req.params.sentimentId)));
}


// 이미지 삭제
export const delImage = async(req, res, next ) => {
    console.log("이미지 삭제 요청");
    res.send(response(status.SUCCESS, await deleteImage(req.file)));
}