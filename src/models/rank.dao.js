// rank.dao.js
import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

import { getRankInfo, getUserRankInfo } from "./rank.sql.js";

export const getRankingListDao = async (season, page_num, nickname = null) => {
    try {
        const conn = await pool.getConnection();
        const [totalRank] = await conn.query(getRankInfo, [season, (page_num - 1) * 15]); 
        if (totalRank.length === 0) {
            return {
                message: `해당 시즌(season =${season})의 데이터가 없습니다 .`,
                data: []  
            };
        }

        for (let i = 0; i < totalRank.length; i++) {
            totalRank[i].ranking = i + 1;
        }

        let userRank = [];

        if(nickname) {
            const [rows] = await conn.query(getUserRankInfo, [season]);
            nickname = nickname.replace(/"/g, '');
            const userRanking = rows.findIndex(row => row.nickname === nickname) + 1;
            userRank = rows.find(row => row.nickname === nickname)|| [];
            if(userRank.length > 0) {
                userRank.ranking = userRanking;
            }
            else if (userRank.length == 0 ) {
                return { totalRank, 
                        message : "조회된 유저가 없습니다." };
            }
        }            
        conn.release();
        console.log('totalRank: ', totalRank);
        return { totalRank, userRank };
    } catch (error) {
        console.error('Error: ', error);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}