# BooksentimentLeague-BackEnd
BooksentimentLeague-BackEnd

1. 댓글 작성 API
: /sentiments/{sentiment-id}/comments/{user-id}/write
- 대댓글일 경우 Request Body에 parent_id 포함

2. 댓글 삭제 API
: /sentiments/{sentiment-id}/comments/{comment-id}/delete
- 삭제하려는 댓글이 존재하는지 확인
- 삭제하려는 댓글 작성자와 현재 사용자가 같은지 확인