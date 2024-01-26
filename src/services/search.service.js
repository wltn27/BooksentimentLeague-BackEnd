// search.service.js

import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { bookSearchDTO, sentimentSearchDTO, userSearchDTO } from "../dtos/search.response.dto.js";
import { getBookByTitle, getSentimentByTitle, getUserByNick } from "../models/search.dao.js";


//전체 검색
export const searchAll = async (searchText) => {
    const bookSearchData = await getBookByTitle(`%${searchText}%`);
    const sentimentSearchData = await getSentimentByTitle(`%${searchText}%`);
    const userSearchData = await getUserByNick(`%${searchText}%`);

    const result = {
        books: bookSearchData.map(book => bookSearchDTO(book)),
        sentiments: sentimentSearchData.map(sentiment => sentimentSearchDTO(sentiment)),
        users: userSearchData.map(user => userSearchDTO(user))
    };

    return result;
}

//관련 도서 검색
export const bookSearch = async (bookTitle) => {
    try {
        const bookSearchData = await getBookByTitle(`%${bookTitle}%`);

        if (bookSearchData === -1) {
            throw new BaseError(status.SENTIMENT_NOT_FOUND);
        } else {
            return bookSearchData.map((book) => bookSearchDTO(book));
        }
    } catch (error) {
        throw error;
    }
};

//관련 센티멘트 검색
export const sentimentSearch = async (sentimentTitle) => {
    try {
        const SentimentSearchData = await getSentimentByTitle(`%${sentimentTitle}%`);

        if (sentimentSearchData === -1) {
            throw new BaseError(status.SENTIMENT_NOT_FOUND);
        } else {
            return sentimentSearchData.map((sentiment) => sentimentSearchDTO(sentiment));
        }
    } catch (error) {
        throw error;
    }
};

//관련 유저 검색
export const userSearch = async (userNick) => {
    try {
        const userSearchData = await getUserByNick(`%${userNick}%`);

        if (userSearchData === -1) {
            throw new BaseError(status.MEMBER_NOT_FOUND);
        } else {
            return userSearchData.map((user) => userSearchDTO(user));
        }
    } catch (error) {
        throw error;
    }
};



