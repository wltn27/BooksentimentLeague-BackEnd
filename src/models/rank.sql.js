//전체 랭킹 조회
export const getAllUserRankingQuery = `
SELECT
    ut.season,
    u.user_id,
    u.nickname,
    t.tier,
    COUNT(s.sentiment_id) AS sentiment_count,
    COALESCE(SUM(us.like), 0) AS total_likes,
    ROW_NUMBER() OVER (ORDER BY sentiment_count DESC, total_likes DESC) AS RANKING
FROM user u
JOIN user_tier ut ON u.user_id = ut.user_id
JOIN tier t ON ut.tier_id = t.tier_id
LEFT JOIN user_sentiment us ON u.user_id = us.user_id
LEFT JOIN sentiment s ON us.sentiment_id = s.sentiment_id AND s.season = ut.season
WHERE ut.season = ?
GROUP BY ut.season, u.user_id, u.nickname, t.tier
ORDER BY t.tier ASC, sentiment_count DESC, total_likes DESC;
`;

//유저 랭킹 조회
export const getUserRankingByNicknameQuery = `
SELECT
    ut.season,
    u.user_id,
    u.nickname,
    t.tier,
    COUNT(s.sentiment_id) AS sentiment_count,
    COALESCE(SUM(us.like), 0) AS total_likes,
    ROW_NUMBER() OVER (ORDER BY sentiment_count DESC, total_likes DESC) AS RANKING
FROM user u
JOIN user_tier ut ON u.user_id = ut.user_id
JOIN tier t ON ut.tier_id = t.tier_id
LEFT JOIN user_sentiment us ON u.user_id = us.user_id
LEFT JOIN sentiment s ON us.sentiment_id = s.sentiment_id AND s.season = ut.season
WHERE u.nickname LIKE ?
GROUP BY ut.season, u.user_id, u.nickname, t.tier
ORDER BY ut.season ASC, t.tier ASC, sentiment_count DESC, total_likes DESC;
`;