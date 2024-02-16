// rank.provider.js
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getRankingListDao} from "../models/rank.dao.js";
import { rankDTO } from '../dtos/rank.response.dto.js';

// 랭킹 리스트 조회
export const getRankingListProvider = async(season, cursorId, nickname ) => {
    const rankData = await getRankingListDao(season, cursorId, nickname);

    // 반환된 데이터가 배열인 경우 rankDTO를 호출합니다.
    if (Array.isArray(rankData.data) && rankData.data.length > 0) {
        return rankDTO(rankData);
    }

    // 배열이 아닌 경우 해당 데이터를 그대로 반환합니다.
    return rankData;
}