// 회원가입 DTO 반환 안 시킴
export const signinResponseDTO = () => {
    return {"message" : "회원 가입에 성공하였습니다."};
}

export const checkEmailResponseDTO = () => {
    return {"message" : "사용 가능한 이메일입니다."};
}

export const checkNickResponseDTO = () => {
    return {"message" : "사용 가능한 닉네임입니다."};
}

export const loginResponseDTO = (user) => {
    return {"email": user[0].email, "nickname": user[0].nickname};
}

export const followResponseDTO = (followStatus) => {
    return { "follow_status": followStatus };
};

export const LikeSentimentResponseDTO = (likeStatus) => {
    return { "like_status": likeStatus };
}

export const LikeCommentResponseDTO = (likeStatus) => {
    return { "like_status": likeStatus };
}

export const ScrapSentimentResponseDTO = (scrapStatus) => {
    return { "scrap_status": scrapStatus };
}

// alarm DTO
export const alarmDTO = (data) => {
    return data.map(item => ({
        "sentiment_id": item.sentiment_id,
        "title": item.title,
        "content": item.content,
        "read_at": item.read_at,
        "created_at":  formatDate(item.created_at),
    }));
};

// 성공 응답 DTO 
export const successResponseDTO = (message, data = {}) => {
    return {
        status: 'success',
        message,
        data,
    };
};
  
export const errorResponseDTO = (message, error = {}) => {
    return {
        status: 'error',
        message,
        error,
    };
}

export const followerListDTO = (followObject) => {
    let i = 0;

    followObject[0][0].forEach((element) => {
        if(followObject[1][0].length > 1) {         // 맞팔한 경우가 2개 이상일 때
            for(i; i < followObject[0][0].length;){
                if(element.user_id == followObject[1][0][i].following_id){
                    Object.assign(followObject[0][0][i], { follow_status: 1 });
                }
                else {
                    Object.assign(followObject[0][0][i], { follow_status: 0 });
                }
                i++;
                break;
            }
        } else if (followObject[1][0].length == 1) {        // 맞팔한 경우가 1개 일 때
            if(element.user_id == followObject[1][0][0].following_id){
                Object.assign(followObject[0][0][i], { follow_status: 1 });
            }
            else {
                Object.assign(followObject[0][0][i], { follow_status: 0 }); 
            }
            i++;
        }
        else {                                            // 맞팔 한 경우가 없을 때
            Object.assign(followObject[0][0][i], { follow_status: 0 }); 
            i++;
        }
    })
    return followObject[0][0];
}

export const followingListDTO = (followObject) => {
    let i = 0;

    followObject[0][0].forEach((element) => {
        if(followObject[1][0].length > 1) {         // 맞팔한 경우가 2개 이상일 때
            for(i; i < followObject[0][0].length;){
                if(element.user_id == followObject[1][0][i].follower_id){
                    Object.assign(followObject[0][0][i], { follow_status: 1 });
                }
                else {
                    Object.assign(followObject[0][0][i], { follow_status: 0 });
                }
                i++;
                break;
            }
        } else if (followObject[1][0].length == 1) {        // 맞팔한 경우가 1개 일 때
            if(element.user_id == followObject[1][0][0].follower_id){
                Object.assign(followObject[0][0][i], { follow_status: 1 });
            }
            else {
                Object.assign(followObject[0][0][i], { follow_status: 0 }); 
            }
            i++;
        }
        else {                                            // 맞팔 한 경우가 없을 때
            Object.assign(followObject[0][0][i], { follow_status: 0 }); 
            i++;
        }
    })

    return followObject[0][0];
}
 
export const sentimentResponseDTO = (data) => {

    const sentimentObject = [];

    for (let i = 0; i < data.length; i++) {
        sentimentObject.push({
            "sentiment_id": data[i].sentiment_id,
            "book_image": data[i].book_image,
            "sentiment_title":  data[i].sentiment_title,
            "book_title":  data[i].book_title,
            "score":  data[i].score,
            "created_at":  formatDate(data[i].created_at),
            "comment_num":  data[i].comment_num,
            "like_num":  data[i].like_num,
            "scrap_num":  data[i].scrap_num,
            "author": data[i].author,
            "publisher": data[i].publisher,
            "nickname": data[i].nickname,
            "tier": data[i].tier
        })
    }
    return {"sentimentObject": sentimentObject, "cursorId": data.length};
}

export const UnreadNotificationResponseDTO = (unreadCount) => {
    return { "unreadCount": unreadCount};
};

export const formatDate = (date) => {

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 24시간 형식으로 표시
    };

    return new Intl.DateTimeFormat('kr', options).format(new Date(date));
};
