import { pool } from "../../config/db.config.js";




export const getSentimentsBySentimentIdSortedByRecommend = async (SentimentId, page) => {
    const offset = (page - 1) * pageSize;
    const query = `
      SELECT *
      FROM user_sentiments
      WHERE SentimentId = ?
      ORDER BY like DESC
      LIMIT ? 10;
    `;
  
    const [rows] = await pool.query(query, [SentimentId, offset, pageSize]);
    return rows;
  };

  export const getSentimentsBySentimentId = async (sentimentId) => {
    const query = `
      SELECT *
      FROM sentiments
      WHERE sentimentId = 1?;
    `;

    const [rows] = await pool.query(query, [SentimentId]);
    return rows;
};