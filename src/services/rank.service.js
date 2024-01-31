// rank.service.js

import { getAllUserRanking, getUserRankingByNickname } from "../models/rank.dao.js";

export async function rankList(requestBody) {
    const { season } = requestBody; 
    try {
        const result = await getAllUserRanking(season);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function rankSearchList(requestBody) {
    const { searchKeyword, season } = requestBody; 
    try {
        const result = await getUserRankingByNickname(searchKeyword, season);
        return result;
    } catch (error) {
        throw error;
    }
}
