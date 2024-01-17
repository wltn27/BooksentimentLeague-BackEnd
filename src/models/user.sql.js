// signIn, login
export const confirmEmail = "SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail";

export const insertUserSql = "INSERT INTO user (email, password, nickname) VALUES (?, ?, ?);";

export const getUserID = "SELECT * FROM user WHERE user_id = ?";
