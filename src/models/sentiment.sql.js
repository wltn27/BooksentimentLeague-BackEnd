// sentiment.sql.js
// 필요한 데이터를 쿼리(가공)하여 모듈 변수로 추출

export const confirmSentimentID = "SELECT EXISTS(SELECT 1 FROM sentiment WHERE setiment_id = ?) as isExistSentimentId; ";

export const getSentimentInfo = "SELECT * FROM sentiment WHERE sentiment_id = ?;";

export const insertSentimentSql = "INSERT INTO sentiment ( sentiment_title, book_title, score, content, img, created_at) VALUES (?, ?, ?, ?, ?, NOW());";

export const getNickname = "SELCT nickname FROM user WHERE user_id = ?;";


// 센티멘트 수정 
export const updateSentimentSql = "UPDATE sentiment SET book_title = ?, score = ?, content = ?, updated_at = ? WHERE sentiment_id = ? ";
// 이미지 테이블 업데이트
export const updateImageSql = "UPDATE image SET image = ? WHERE sentiment_id = ? ";

// 센티멘트 삭제 
export const deleteSentimentSql = "DELETE * FROM sentiment WHERE sentiment_id = ?;";



