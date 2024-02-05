// rank.response.dto.js

export const rankDTO = (data) => {
    if (data === null) {
        // data가 null인 경우의 처리
        return { message : "조회된 랭크가 없습니다. "};
      } else {
        return data.map(item => (
            {
                "ranking" : item.ranking, 
                "tier" : item.tier, 
                "nickname" : item.nickname, 
                "status_message" : item.status_message, 
                "sentiment_num" : item.sentimentCount, 
                "like_num" : item.totalLikes
            }
        )) 
        }
};