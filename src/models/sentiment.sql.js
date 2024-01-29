// sentiment.sql.js
// 필요한 데이터를 쿼리(가공)하여 모듈 변수로 추출

export const confirmSentiment = "SELECT EXISTS(SELECT 1 FROM sentiment WHERE user_id = ? AND book_title = ?) as isExistSentiment;";

// 정보 불러오기
export const getSentimentInfo = "SELECT * FROM sentiment WHERE sentiment_id = ?;";
export const getImageSql = "SELECT image FROM image WHERE sentiment_id = ?;"
export const getNickname = "SELECT nickname FROM user WHERE user_id = ?;";
export const getUserId = "SELECT user_id from sentiment where sentiment_id =?;";

// 센티멘트 삽입/삭제
export const insertSentimentSql = "INSERT INTO sentiment (user_id, sentiment_title, book_title, score, content, book_image, author, publisher, season, created_at) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );";
export const deleteSentimentSql = "DELETE FROM sentiment WHERE sentiment_id = ?;";
export const updateSentimentSql = "UPDATE sentiment SET sentiment_title= ? ,book_title = ?, score = ?, content = ?, updated_at = ? WHERE sentiment_id = ?;";

// 이미지 삽입/삭제
export const insertImageSql = "INSERT INTO image ( sentiment_id, image ) VALUES ( ?, ?);";
export const deleteImageSql = "DELETE FROM image WHERE sentiment_id = ?;";
export const modifyImageSql = "DELETE FROM image WHERE image = ?;";

