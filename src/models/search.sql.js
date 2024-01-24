// search.sql.js
// 필요한 데이터를 쿼리(가공)하여 모듈 변수로 추출




export const getSentimentInfo = "SELECT * FROM sentiment WHERE sentiment_id = ?;";
export const getBookInfo = "SELECT * FROM book WHERE book_id = ?;";
export const getUserInfo = "SELECT * FROM user WHERE user_id = ?;";



//관련서적 더보기
export const getBookInfoByTitle = "SELECT * FROM book WHERE title LIKE ? LIMIT 3;"; 

//센티멘트 더보기
export const getSentimentInfoByTitle = "SELECT * FROM sentiment WHERE title LIKE ? OR content LIKE ? LIMIT 3;";

//닉네임 더보기
export const getUserInfoByNick = "SELECT * FROM user WHERE nickname LIKE ? LIMIT 3;";





