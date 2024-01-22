// response.status.js

import { StatusCodes } from "http-status-codes";

export const status = {
    // success
    SUCCESS: {status: StatusCodes.OK, "isSuccess": true, "code": 2000, "message": "success!"}, 

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
    AUTH_NOT_EQUAL: {status: StatusCodes.CONFLICT, "isSuccess": false, "code": "MEMBER4007", "message": "인증번호가 올바르지 않습니다."},
    EMAIL_NOT_VAILD: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4008", "message": "형식에 맞지 않는 이메일입니다."},

    
    // article err
    ARTICLE_NOT_FOUND: {status: StatusCodes.NOT_FOUND, "isSuccess": false, "code": "ARTICLE4001", "message": "게시글이 없습니다."}
}