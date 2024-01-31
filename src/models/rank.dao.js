// rank.dao.js

export async function getAllUserRanking(season, page = 1, pageSize = 30) {
    const offset = (page - 1) * pageSize;
    query += ` LIMIT ? OFFSET ?`;

    const result = await pool.query(getAllUserRankingQuery, [season, pageSize, offset]);

    return result.map(mapToUserRankingDTO);
}

export async function getUserRankingByNickname(searchKeyword, season, page = 1, pageSize = 30) {
    const offset = (page - 1) * pageSize;
    query += ` LIMIT ? OFFSET ?`;

    const result = await pool.query(getUserRankingByNicknameQuery, [`%${searchKeyword}%`, season, pageSize, offset]);

    return result.map(mapToUserRankingDTO);
}
