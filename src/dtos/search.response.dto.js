export const bookSearchDTO = (data) => {
    const booksArray = [];

    for (let i = 0; i < 3; i++) { 
        const bookObject = { 
            "title": data.title,                            
            "book_image": data.book_image,                    
            "author": data.author,                                               
            "publisher": data.publisher,                        
            "pubdate": data.pubdate,
            "avr_score": data.avr_score,
            "eval_num": data.eval_num
        };

        booksArray.push(bookObject);
    }

    return booksArray;
}
export const sentimentSearchDTO = (data) => {
    const sentimentsArray = [];

    for (let i = 0; i < 3; i++) { 
        const sentimentObject = { 
            'sentiment_id': data.sentiment_id,
            'user_id': data.user_id,
            'book_title': data.book_title,
            'score': data.score,
            'content': data.content,
            'book_image': data.book_image,
            'season': data.season
        };

        sentimentsArray.push(sentimentObject);
    }

    return sentimentsArray;
}
export const userSearchDTO = (data) => {
    const usersArray = [];

    for (let i = 0; i < 3; i++) { 
        const userObject = { 
            "nickname": data.nickname, 
            "created_at": data.created_at,
            "sentiment_title": data.sentiment_title,
            "book_title": data.book_title,
            "score": data.score,
            "content": data.content,
            "image_path": data.image_path,
            "book_image": data.book_image
        };

        usersArray.push(userObject);
    }

    return usersArray;
}

