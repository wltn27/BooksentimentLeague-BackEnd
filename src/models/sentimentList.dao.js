import { pool } from "../../config/db.config.js";



// 센티멘트 조회
export const getSentimentsBySentimentIdSortedByRecommend = async (sentimentId, page) => {
    const offset = (page - 1) * pageSize;
    const query = `
      SELECT *
      FROM user_sentiments
      WHERE SentimentId = ?
      ORDER BY created_at like DESC
      LIMIT ? 10;
    `;
  
    const [rows] = await pool.query(query, [sentimentId, offset, pageSize]);
    return rows;
  };
// 해당 센티멘트 게시글 조회
  export const getSentimentsBySentimentId = async (sentimentId) => {
    const query = `
      SELECT *
      FROM sentiments
      WHERE sentimentId = 1?;
    `;

    const [rows] = await pool.query(query, [sentimentId]);
    return rows;
};