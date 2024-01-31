// rank.controller.js
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { rankList, rankSearchList } from "../services/rank.service.js";


// 전체 검색
export const rankController = async (req, res, next) => {
    const { season } = req.body;
    console.log("전체 랭킹 리스트 요청, Season:", season);

    res.send(response(status.SUCCESS, await rankList(req.body)));
}

// 유저 검색
export const rankSearchController = async (req, res, next) => {
    const { searchKeyword, season } = req.body;
    console.log("유저 랭킹 리스트 요청, Season:", season);

    res.send(response(status.SUCCESS, await rankSearchList(req.body)));
}

