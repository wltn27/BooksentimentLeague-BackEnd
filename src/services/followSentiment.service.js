// followSentiment.service.js
import { mapToFollowSentimentDTO } from "../dtos/followSentiment.dto.js";
import { getFollowSentiments } from "../models/followSentiment.dao.js";

export async function getFollowSentimentList(userId) {
    try {
        const [followSentimentData] = await getFollowSentiments(userId);
        const followSentimentList = followSentimentData.map(mapToFollowSentimentDTO);
        return { sentiments: followSentimentList };
    } catch (error) {
        console.error('Error in getFollowSentimentList:', error);
        throw error;
    }
}
