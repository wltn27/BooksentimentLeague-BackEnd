export const insertCommentQuery = `
    INSERT INTO comment (user_id, sentiment_id, parent_id, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, NOW(), NOW());
`;

export const selectInsertedCommentQuery = `
    SELECT u.nickname, t.tier, c.created_at, u.profile_image, c.content,
           (SELECT COUNT(*) FROM user_comment WHERE comment_id = LAST_INSERT_ID() AND \`like\` = 1) as like_num,
           c.parent_id, c.comment_id
    FROM comment c
    JOIN user u ON c.user_id = u.user_id
    LEFT JOIN user_tier ut ON u.user_id = ut.user_id
    LEFT JOIN tier t ON ut.tier_id = t.tier_id
    WHERE c.comment_id = LAST_INSERT_ID();
`;

export const findCommentByIdQuery = "SELECT * FROM comment WHERE comment_id = ?;";

export const deleteCommentQuery = "DELETE FROM comment WHERE comment_id = ?;";

// 댓글/대댓글 작성 알림
export const insertAlarmQuery = `
    INSERT INTO alarm (user_id, title, content, read_at, created_at)
    VALUES (?, ?, ?, 0, NOW());
`;