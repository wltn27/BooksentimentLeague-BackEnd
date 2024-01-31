// dto.js

export const mapToUserRankingDTO = data => ({
    ranking: data.ranking,
    season: data.season,
    user_id: data.user_id,
    nickname: data.nickname,
    tier: data.tier,
    sentiment_count: data.sentiment_count,
    total_likes: data.total_likes,
});