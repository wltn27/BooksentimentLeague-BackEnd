// search.provider.js
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import dotenv from 'dotenv';
import fetch from 'node-fetch';

import { getSentimentData, getSentimentList, getNicknameList } from "../models/search.dao.js";
import { searchResponseDTO, sentimentResponseDTO, nicknameResponseDTO } from "./../dtos/search.response.dto.js"

dotenv.config();

// 도서 검색
export const searchForBooks = async (title, display, start_index, userId) => {
    try{
        const apiUrl = "https://openapi.naver.com/v1/search/book?query=" + encodeURIComponent(title) +
                        "&display=" + display + 
                        "&start=" + start_index;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
            },
        })

        if (!response.ok) {
            // API 호출이 실패한 경우
            console.error('API call failed with status:', response.status);
            throw new BaseError(status.FAIL_SEARCH_BOOK, '도서 검색 API 호출 실패');
        }
    
        const data = await response.json();
     
        if(data.items == '')
            return [];

    
        const booksWithSentiments = await Promise.all(data.items.map(async (book) => {
            // 제목, 저자, 출판사를 기반으로 감정 데이터 조회
            const sentimentData = await getSentimentData(book.title.replace(/<[^>]+>/g, ''), book.author, book.publisher);

            let total_score = 0;
            let total_num = 0;
            let user_score = null;

            if(Array.isArray(sentimentData)){
                sentimentData.forEach(function(sentiment) {
                    if(sentiment.user_id == userId) {
                        user_score = sentiment.avr_score;
                    }

                    total_score += sentiment.avr_score;
                    total_num += sentiment.eval_num; 
                });
            }
            
            if(total_score != 0 && total_num != 0){
                total_score /= total_num;
            }
                return {
                    ...book,
                    avr_score: total_score, // 집계된 평균 점수
                    eval_num: total_num, // 집계된 감정 표현 수
                    user_score : user_score
                };
        }));
        
        // DTO를 통해 최종 응답 데이터 형식으로 변환
        return {"list" : searchResponseDTO(booksWithSentiments, start_index), "cursorId" : (parseInt(data.items.length) + parseInt(start_index) -1), "total_page_num" : Math.floor(data.total  / 5) + (data.total  % 5 > 0 ? 1 : 0)};
    }
    catch (err){
        console.error(err);
        throw new BaseError(status.FAIL_SEARCH_BOOK);
    }
}

// 검색결과 리스트(센티멘트) 조회
export const readSearchListSentiment = async (searchWord, limit, cursorId) => {
    let sentimentList = await getSentimentList(searchWord, limit, cursorId);
    
    if(sentimentList.sentimentObject == '') // 아무 검색 결과가 안 뜰 때 빈 배열 반환
        return [];
    
    return {"list" : sentimentResponseDTO(sentimentList.sentimentObject), "cursorId" : (parseInt(sentimentList.sentimentObject.length) + parseInt(cursorId ?? 0)), "total_page_num" : Math.floor(sentimentList.total_num  / 10) + (sentimentList.total_num  % 10 > 0 ? 1 : 0)};
}

// 검색결과 리스트(닉네임) 조회
export const readSearchListNick = async (searchWord, limit, cursorId, userId) => {
    let nicknameList = await getNicknameList(searchWord, limit, cursorId, userId);
 
    if(nicknameList == '') // 아무 검색 결과가 안 뜰 때 빈 배열 반환
        return [];

    return {"list" : nicknameResponseDTO(nicknameList.nicknameObject), "cursorId" : (parseInt(nicknameList.nicknameObject.length) + parseInt(cursorId ?? 0)), "total_page_num" : Math.floor(nicknameList.total_num  / 10) + (nicknameList.total_num  % 10 > 0 ? 1 : 0)};
}