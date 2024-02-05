// rank.provider.js
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getRankingListDao} from "../models/rank.dao.js";
import { rankDTO } from '../dtos/rank.response.dto.js';

// 랭킹 리스트 조회
export const getRankingListProvider = async() => {
    const rankData = await getRankingListDao();
    console.log('rankDTO: ', rankDTO(rankData));
    return rankDTO(rankData);
}