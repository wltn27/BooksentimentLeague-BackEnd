// bookSearch.service.js
import { searchBooks } from '../models/bookSearch.dao.js';
import { mapToBookDto } from '../dtos/bookSearch.dto.js';

import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const bookSearchService = async (query) => {
  try {
    const apiResponse = await searchBooks(query);
    const bookDto = mapToBookDto(apiResponse);
    return bookDto;
  } catch (error) {
    console.error('Error in bookSearchService:', error);
    throw new BaseError(status.BAD_REQUEST);
  }
};
