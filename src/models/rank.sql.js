// rank.sql.js

export const getRankInfo = `
    SELECT 
        u.nickname,
        u.status_message,
        ut.tier_id AS tier,
        COUNT(DISTINCT s.sentiment_id) AS sentimentCount,
        SUM(us.like) AS totalLikes,
        SUM(us.scrap) AS totalScraps 
    FROM 
        user u
    INNER JOIN 
        sentiment s ON u.user_id = s.user_id AND s.season = ?
    LEFT JOIN 
        user_sentiment us ON u.user_id = us.user_id
    LEFT JOIN 
        user_tier ut ON u.user_id = ut.user_id
    GROUP BY 
        u.user_id
    ORDER BY 
    totalLikes DESC, totalScraps DESC, ut.tier_id DESC, u.user_id ASC
    LIMIT 15 OFFSET ?;
`;

export const getUserRankInfo = `
    SELECT 
        u.nickname,
        u.status_message,
        ut.tier_id AS tier,
        COUNT(DISTINCT s.sentiment_id) AS sentimentCount,
        SUM(us.like) AS totalLikes,
        SUM(us.scrap) AS totalScraps 
    FROM 
        user u
    INNER JOIN 
        sentiment s ON u.user_id = s.user_id AND s.season = ?
    LEFT JOIN 
        user_sentiment us ON u.user_id = us.user_id
    LEFT JOIN 
        user_tier ut ON u.user_id = ut.user_id
    GROUP BY 
        u.user_id
    ORDER BY 
        totalLikes DESC, totalScraps DESC, ut.tier_id DESC, u.user_id ASC;
`;