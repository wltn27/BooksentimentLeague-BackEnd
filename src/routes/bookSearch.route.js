import express from 'express';
import bookSearchController from './bookSearch.controller';

const router = express.Router();

router.get('/search/book', bookSearchController.searchBooks);

export default router;