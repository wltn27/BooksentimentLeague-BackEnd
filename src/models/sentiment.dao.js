import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { insertCommentQuery, selectInsertedCommentQuery, findCommentByIdQuery, deleteCommentQuery } from "./../models/sentiment.sql.js";
import { insertAlarmQuery } from "./../models/sentiment.sql.js";

// 댓글 작성하기
export const createComment = async (sentimentId, userId, parent_id, content) => {
    try {
        const conn = await pool.getConnection();
        await conn.query(insertCommentQuery, [userId, sentimentId, parent_id, content]);
        const [rows] = await conn.query(selectInsertedCommentQuery);
        
        // sentiment 작성자 ID 조회 (sentimentId를 사용하여 조회)
        const [sentimentUser] = await conn.query(`SELECT user_id FROM sentiment WHERE sentiment_id = ?`, [sentimentId]);
        const sentimentUserId = sentimentUser[0].user_id;
        
        // 알림 제목 설정(댓글/대댓글 구분)
        const title = parent_id ? "새로운 대댓글이 달렸습니다: " : "새로운 댓글이 달렸습니다: ";
        
        // 알림 추가
        await conn.query(insertAlarmQuery, [sentimentUserId, title, content]);
        conn.release();
        
        return rows[0];
     } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
     }
};

// 댓글 존재 확인
export const findCommentById = async (commentId) => {
    const conn = await pool.getConnection();
    const [rows] = await pool.query(findCommentByIdQuery, [commentId]);
    conn.release();
    return rows[0];
};

// 댓글 삭제하기
export const removeComment = async (commentId) => {
    const conn = await pool.getConnection();
    await conn.query(deleteCommentQuery, [commentId]);
    conn.release();
};