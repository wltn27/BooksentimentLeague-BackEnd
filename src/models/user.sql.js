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

export const deleteFollow = "DELETE FROM follow WHERE follower_id = ? AND following_id = ?;";