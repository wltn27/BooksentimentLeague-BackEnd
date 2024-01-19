import { pool, config } from '../../config/db.config.js';
import * as userSql from './user.sql.js';

export const getUserByEmail = async (email) => {
    const [user] = await db.query(userSql.getUserByEmail, [email]);
    return user;
};