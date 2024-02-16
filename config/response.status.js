// response.status.js

import { StatusCodes } from "http-status-codes";

export const status = {
    // success
    SUCCESS: {status: StatusCodes.OK, "isSuccess": true, "code": 200, "message": "success!"}, 

    // error
	  // common err
    INTERNAL_SERVER_ERROR: {status: StatusCodes.INTERNAL_SERVER_ERROR, "isSuccess": false, "code": "COMMON000", "message": "서버 에러, 관리자에게 문의 바랍니다." },
    BAD_REQUEST: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "COMMON001", "message": "잘못된 요청입니다." },
    UNAUTHORIZED: {status: StatusCodes.UNAUTHORIZED, "isSuccess": false, "code": "COMMON002", "message": "권한이 잘못되었습니다." },
    METHOD_NOT_ALLOWED: {status: StatusCodes.METHOD_NOT_ALLOWED, "isSuccess": false, "code": "COMMON003", "message": "지원하지 않는 Http Method 입니다." },
    FORBIDDEN: {status: StatusCodes.FORBIDDEN, "isSuccess": false, "code": "COMMON004", "message": "금지된 요청입니다." },

    // member err
    MEMBER_NOT_FOUND: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4001", "message": "사용자가 없습니다."},
    NICKNAME_NOT_EXIST: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4002", "message": "닉네임은 필수입니다."},
    EMAIL_ALREADY_EXIST: {status: StatusCodes.CONFLICT, "isSuccess": false, "code": "MEMBER4003", "message": "이메일이 이미 등록되어 있습니다."},
    NICKNAME_ALREADY_EXIST: {status: StatusCodes.CONFLICT, "isSuccess": false, "code": "MEMBER4004", "message": "닉네임이 이미 등록되어 있습니다."},
    PARAMETER_IS_WRONG: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4005", "message": "파라미터 값이 잘못되었습니다."},
    EMAIL_NOT_EXIST: {status: StatusCodes.CONFLICT, "isSuccess": false, "code": "MEMBER4006", "message": "이메일이 등록되어 있지 않습니다."},
    AUTH_NOT_EQUAL: {status: StatusCodes.CONFLICT, "isSuccess": false, "code": "MEMBER4007", "message": "인증번호가 같지 않습니다."},
    FOLLOW_ALREADY_EXIST: {status: StatusCodes.CONFLICT, "isSuccess": false, "code": "MEMBER4009", "message": "이미 팔로우 중입니다."},
    ID_ALREADY_EXIST: {status: StatusCodes.CONFLICT, "isSuccess": false, "code": "MEMBER4008", "message": "ID가 이미 등록되어 있습니다."},   
    NOT_CHANGED_STATUS: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4010", "message": "완료로 바뀌지 않았습니다."},
    PASSWORD_NOT_EQUAL: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER40018", "message": "비밀번호가 틀렸습니다."},
    NOT_SAVE_AUTH : {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER40020", "message": "인증번호가 저장되지 않았습니다."},
   
    SENTIMENT_ALREADY_EXIST: { status: StatusCodes.CONFLICT, "isSuccess": false, "code": "MEMBER4011", "message": "작성한 센티멘트가 이미 존재합니다.."}, 
    SENTIMENT_NOT_FOUND: { status: StatusCodes.NOT_FOUND, "isSuccess": false, "code": "MEMBER4012", "message": "센티멘트가 존재하지 않습니다."},
    NOT_EQUAL_USER: {status:StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4013", "message": "현재 사용자와 작성자가 일치하지 않습니다."},
    fail_sentiment_list : {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER40021", "message": "센티멘트 리스트 반환에 실패했습니다."},
    fail_nickname_list : {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER40022", "message": "닉네임 리스트 반환에 실패했습니다."},

    SENTIMENT_NOT_SELF: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4014", "message": "본인 센티멘트는 추천할 수 없습니다."},
    COMMENT_NOT_SELF: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4015", "message": "본인 댓글은 추천할 수 없습니다."},
    SCRAP_NOT_SELF: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4016", "message": "본인 센티멘트는 스크랩할 수 없습니다."},
    COMMENT_NOT_DELETE: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4017", "message": "본인 댓글 외에는 삭제할 수 없습니다."},

    FAIL_USER_FOLLOW: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4018", "message": "팔로우에 실패하였습니다."},
    FAIL_LIKE_SENTIMENT: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4019", "message": "센티멘트 추천에 실패하였습니다."},
    FAIL_LIKE_COMMENT: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4020", "message": "댓글 추천에 실패하였습니다."},
    FAIL_SCRAP_SENTIMENT: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4021", "message": "센티멘트 스크랩에 실패하였습니다."},

    FAIL_GET_ALARM: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4022", "message": "알림 조회에 실패하였습니다."},
    FAIL_UPDATE_ALARM: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4023", "message": "알림 상태 업데이트에 실패하였습니다."},
    FAIL_GET_UNREAD: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4024", "message": "읽지 않은 알림 조회에 실패하였습니다."},

    FAIL_COMMENT_WRITE: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4025", "message": "댓글 작성에 실패하였습니다."},
    FAIL_COMMENT_DELETE: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4026", "message": "댓글 삭제에 실패하였습니다."},

    INVALID_INPUT: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4027", "message": "입력값이 유효하지 않습니다."},
    
    // article err
    ARTICLE_NOT_FOUND: {status: StatusCodes.NOT_FOUND, "isSuccess": false, "code": "ARTICLE4001", "message": "게시글이 없습니다."},
    FAIL_SEARCH_BOOK: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "ARTICLE4002", "message": "도서 검색에 실패했습니다."}
}