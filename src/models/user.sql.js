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


// 마이 페이지 조회시 쓰는 것들
export const getUserTier = "SELECT tier FROM tier WHERE tier_id = (SELECT tier_id FROM user_tier where user_id = ?);"

export const getFollowerCount = "SELECT COUNT(*) as follower_num FROM follow WHERE following_id = ?;"

export const getFollowingCount = "SELECT COUNT(*) as following_num FROM follow WHERE follower_id = ?;"

export const getSentimentCount = "SELECT COUNT(*) as sentiment_num FROM sentiment WHERE user_id = ? AND season = ?;"

// 유저가 작성한 센티멘트 번호를 먼저 확인 후, where 절에서 in을 사용하여 1차 검증 후 and를 사용해서 좋아요한 수를 파악, in을 배열로 사용할 서 있는가.. 
export const getLikeCount = "SELECT COUNT(*) as like_num FROM user_sentiment WHERE sentiment_id IN (select sentiment_id from sentiment where user_id = ? AND season = ?) AND `like` = 1;"

export const getScrapCount = "SELECT COUNT(*) as scrap_num FROM user_sentiment WHERE sentiment_id IN (select sentiment_id from sentiment where user_id = ? AND season = ?) AND scrap = 1;"