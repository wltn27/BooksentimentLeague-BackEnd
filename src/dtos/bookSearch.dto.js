// bookSearch.dto.js
class BookSearchDTO {
  constructor(title, image, author, publisher, pubdate, avr_score, eval_num) {
    this.title = title;
    this.image = image;
    this.author = author;
    this.publisher = publisher;
    this.pubdate = pubdate;
    this.avr_score = avr_score;
    this.eval_num = eval_num;
  }
}

function mapToBookDto(apiResponse) {
  const { title, image, author, publisher, pubdate, avr_score, eval_num } = apiResponse;
  return new BookSearchDTO(title, image, author, publisher, pubdate, avr_score, eval_num);
}

export { BookSearchDTO, mapToBookDto };
