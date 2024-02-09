// rank.dao.js
import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import { getRankInfo } from "./rank.sql.js";

export const getRankingListDao = async (season, cursorId) => {
    try {
        const conn = await pool.getConnection();
        const [totalRank] = await conn.query(getRankInfo, [season, (cursorId - 1) * 15]); 
        conn.release();

        if (totalRank.length === 0) {
            return {
                message: `해당 시즌(season =${season})의 데이터가 없습니다 .`,
                data: []  
            };
        }

        for (let i = 0; i < totalRank.length; i++) {
            totalRank[i].ranking = i + 1;
        }

        console.log('totalRank: ', totalRank);
        return totalRank;
    } catch (error) {
        console.error('Error: ', error);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

