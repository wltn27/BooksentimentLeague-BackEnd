// rank.dao.js
import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import { getRankInfo } from "./rank.sql.js";

export const getRankingListDao = async () => {
    try {
        const conn = await pool.getConnection();
        const [rankList] = await conn.query(getRankInfo); 
        conn.release();

        // 랭킹을 계산하여 각 객체에 추가합니다.
        for (let i = 0; i < rankList.length; i++) {
            rankList[i].ranking = i + 1;
        }

        console.log('rankList: ', rankList);
        return rankList;
    } catch (error) {
        console.error('Error: ', error);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}
