// followSentiment.dao.js
import { pool } from "../../config/db.config.js";
import { getFollowSentimentsQuery } from "../models/followSentiment.sql.js";

export async function getFollowSentiments(userId) {
    try {
        const [result] = await pool.execute(getFollowSentimentsQuery, [userId]);
        return result;
    } catch (error) {
        console.error('Error in getFollowSentiments:', error);
        throw error;
    }
}
