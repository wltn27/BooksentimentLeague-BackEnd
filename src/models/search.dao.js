// search.dao.js

import { pool } from "../../config/db.config.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getSentimentInfoByTitle, getUserInfoByNick, getBookInfoByTitle} from "./search.sql.js";




// 일반적인 데이터 조회 함수
const getDataByField = async (query, field, value) => {
    try {
        const conn = await pool.getConnection();
        const [data] = await pool.query(query, value);

        console.log(data);

        if (data.length === 0) {
            return -1;
        }

        conn.release();
        return data;
    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

//도서 정보 얻기
export const getBookByTitle = async (bookTitle) => {
    return await getDataByField(getBookInfoByTitle, 'title', `%${bookTitle}%`);
};

//센티멘트 정보 얻기
export const getSentimentByTitle = async (sentimentID) => {
    return await getDataByField(getSentimentInfoByTitle, 'sentiment', sentimentID);
};

//유저 정보 얻기
export const getUserByNick = async (userID) => {
    return await getDataByField(getUserInfoByNick, 'user', userID);
};
