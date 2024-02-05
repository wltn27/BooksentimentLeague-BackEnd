// search.provider.js
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getSentimentList } from "../models/search.dao.js";
import { sentimentResponseDTO } from "./../dtos/search.response.dto.js"

// 검색결과 리스트(센티멘트) 조회
export const readSearchListSentiment = async (searchWord, cursorId) => {
    let sentimentList;
    if(cursorId == undefined){
        sentimentList = await getSentimentList(searchWord, 0);
    } else {
        sentimentList = await getSentimentList(searchWord, cursorId);
    }

    if(sentimentList == '') // 아무 검색 결과가 안 뜰 때 빈 배열 반환
        return [];
    
    return sentimentResponseDTO(sentimentList);
}

// 검색결과 리스트(닉네임) 조회
export const readSearchListNick = async (searchWord, cursorId) => {
    let sentimentList;
    if(cursorId == undefined){
        nicknameList = await getNicknameList(searchWord, 0);
    } else {
        nicknameList = await getNicknameList(searchWord, cursorId);
    }

    if(sentimentList == '') // 아무 검색 결과가 안 뜰 때 빈 배열 반환
        return [];
    
    return sentimentResponseDTO(sentimentList);
}