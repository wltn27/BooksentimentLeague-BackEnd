// signIn, login
export const confirmEmail = "SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail";

export const confirmNick = "SELECT EXISTS(SELECT 1 FROM user WHERE nickname = ?) as isExistNick";

export const insertUserSql = "INSERT INTO user (email, password, nickname) VALUES (?, ?, ?);";

export const getUserData = "SELECT * FROM user WHERE user_id = ?";

export const changeUserPassword = "UPDATE user set password = ? WHERE user_id = ?";

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

// 마이페이지 프로필 사진, 상태 메시지 변경
export const updateUserData = "UPDATE user set ?, ? WHERE user_id = ?;"

// 팔로워 리스트 조회, 최대 10명 제한
export const getFollower = "SELECT user_id, profile_image, status_message, nickname FROM user WHERE user_id IN (select follower_id from follow where following_id = ?) limit 10;"

//팔로잉 리스트 조회, 최대 10명 제한
export const getFollowing = "SELECT user_id, profile_image, status_message, nickname FROM user WHERE user_id IN (select following_id from follow where follower_id = ?) limit 10;"

export const getFollowerStatus = 
`SELECT following_id,
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM follow
            WHERE following_id IN (SELECT follower_id FROM follow WHERE following_id = ?)
            AND follower_id = ?
        ) THEN 1
        ELSE 0
    END AS isExistFollow
FROM
    follow
WHERE following_id IN (SELECT follower_id FROM follow WHERE following_id = ?)`

export const getFollowingStatus = 
`SELECT follower_id,
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM follow
            WHERE follower_id IN (SELECT following_id FROM follow WHERE follower_id = ?)
            AND following_id = ?
        ) THEN 1
        ELSE 0
    END AS isExistFollow
FROM
    follow
WHERE follower_id IN (SELECT following_id FROM follow WHERE follower_id = ?)`

// 유저 센티멘트 리스트 조회, 최대 10개 제한
export const getSentiment = 
`SELECT sentiment_id, book_image, sentiment_title, book_title, score, created_at FROM sentiment WHERE user_id = ? order by sentiment_id, created_at desc limit 10;`

// 유저 스크랩 리스트 조회, 최대 10개 제한
export const getScrap = 
`SELECT sentiment_id, book_image, sentiment_title, book_title, score, created_at FROM sentiment
WHERE sentiment_id IN (SELECT sentiment_id from user_sentiment where user_id = ? AND scrap = 1)
order by sentiment_id, created_at desc limit 10;`

// 센티멘트 당 좋아요, 스크랩, 댓글 수 조회
export const getSentimentLikeCount = "SELECT COUNT(*) as like_num FROM user_sentiment WHERE sentiment_id = (select sentiment_id from sentiment where user_id = ? limit 1 offset ?) AND `like` = 1;"

export const getSentimentScrapCount = "SELECT COUNT(*) as scrap_num FROM user_sentiment WHERE sentiment_id = (select sentiment_id from sentiment where user_id = ? limit 1 offset ?) AND scrap = 1;;"

export const getSentimentCommentCount = `
SELECT COUNT(*) as comment_num
FROM user_comment as uc 
JOIN (
    SELECT comment_id
    FROM comment
    WHERE sentiment_id = (SELECT sentiment_id FROM sentiment WHERE user_id = ? limit 1 offset ?)
) as c ON uc.comment_id = c.comment_id;` 
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
