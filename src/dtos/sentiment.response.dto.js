// sentiment DTO
import { formatDate } from "./../dtos/user.response.dto.js"

export const sentimentResponseDTO = (data) => {
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
        "created_at": formatDate(data[0].created_at)
    };
};


// 댓글 DTO
export const commentResponseDTO = (data) => {
    const commentObject = [];

    for (let i = 0; i < data.length; i++) {
        commentObject.push({
            "comment_id": data[i].comment_id,
            "nickname":  data[i].nickname,
            "parent_id":  data[i].parent_id,
            "created_at":  formatDate(data[i].created_at),
            "content":  data[i].content,
        })
    }
    return {"comment": commentObject};
}

export const WriteCommentResponseDTO = (data) => {
    return {
        "nickname" : data.nickname,
        "tier" : data.tier,
        "datetime" : formatDate(data.created_at),
        "profile_image" : data.profile_image,
        "content" : data.content,
        "like_num" : data.like_num,
        "parent_id" : data.parent_id,
        "comment_id" : data.comment_id
    }
}

// alarm DTO
export const alarmDTO = (data) => {
    return data.map(item => ({
        "title": item.title,
        "content": item.content,
        "read_at": item.read_at,
        "created_at": formatDate(item.created_at),
    }));
};

export const DeleteCommentResponseDTO = () => {
    console.log("DeleteCommentResponseDTO clear");
    return {"message" : "댓글이 삭제되었습니다"};
}

// sentimentListDTO
export const sentimentListDTO = (data) => {
    return data.map(item => ({
        "sentiment_id": item.sentiment_id,
        "book_image": item.book_image,
        "sentiment_title" : item.sentiment_title,
        "book_title" : item.book_title,
        "nickname" : item.author_nickname,
        "tier" : item.tier,
        "score" : item.score,
        "content": item.content,
        "created_at" : formatDate(item.created_at),
        "author" : item.author,
        "publisher" : item.publisher,
        "comment_num" : item.total_comments,
        "like_num" : item.total_likes,
        "scrap_num" : item.total_scraps
    }));
}