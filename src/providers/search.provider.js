// search.provider.js
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getSentimentList } from "../models/search.dao.js";
import { sentimentResponseDTO } from "./../dtos/user.response.dto.js"

import { getUser } from "../models/search.dao.js";

// 검색결과 리스트(센티멘트) 조회
export const readSearchListSentiment = async (searchWord) => {
    const sentimentList = await getSentimentList(searchWord);
    if(!sentimentList)
        return false;
    return sentimentResponseDTO(sentimentList);
}