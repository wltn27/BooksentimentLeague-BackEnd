import express from 'express';
import bookSearchController from '../controllers/bookSearch.controller';

const bookSearchRouter = express.Router();

bookSearchRouter.get('/bookSearch/book', bookSearchController.searchBooks);

export default router;