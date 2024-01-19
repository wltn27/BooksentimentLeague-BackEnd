// search.dao.js

import { pool } from "../../config/db.connect.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { sortBook, sortSentiment, sortNickname } from "./search.sql.js";
import { getSentimentInfo, getUserInfo, getBookInfo} from "./sentiment.sql.js";

// Sentiment 정보 얻기 
export const getSentiment = async(sentimentID) => {
    try {
        const conn = await pool.getConnection();
        const [sentiment] = await pool.query( getSentimentInfo, sentimentID);

        console.log(sentiment);

        if(sentiment.length == 0) {
            return -1;
        }

        conn.release();
        return sentiment;

    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// Book 정보 얻기 
export const getBook = async(bookID) => {
    try {
        const conn = await pool.getConnection();
        const [book] = await pool.query( getBookInfo, bookID);

        console.log(book);

        if(book.length == 0) {
            return -1;
        }

        conn.release();
        return book;

    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// user 정보 얻기 
export const getuser = async(userID) => {
    try {
        const conn = await pool.getConnection();
        const [user] = await pool.query( getUserInfo, userID);

        console.log(user);

        if(user.length == 0) {
            return -1;
        }

        conn.release();
        return user;

    } catch (err) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}
