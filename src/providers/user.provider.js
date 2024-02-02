import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getMyPage, getFollowerList, getFollowingList, getSentimentList, getScrapList, getAlarmDao} from "../models/user.dao.js";
import { followerListDTO, followingListDTO, sentimentResponseDTO, alarmDTO } from "./../dtos/user.response.dto.js";

export const readMyPage = async (user_id) => {
    
    const userData = await getMyPage(user_id);
    console.log(userData);

    return userData;
}

export const readFollowerList = async(user_id) => {
    const followObject = await getFollowerList(user_id);

    return followerListDTO(followObject);
}

export const readFollowingList = async(user_id) => {
    const followObject = await getFollowingList(user_id);

    return followingListDTO(followObject);
}

export const readSentimentList = async(user_id, num) => {
    const sentimentObject = await getSentimentList(user_id, num, cursorId);

    return sentimentResponseDTO(sentimentObject);
}

export const readScrapList = async(user_id) => {
    const scrapObject = await getScrapList(user_id);

    return sentimentResponseDTO(scrapObject);
}

// 알림 조회
export const getAlarmService = async(userId) => {
    const alarmData = await getAlarmDao(userId);
    console.log('alarmDTO: ', alarmDTO(alarmData));
    return alarmDTO(alarmData);
}