import bookSearchService from './bookSearch.service.js';

export const bookSearchController = async(req, res) => {
  try {
    res.status(200).json(await bookSearchService.searchBooks(req.query.query));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}