// sentiment.dto.js


// 센티멘트 작성 DTO
/* export const wrSentimentDTO = (data) => {
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
*/

// sentiment DTO
export const sentimentDTO = (data) => {
    return {
        "nickname": data.nickname,
        "sentiment_title": data.sentiment.sentiment_title,
        "book_title": data.sentiment.book_title,
        "score": data.sentiment.score,
        "content": data.sentiment.content,
        "image_path": data.sentiment.image_path,
        "book_image": data.sentiment.book_image,
        "created_at": data.sentiment.created_at,
        "updated_at": data.sentiment.updated_at
    };
};


// 댓글 DTO
export const commentDTO = (data) => {
    return {
        "comments" : [
            { comment_id : 1, nick : "str", content : "댓글 내용", parent_id : NULL },
            { comment_id : 2, nick : "str", content : "댓글 내용", parent_id : 1 } // 위 댓글의 대댓글
        ]
    }
}