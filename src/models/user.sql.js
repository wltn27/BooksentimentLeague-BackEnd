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

// like
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

export const checkSentimentOwnerQuery = `
    SELECT user_id FROM sentiment WHERE sentiment_id = ?;
`;

export const checkUserLikeStatusQuery = `
    SELECT \`like\` FROM user_sentiment WHERE user_id = ? AND sentiment_id = ?;
`;