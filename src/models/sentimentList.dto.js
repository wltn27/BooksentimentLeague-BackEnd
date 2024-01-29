export const mapToSentimentDto = (data) => {
    const sentimentsArray = [];

    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            const sentimentObject = {
                "book_image" :data[i].book_image,
                "sentiment_title" : data[i].sentiment_title,
                "book_title" : data[i].book_title,
                "nickname" : data[i].nickname,
                "tier" : data[i].tier,
                "like_num" : data[i].like_num,
                "comment_num" : data[i].comment_num,
                "scrap_num" : data[i].scrap_num,
                "created_at" : data[i].created_at,
                "score" : data[i].score
            };

            sentimentsArray.push(sentimentObject);
        }
    } else {
        const sentimentObject = {
            "book_image" :data.book_image,
            "sentiment_title" : data.sentiment_title,
            "book_title" : data.book_title,
            "nickname" : data.nickname,
            "tier" : data.tier,
            "like_num" : data.like_num,
            "comment_num" : data.comment_num,
            "scrap_num" : data.scrap_num,
            "created_at" : data.created_at,
            "score" : data.score
        };

        sentimentsArray.push(sentimentObject);
    }

    return sentimentsArray;
};
