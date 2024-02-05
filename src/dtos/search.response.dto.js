import { formatDate } from "./../dtos/user.response.dto.js";

export const sentimentResponseDTO = (data) => {

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
    return {"sentimentObject": sentimentObject, "cursorId": data[data.length-1].sentiment_id};
}

export const searchResponseDTO = (books) => {
    return books.map(book => ({
      title: book.title,
      image: book.image,
      author: book.author,
      publisher: book.publisher,
      pubdate: book.pubdate,
      avr_score: 4.0, // book.avr_score,
      eval_num: 22 // book.eval_num
    }));
  };