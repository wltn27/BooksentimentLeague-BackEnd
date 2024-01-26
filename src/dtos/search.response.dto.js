export const bookSearchDTO = (data) => {
    const booksArray = [];

    // data가 배열인 경우
    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            const bookObject = {
                "title": data[i].title,
                "book_image": data[i].book_image,
                "author": data[i].author,
                "publisher": data[i].publisher,
                "pubdate": data[i].pubdate,
                "avr_score": data[i].avr_score,
                "eval_num": data[i].eval_num
            };

            booksArray.push(bookObject);
        }
    } else {
        // data가 개별 도서인 경우
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
};




// sentimentSearchDTO
export const sentimentSearchDTO = (data) => {
    const sentimentsArray = [];

    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            const sentimentObject = {
                'sentiment_id': data[i].sentiment_id,
                'user_id': data[i].user_id,
                'book_title': data[i].book_title,
                'score': data[i].score,
                'content': data[i].content,
                'book_image': data[i].book_image,
                'season': data[i].season
            };

            sentimentsArray.push(sentimentObject);
        }
    } else {
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
};

// userSearchDTO
export const userSearchDTO = (data) => {
    const usersArray = [];

    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            const userObject = {
                "nickname": data[i].nickname,
                "created_at": data[i].created_at,
                "sentiment_title": data[i].sentiment_title,
                "book_title": data[i].book_title,
                "score": data[i].score,
                "content": data[i].content,
                "image_path": data[i].image_path,
                "book_image": data[i].book_image
            };

            usersArray.push(userObject);
        }
    } else {
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
};







