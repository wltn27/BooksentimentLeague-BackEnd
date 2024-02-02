// sentiment DTO
export const sentimentDTO = (data) => {
    return {
        "nickname": data[0].nickname,
        "sentiment_title": data[0].sentiment_title,
        "book_title": data[0].book_title,
        "score": data[0].score,
        "content": data[0].content,
        "image_path": data[0].image_path,
        "book_image": data[0].book_image,
        "author" : data[0].author,
        "publisher" : data[0].publisher,
        "created_at": data[0].created_at,
        "updated_at": data[0].updated_at
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

export const WriteCommentResponseDTO = (nickname, tier, created_at, profile_image, content, like_num, parent_id, comment_id ) => {
    return {
        "nickname" : nickname,
        "tier" : tier,
        "datetime" : created_at,
        "profile_image" : profile_image,
        "content" : content,
        "like_num" : like_num,
        "parent_id" : parent_id,
        "comment_id" : comment_id
    }
}

export const DeleteCommentResponseDTO = () => {
    console.log("DeleteCommentResponseDTO clear");
    return {"message" : "댓글이 삭제되었습니다"};
}