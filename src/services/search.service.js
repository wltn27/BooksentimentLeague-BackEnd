// search.service.js

import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { bookSearchDTO, sentimentSearchDTO, userSearchDTO } from "../dtos/search.response.dto.js";
import { getBook, getSentiment, getUser } from "../models/search.dao.js";

//관련서적 검색
export const bookSearch = async(bookId, body) => {
    const bookSearchData = await getBook(userId, {
        'sentiment_id' : body.sentiment_id,
        'user_id' : body.user_id,
        'book_title' : body.book_title,
        'score' : body.score,
        'content' : body.content,
        'book_image' : body.book_image,
        'season' : body.season
    });

    if (bookSearchData == -1 ) {
        throw new BaseError(status.SENTIMENT_ALREADY_EXIST);
    } else {
        return bookSearchDTO(await getSentiment(bookSearchData));
    }
}

//관련 센티멘트 검색
export const sentimentSearch = async(bookId, body) => {
    const sentimentSearchData = await getSentiment(userId, {
        "title":body.title,                            
	    "book_image":body.book_image,                    
		"author":body.author,                                               
		"publisher":body.publisher,                        
		"pubdate":body.pubdate,
		"avr_score":body.avr_score,
		"eval_num":body.eval_num
    });

    if (sentimentSearchData == -1 ) {
        throw new BaseError(status.SENTIMENT_NOT_FOUND);
    } else {
        return sentimentSearchDTO(await getSentiment(sentimentSearchData));
    }
}

//관련 유저 검색
export const userSearch = async(userId, body) => {
    const userSearchData = await getuser(userId, {
        "nickname" : data.nickname, 
        "created_at" : data.created_at,
        "sentiment_title" : data.sentiment_title,
        "book_title" : data.book_image,
        "score" : data.score,
        "content" : data.content,
        "image_path": data.image_path,
        "book_image": data.book_image
    });

    if (userSearchData == -1 ) {
        throw new BaseError(status.SENTIMENT_ALREADY_EXIST);
    } else {
        return userSearchDTO(await getUser(userSearchData));
    }
}
