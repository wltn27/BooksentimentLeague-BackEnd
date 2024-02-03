import { formatDate } from './user.response.dto.js';

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
        "created_at": formatDate(data[0].created_at),
        "updated_at": formatDate(data[0].updated_at)
    };
};


// 댓글 DTO
export const commentDTO = (data) => {
    // 닉네임, 작성(수정)날짜, 내용, 프로필ㄹ사진,
    if (data === null) {
        // data가 null인 경우의 처리
        return { message : "작성된 댓글이 없습니다. "};
      } else {
        // data가 null이 아닌 경우의 처리\
        return data.map(item => (
            {
            "comment_id":  item.comment_id,
            "nickname" : item.nickname,
            "profile_image" : item.profile_image,
            "content": item.content,
            "like" : item.like,
            "parent_id" : item.parent_id,
            "created_at" : formatDate(item.created_at),
            "updated_at" : formatDate(item.updated_at),
            } 
        ));
      }
    
}

export const WriteCommentResponseDTO = (nickname, tier, created_at, profile_image, content, like_num, parent_id, comment_id ) => {
    return {
        "nickname" : nickname,
        "tier" : tier,
        "datetime" : formatDate(created_at),
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
