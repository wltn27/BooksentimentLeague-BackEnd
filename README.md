# BooksentimentLeague-BackEnd
BooksentimentLeague-BackEnd

1. 팔로우하기 API
: /users/{user-id}/follow
- 팔로우되지 않은 상태라면 -> "팔로우" 수행 -> follow_status : "follow" 반환
- 이미 팔로우 된 상태라면 -> "언팔로우" 수행 -> follow_status : "following" 반환

2. 추천하기(센티멘트) API
: /users/{user-id}/like/sentiment/{sentiment-id}
- 본인 센티멘트는 추천할 수 없도록 함
- 이미 추천된 센티멘트는 like 값을 0으로 업데이트

3. 추천하기(댓글) API
: /users/{user-id}/like/comment/{comment-id}
- 본인 댓글은 추천할 수 없도록 함
- 이미 추천된 댓글은 like 값을 0으로 업데이트

4. 스크랩하기 API
: /users/{user-id}/scrap/{sentiment-id}
- 본인 센티멘트는 추천할 수 없도록 함
- 이미 스크랩한 센티멘트는 scrap 값을 0으로 업데이트
