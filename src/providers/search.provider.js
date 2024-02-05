// search.provider.js
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getSentimentList, getSentimentData } from "../models/search.dao.js";
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
  
    // const books = await response.json();
    // return searchResponseDTO(books.items);
    const data = await response.json();
    const booksWithSentiments = await Promise.all(data.items.map(async (book) => {
        // 제목, 저자, 출판사를 기반으로 감정 데이터 조회
        const sentimentData = await getSentimentData(book.title.replace(/<[^>]+>/g, ''), book.author, book.publisher);
        return {
            ...book,
            avr_score: sentimentData.avr_score, // 집계된 평균 점수
            eval_num: sentimentData.eval_num // 집계된 감정 표현 수
        };
    }));
    
    // DTO를 통해 최종 응답 데이터 형식으로 변환
    return searchResponseDTO(booksWithSentiments);
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