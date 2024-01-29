import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { followerListDTO, followingListDTO, sentimentResponseDTO } from "./../dtos/user.response.dto.js"
import { getMyPage, getFollowerList, getFollowingList, getSentimentList, getScrapList} from "../models/user.dao.js";

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

export const readSentimentList = async(user_id) => {
    const sentimentObject = await getSentimentList(user_id);

    return sentimentResponseDTO(sentimentObject);
}

export const readScrapList = async(user_id) => {
    const scrapObject = await getScrapList(user_id);

    return sentimentResponseDTO(scrapObject);
}