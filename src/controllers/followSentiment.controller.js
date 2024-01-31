// followSentiment.controller.js

import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { getFollowSentimentList } from "../services/followSentiment.service.js";

export const followSentimentsController = async (req, res, next) => {
    console.log("팔로우한 사람의 센티멘트 리스트 요청");

    const userId = req.body.userId;

    try {
        const result = await getFollowSentimentList(userId);
        res.send(response(status.SUCCESS, result));
    } catch (error) {
        console.error("Error in followSentimentsController:", error);
        res.status(status.INTERNAL_SERVER_ERROR).send(response(status.INTERNAL_SERVER_ERROR, null));
    }
};