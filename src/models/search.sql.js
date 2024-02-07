export const getBookSentimentData = `
    SELECT 
        AVG(score) AS avr_score,
        COUNT(*) AS eval_num
    FROM 
        sentiment
    WHERE 
        book_title = ? AND
        author = ? AND
        publisher = ?
    GROUP BY 
        book_title, author, publisher;
`;

// 유저 센티멘트 리스트 조회, 최대 10개 제한
export const getSentiment = `
    SELECT
        s.sentiment_id, book_image, sentiment_title, book_title, score, s.content, s.created_at, author, publisher, s.user_id, t.tier, u.nickname,
        SUM(us.like) AS like_num, SUM(us.scrap) AS scrap_num
    FROM    
        sentiment s
    LEFT JOIN
        user_sentiment us ON s.sentiment_id = us.sentiment_id
    LEFT JOIN
        user u ON s.user_id = u.user_id
    LEFT JOIN
        user_tier ut ON s.user_id = ut.user_id
    LEFT JOIN
        tier t ON ut.tier_id = t.tier_id
    WHERE sentiment_title LIKE ? or s.content LIKE ?
    GROUP BY s.user_id
    ORDER BY like_num desc, ut.tier_id desc, s.user_id ASC
    limit ? offset ?;
`;

export const getSentimentCommentCount = `
SELECT COUNT(*) as comment_num
FROM user_comment as uc 
JOIN (
    SELECT comment_id
    FROM comment
    WHERE sentiment_id = ?
) as c ON uc.comment_id = c.comment_id;` 

// 본인일 경우 follow_status 변경
export const getNickname = `
    SELECT
        u.user_id,
        u.profile_image,
        u.nickname,
        u.status_message,
        CASE WHEN EXISTS (SELECT 1 FROM follow WHERE following_id = u.user_id AND follower_id = ?) THEN 'following' ELSE 'follow' END AS follow_status
    FROM
        user u
    LEFT JOIN
        follow f ON f.following_id = u.user_id
    WHERE
        u.nickname LIKE ?
    GROUP BY
        u.user_id
    ORDER BY
        COUNT(f.following_id) DESC, u.user_id ASC
    LIMIT ? OFFSET ?;
`;