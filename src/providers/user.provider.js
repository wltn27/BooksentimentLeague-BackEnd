import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
// import { followerListDTO, followingListDTO, sentimentResponseDTO } from "./../dtos/user.response.dto.js"
// import { getMyPage, getFollowerList, getFollowingList, getSentimentList, getScrapList } from "../models/user.dao.js";

import { alarmDTO } from "../dtos/user.response.dto.js";
import { getAlarmDao } from "../models/user.dao.js";

// 알림 조회
export const getAlarmService = async(userId) => {
    const alarmData = await getAlarmDao(userId);
    console.log('alarmDTO: ', alarmDTO(alarmData));
    return alarmDTO(alarmData);
}