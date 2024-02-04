// sentiment.dao.js
import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const getBookByTitle = async (bookTitle) => {
    return await getDataByField(getBookInfoByTitle, 'title', `%${bookTitle}%`);
};