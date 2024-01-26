import bookSearchDao from '../dtos/bookSearch.dao';
import bookSearchDto from '../models/bookSearch.dto';

import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";


export const bookSearchService = async (query) => {
  try {
    const apiResponse = await bookSearchDao.searchBooks(query);
    const bookDto = mapToBookDto(apiResponse);
    return bookDto;
  } catch (error) {
    throw new BaseError(status.BAD_REQUEST);
  }
};

function mapToBookDto(apiResponse) {
  const { title, image, author, publisher, pubdate, avr_score, eval_num } = apiResponse;
  return new bookSearchDto(title, image, author, publisher, pubdate, avr_score, eval_num);
}
