export const userSearchDTO = (data) => {
    return { 
        "nickname" : data.nickname, 
        "created_at" : data.created_at,
        "sentiment_title" : data.sentiment_title,
        "book_title" : data.book_image,
        "score" : data.score,
        "content" : data.content,
        "image_path": data.image_path,
        "book_image": data.book_image
    };
}
export const sentimentSearchDTO = (data) => {
    return { 
        'sentiment_id' : body.sentiment_id,
        'user_id' : body.user_id,
        'book_title' : body.book_title,
        'score' : body.score,
        'content' : body.content,
        'book_image' : body.book_image,
        'season' : body.season
    };
}
export const bookSearchDTO = (data) => {
    return { 
        "title":body.title,                            
	    "book_image":body.book_image,                    
		"author":body.author,                                               
		"publisher":body.publisher,                        
		"pubdate":body.pubdate,
		"avr_score":body.avr_score,
		"eval_num":body.eval_num
    };
}


