// search.provider.js
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getSentimentList } from "../models/search.dao.js";
import { searchResponseDTO, sentimentResponseDTO } from "./../dtos/search.response.dto.js"
import fetch from 'node-fetch';

const client_id = '08wUPZpFq3R7AYC_59Sn';
const client_secret = 'gqqYPKg0i5';

// 도서 검색
export const searchForBooks = async (title) => {
    const apiUrl = `https://openapi.naver.com/v1/search/book?query=${encodeURIComponent(title)}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
  
    const books = await response.json();
    return searchResponseDTO(books.items);
  };

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