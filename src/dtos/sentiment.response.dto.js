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