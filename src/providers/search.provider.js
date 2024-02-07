// search.provider.js
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import dotenv from 'dotenv';
import fetch from 'node-fetch';

import { getSentimentData, getSentimentList, getNicknameList } from "../models/search.dao.js";
import { searchResponseDTO, sentimentResponseDTO, nicknameResponseDTO } from "./../dtos/search.response.dto.js"

dotenv.config();

// 도서 검색
export const searchForBooks = async (title, display, start_index) => {
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
    
        const data = await response.json();
        console.log(data.items == '');
        if(data.items == '')
            return [];

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
        return searchResponseDTO(booksWithSentiments, start_index);
    }
    catch (err){
        console.error(err);
        throw new Error('Failed to fetch books');
    }
}

// 검색결과 리스트(센티멘트) 조회
export const readSearchListSentiment = async (searchWord, limit, cursorId) => {
    let sentimentList;
    if(cursorId == undefined){
        sentimentList = await getSentimentList(searchWord, limit, 0);
    } else {
        sentimentList = await getSentimentList(searchWord, limit, cursorId);
    }

    if(sentimentList == '') // 아무 검색 결과가 안 뜰 때 빈 배열 반환
        return [];
    
    return sentimentResponseDTO(sentimentList, cursorId);
}

// 검색결과 리스트(닉네임) 조회
export const readSearchListNick = async (searchWord, limit, cursorId, userId) => {
    let nicknameList;
    if(cursorId == undefined){
        nicknameList = await getNicknameList(searchWord, limit, 0, userId);
    } else {
        nicknameList = await getNicknameList(searchWord, limit, cursorId, userId);
    }

    if(nicknameList == '') // 아무 검색 결과가 안 뜰 때 빈 배열 반환
        return [];
    
    return nicknameResponseDTO(nicknameList, cursorId);
}