// alarm.dao.js

import { totalSentiment, totalRecommend } from "./alarm.sql.js";
import { makeTier, updateTier } from "./alarm.sql.js";
import { tierAlarm } from "./alarm.sql.js";


// 티어 체크 
export const checkTier = async (userId) => {
    try {
        const conn = await pool.getConnection();
        const [sentimentResult] = await pool.query(totalSentiment, userId);
        const sentimentCount = sentimentResult.length;

        const [recommendResult] = await pool.query(totalRecommend, [userId]);
        const recommendCount = recommendResult[0].totalLikes;

        conn.release();

        if (sentimentCount === 0 ) { // 0일 경우
            // 사용자-티어 테이블 데이터 삽입
            const [tierResult] = await pool.query(makeTier, [userId, 1]);
            return tierResult[0].inserId;
        } else if (sentimentCount === 1) {// 1일 경우
            // 사용자-티어 테이블 데이터 업데이트
            const [tierResult] = await pool.query(updateTier, [2, userId]);
            return tierResult[0].inserId;
        } else if (sentimentCount === 5 && recommendCount >= 30 ) {// 5일 경우
            // 사용자-티어 테이블 데이터 업데이트
            const [tierResult] = await pool.query(updateTier, [3, userId]);
            return tierResult[0].inserId;
        } else if (sentimentCount === 10 && recommendCount >= 100 ) {// 10일 경우
            // 사용자-티어 테이블 데이터 업데이트
            const [tierResult] = await pool.query(updateTier, [4, userId]);
            return tierResult[0].inserId;
        } else if (sentimentCount === 30 && recommendCount >= 300 ) {// 30일 경우
            // 사용자-티어 테이블 데이터 업데이트
            const [tierResult] = await pool.query(updateTier, [5, userId]);
            return tierResult[0].inserId;
        } else if (sentimentCount === 50 && recommendCount >= 500 ) {// 50일 경우
            // 사용자-티어 테이블 데이터 업데이트
            const [tierResult] = await pool.query(updateTier, [6, userId]);
            return tierResult[0].inserId;
        } 
    } catch (err) {
        console.log(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

// 티어 알람 생성
export const makeTierAlarm = async (userId) => {
    const [tierResult] = await pool.query(getTier, [userId]); // 티어 정보 가져오기
    const tier = tierResult[0].tier; // 티어 데이터
    const createdAt = new Date(); // 생성날짜

    // DB에 알람 데이터 삽입
    const [alarmResult] = await pool.query(tierAlarm, [userId, '제목', '내용', createdAt]);
}