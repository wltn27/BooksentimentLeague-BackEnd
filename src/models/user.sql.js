// signIn, login
export const confirmEmail = "SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail";

export const confirmNick = "SELECT EXISTS(SELECT 1 FROM user WHERE nickname = ?) as isExistNick";

export const insertUserSql = "INSERT INTO user (email, password, nickname) VALUES (?, ?, ?);";

export const getUserData = "SELECT * FROM user WHERE user_id = ?";

export const changeUserPassword = "UPDATE user set password = ? WHERE user_id = ?";

export const updateUserData = "UPDATE user set status_message = ?, profile_image = ?";

export const getUserId = "SELECT user_id FROM user WHERE email = ?";

export const getUserPassword = "SELECT password FROM user WHERE email = ?";

export const getUserFromEmail = "SELECT * FROM users WHERE email = ?";

// follow
export const insertFollow = "INSERT INTO follow (following_id, follower_id) VALUES (?, ?);";

export const confirmFollow = "SELECT EXISTS (SELECT * FROM follow WHERE following_id = ? AND follower_id = ?) as isExistFollow;"

export const deleteFollow = "DELETE FROM follow WHERE following_id = ? AND follower_id = ?;";

// like - sentiment
export const likeSentimentQuery = `
    INSERT INTO user_sentiment (user_id, sentiment_id, \`like\`) 
    VALUES (?, ?, 1)
    ON DUPLICATE KEY UPDATE \`like\` = 1;
`;

export const unlikeSentimentQuery = `
    UPDATE user_sentiment 
    SET \`like\` = 0 
    WHERE user_id = ? AND sentiment_id = ? AND \`like\` = 1;
`;

export const checkSentimentOwnerQuery = `SELECT user_id FROM sentiment WHERE sentiment_id = ?;`;

export const checkUserSentimentLikeStatusQuery = `SELECT \`like\` FROM user_sentiment WHERE user_id = ? AND sentiment_id = ?;`;

// like - comment
export const likeCommentQuery = `
    INSERT INTO user_comment (user_id, comment_id, \`like\`) 
    VALUES (?, ?, 1)
    ON DUPLICATE KEY UPDATE \`like\` = 1;
`;

export const unlikeCommentQuery = `
    UPDATE user_comment 
    SET \`like\` = 0 
    WHERE user_id = ? AND comment_id = ? AND \`like\` = 1;
`;

export const checkCommentOwnerQuery = `SELECT user_id FROM comment WHERE comment_id = ?;`;

export const checkUserCommentLikeStatusQuery = `SELECT \`like\` FROM user_comment WHERE user_id = ? AND comment_id = ?;`;

// scrap
export const scrapSentimentQuery = `
    INSERT INTO user_sentiment (user_id, sentiment_id, scrap) 
    VALUES (?, ?, 1)
    ON DUPLICATE KEY UPDATE scrap = 1;
`;

export const unscrapSentimentQuery = `
    UPDATE user_sentiment 
    SET scrap = 0 
    WHERE user_id = ? AND sentiment_id = ? AND scrap = 1;
`;

export const checkUserSentimentScrapStatusQuery = `SELECT scrap FROM user_sentiment WHERE user_id = ? AND sentiment_id = ?;`;

export const getUserAlarmQuery = `SELECT title, content, read_at, created_at
    FROM alarm
    WHERE user_id = ?
    ORDER BY created_at DESC;
`

// 티어 상승 조건 조회
export const totalSentiment = "SELECT * FROM sentiment WHERE user_id = ?;";
export const totalRecommend = "SELECT SUM(`like`) as totalLikes FROM user_sentiment WHERE user_id = ?;";

// 티어 생성 및 업데이트, 조회
export const makeTier = "INSERT INTO user_tier (user_id, tier_id, season) VALUES (?, ?, 1);";
export const updateTier = "UPDATE user_tier SET tier_id = ? WHERE user_id = ?";
export const getTierId = "SELECT tier_id AS currentTier FROM user_tier WHERE user_id='1';";

// 티어 상승 알람 생성
export const tierAlarm = "INSERT INTO alarm (user_id, title, content, read_at, created_at) VALUES (?, ?, ?, 0, ?);";

// 알람 상태 업데이트
export const alarmStatus = "UPDATE alarm SET read_at = 1 WHERE alarm_id=?;";
export const getAlarmStatus = "SELECT read_at FROM alarm WHERE alarm_id=?";
export const getAlarmInfo = "SELECT title, content, read_at, created_at FROM alarm WHERE user_id= ?;";