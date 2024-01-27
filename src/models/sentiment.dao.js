import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { insertCommentQuery, selectInsertedCommentQuery } from "./../models/sentiment.sql.js";

// 댓글 작성하기
export const createComment = async (sentimentId, userId, parent_id, content) => {
    try {
        const conn = await pool.getConnection();
        await conn.query(insertCommentQuery, [userId, sentimentId, parent_id, content]);
        const [rows] = await conn.query(selectInsertedCommentQuery);
        conn.release();
        return rows[0];
     } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
     }
};