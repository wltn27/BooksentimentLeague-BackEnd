// response.status.js

import { StatusCodes } from "http-status-codes";

export const status = {
    // success
    SUCCESS: {status: StatusCodes.OK, "isSuccess": true, "code": 2000, "message": "success!"}, 

    // error


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
   
    SENTIMENT_ALREADY_EXIST: { status: StatusCodes.CONFLICT, "isSuccess": false, "code": "MEMBER4011", "message": "작성한 센티멘트가 이미 존재합니다.."}, 
    SENTIMENT_NOT_FOUND: { status: StatusCodes.NOT_FOUND, "isSuccess": false, "code": "MEMBER4012", "message": "센티멘트가 존재하지 않습니다."},
    NOT_EQUAL_USER: {status:StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4013", "message": "현재 사용자와 작성자가 일치하지 않습니다."},
    
    // article err
    ARTICLE_NOT_FOUND: {status: StatusCodes.NOT_FOUND, "isSuccess": false, "code": "ARTICLE4001", "message": "게시글이 없습니다."}

}