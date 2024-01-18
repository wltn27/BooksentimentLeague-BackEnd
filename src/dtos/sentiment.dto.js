// sentiment.dto.js


// 센티멘트 작성 DTO
export const wrSentimentDTO = (data) => {
    return { 
        "nickname" : data.nickname, // data에 닉네임, 생성시간이 없음.. -> 쿼리로 끌어와야하나?
        "created_at" : data.created_at,
        "sentiment_title" : data.sentiment_title,
        "book_title" : data.book_image,
        "score" : data.score,
        "content" : data.content,
        "image_path": data.image_path,
        "book_image": data.book_image
    };
}


// 센티멘트 수정 DTO
export const rewrSentimentDTO = (data) => {
    return {
        "nickname" : data.nickname,
        "updated_at" : data.updated_at,
        "sentiment_title" : data.sentiment_title,
        "book_title" : data.book_image,
        "score" : data.score,
        "content" : data.content,
        "image_path": data.image_path,
        "comments" : [
                        { comment_id : 1, nick : "str", content : "댓글 내용", parent_id : NULL },
                        { comment_id : 2, nick : "str", content : "댓글 내용", parent_id : 1 } // 위 댓글의 대댓글
                    ]
    }
}


/* 센티멘트 삭제 DTO -> 딱히 필요없어 보임
export const delSentimentDTO = (data) => {

}
*/
// 센티멘트 작성 
/* 
request
{
    "sentiment_title" : "string",
    "book_title" : "string",
    "score" : "float",
    "content" : "text",
    "image" : ["이미지 경로1", "이미지 경로2"],
    "book_image" : "image_path" // 책 검색할 때 있는 이미지 경로 다시 반환해주세요 
}

response
{
	"nickname" : "string",
	"created_at" : "2023-12-18 12:34",
	"sentiment_title" : "플러터 프로그래밍 책 후기",
	"book_title" : "Must Have 코드팩토리의 플러터 프로그래밍",
	"score" : 5,
	"content" : "본문 내용",
	"image_path": "url~~",
	"book_image": "image_path"
}
*/

// 센티멘트 수정
/*
Request
"sentiment_title" : "string",
"book_title" : "string",
"score" : "float",
"content" : "text",
"image" : ["이미지 경로1", "이미지 경로2"]

Response
{
	"nickname" : "string",
	"created_at" : "2023-12-18 12:34",
	"sentiment_title" : "플러터 프로그래밍 책 후기",
	"book_title" : "Must Have 코드팩토리의 플러터 프로그래밍",
	"score" : 5,
	"content" : "본문 내용",
	"image_path": "url~~",
	"comments" : [
					{ comment_id : 1, nick : "str", content : "댓글 내용", parent_id : NULL },
					{ comment_id : 2, nick : "str", content : "댓글 내용", parent_id : 1 } // 위 댓글의 대댓글
				]
}
*/

// 센티멘트 삭제
/* 
Request 
파라미터 : sentiment-id

Response : X
*/