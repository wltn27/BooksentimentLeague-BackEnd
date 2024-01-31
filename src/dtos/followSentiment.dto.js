// followSentiment.dto.js

export const mapToFollowSentimentDTO = data => ({
    sentimentTitle: data.sentiment_title,
    bookTitle: data.book_title,
    nickname: data.nickname,
    tier: data.tier,
    likeNum: data.like_num,
    commentNum: data.comment_num,
    scrapNum: data.scrap_num,
    createdAt: data.created_at,
    score: data.score
});

