// sentiment.sql.js
// 필요한 데이터를 쿼리(가공)하여 모듈 변수로 추출
export const confirmSentiment = "SELECT EXISTS(SELECT 1 FROM sentiment WHERE user_id = ? AND book_title = ?) as isExistSentiment;";

// 정보 불러오기
export const getSentimentInfo = "SELECT * FROM sentiment WHERE sentiment_id = ?;";
export const getImageSql = "SELECT image FROM image WHERE sentiment_id = ?;"
export const getNickname = "SELECT nickname FROM user WHERE user_id = ?;";
export const getUserId = "SELECT user_id from sentiment where sentiment_id =?;";
export const getSentimentId = "SELECT LAST_INSERT_ID() AS lastId;";
// 센티멘트 삽입/삭제
export const insertSentimentSql = "INSERT INTO sentiment (user_id, sentiment_title, book_title, score, content, book_image, author, publisher, season, created_at) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );";
export const insertUserSentiment = "INSERT INTO user_sentiment (user_id, sentiment_id, `like`, `scrap`) VALUES (?,?,0,0);"; 
export const deleteSentimentSql = "DELETE FROM sentiment WHERE sentiment_id = ?;";
export const deleteUserSentimentSql = "DELETE FROM user_sentiment WHERE sentiment_id = ?;";
export const updateSentimentSql = "UPDATE sentiment SET sentiment_title= ? ,book_title = ?, score = ?, content = ?, updated_at = ? WHERE sentiment_id = ?;";

// 이미지 삽입/삭제
export const insertImageSql = "INSERT INTO image ( sentiment_id, image ) VALUES ( ?, ?);";
export const deleteImageSql = "DELETE FROM image WHERE sentiment_id = ?;";
export const modifyImageSql = "DELETE FROM image WHERE image = ?;";

// 작성한 댓글을 DB에 삽입
export const insertCommentQuery = `
    INSERT INTO comment (user_id, sentiment_id, parent_id, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, NOW(), NOW());
`;

// 방금 작성한 댓글에 대한 정보 검색
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
// 댓글 리스트 조회
export const getCommentList = "SELECT * FROM comment WHERE sentiment_id = ?;";

// 댓글 존재 확인
export const findCommentByIdQuery = "SELECT * FROM comment WHERE comment_id = ?;";

// 댓글 삭제
export const deleteCommentQuery = "DELETE FROM comment WHERE comment_id = ?;";

// 댓글/대댓글 작성 알림
export const insertAlarmQuery = `
    INSERT INTO alarm (user_id, title, content, read_at, created_at)
    VALUES (?, ?, ?, 0, NOW());
`;

// 티어 상승 조건 조회
export const totalSentiment = "SELECT * FROM sentiment WHERE user_id = ?;";
export const totalRecommend = "SELECT SUM(`like`) as totalLikes FROM user_sentiment WHERE user_id = ?;";

// 티어 생성 및 업데이트, 조회
export const updateTier = "UPDATE user_tier SET tier_id = ? WHERE user_id = ?";
export const getTierId = "SELECT tier_id AS currentTier FROM user_tier WHERE user_id='1';";

// 티어 상승 알람 생성
export const tierAlarm = "INSERT INTO alarm (user_id, title, content, read_at, created_at) VALUES (?, ?, ?, 0, ?);";

// 알람 상태 업데이트
export const alarmStatus = "UPDATE alarm SET read_at = 1 WHERE alarm_id=?;";
export const getAlarmStatus = "SELECT read_at FROM alarm WHERE alarm_id=?";
export const getAlarmInfo = "SELECT title, content, read_at, created_at FROM alarm WHERE user_id= ?;";