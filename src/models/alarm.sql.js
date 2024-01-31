//alarm.sql.js

// 티어 상승 조건 조회
export const totalSentiment = "SELECT * FROM sentiment WHERE user_id = ?;";
export const totalRecommend = "SELECT SUM(`like`) as totalLikes FROM user_sentiment WHERE user_id = ?;";

// 티어 생성 및 업데이트
export const makeTier = "INSERT INTO user_tier (user_id, tier_id, season) VALUES (?, ?, 1);";
export const updateTier = "UPDATE user_tier SET tier_id = ? WHERE user_id = ?";

// 티어 상승 알람 생성
export const tierAlarm = "INSERT INTO alarm (user_id, title, content, read_at, created_at) VALUES (?, ?, ?, 0, ?);";