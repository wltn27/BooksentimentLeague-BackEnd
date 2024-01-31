// followSentiment.sql.js

export const getFollowSentimentsQuery = `
SELECT
    s.sentiment_id,
    s.text,
    s.created_at,
    u.user_id,
    u.nickname
FROM sentiment s
JOIN user_follow uf ON s.user_id = uf.following_user_id
JOIN user u ON s.user_id = u.user_id
WHERE uf.user_id = ?
ORDER BY s.created_at DESC;
`;