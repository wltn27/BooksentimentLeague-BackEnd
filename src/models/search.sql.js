// search.sql.js
// 필요한 데이터를 쿼리(가공)하여 모듈 변수로 추출

export const SortPost1 = "SELECT * FROM book WHERE title LIKE '%검색내용%' LIMIT 3";
export const SortPost2 = "SELECT * FROM sentiment WHERE title LIKE '%검색내용%' OR content LIKE '%검색내용%' LIMIT 3; ";
export const SortPost3 = "SELECT * FROM user WHERE nickname LIKE '%검색내용%' LIMIT 3;";



export const getSentimentInfo = "SELECT * FROM sentiment WHERE sentiment_id = ?;";
export const getBookInfo = "SELECT * FROM book WHERE book_id = ?;";
export const getUserInfo = "SELECT * FROM user WHERE user_id = ?;";



//관련서적 더보기
export const sortBook = "SELECT * FROM book WHERE title LIKE '%검색내용%' LIMIT 30; ";
export const sortBookCount ="SELECT COUNT(*) AS related_search_count FROM book WHERE title LIKE '%검색내용%'; ";        //검색결과 갯수

//센티멘트 더보기
export const sortSentiment = "SELECT * FROM sentiment WHERE title LIKE '%검색내용%' OR content LIKE '%검색내용%' LIMIT 30; ";
export const sortSentimentCount ="SELECT COUNT(*) AS related_sentiment_count FROM sentiment title LIKE '%검색내용%' OR content LIKE '%검색내용%'; ";
//닉네임 더보기
export const sortNick = "SELECT * FROM user WHERE nickname LIKE '%검색내용%' LIMIT 30; ";
export const sortNickCount ="SELECT COUNT(*) AS related_nickname_count FROM user WHERE nickname LIKE '%검색내용%'; ";





