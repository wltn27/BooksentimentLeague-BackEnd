import { formatDate } from "./../dtos/user.response.dto.js";

export const sentimentResponseDTO = (data, cursorId) => {
    if(cursorId == undefined)
        cursorId = 0;
    const sentimentObject = [];
    for (let i = 0; i < data.length; i++) {
        sentimentObject.push({
            "sentiment_id" : data[i].sentiment_id,
            "book_image": data[i].book_image,
            "sentiment_title":  data[i].sentiment_title,
            "book_title":  data[i].book_title,
            "nickname": data[i].nickname,
            "tier": data[i].tier,
            "score":  data[i].score,
            "content": data[i].content,
            "created_at":  formatDate(data[i].created_at),
            "author": data[i].author,
            "publisher": data[i].publisher,
            "comment_num":  data[i].comment_num,
            "like_num":  data[i].like_num,
            "scrap_num":  data[i].scrap_num
        })
    }
    return {"sentimentObject": sentimentObject, "cursorId": parseInt(data.length) +  parseInt(cursorId)};
}

export const nicknameResponseDTO = (data, cursorId) => {
    if(cursorId == undefined)
        cursorId = 0;

    const nicknameObject = [];

    for (let i = 0; i < data.length; i++) {
        nicknameObject.push({
            "user_id" : data[i].user_id,
            "profile_image": data[i].profile_image,
            "nickname": data[i].nickname,
            "status_message" : data[i].status_message,
            "follow_status" : data[i].follow_status
        })
    }
    return {"nicknameObject": nicknameObject, "cursorId": parseInt(data.length) + parseInt(cursorId)};
}

export const searchResponseDTO = (books, start_index) => {
    const bookObject =  books.map(book => ({
      title: book.title,
      image: book.image,
      author: book.author,
      publisher: book.publisher,
      pubdate: book.pubdate,
      description: book.description,
      avr_score: book.avr_score ? book.avr_score.toFixed(2) : 0,
      eval_num: book.eval_num || 0,
      user_score: book.user_score
    }));

    return {bookObject, cursorId : parseInt(bookObject.length) + parseInt(start_index) -1};
  };
