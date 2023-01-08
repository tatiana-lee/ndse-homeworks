import express from 'express';
import { container } from '../../container/container';
import { fileMiddleware } from '../../middleware/fileBook';
import { BooksRepository } from '../../models/BooksRepository';

const router = express.Router();

router.get('/', async (req: any, res: any) => {
  try {
    const repo = container.get(BooksRepository);
    const books = await repo.getBooks();
    res.json(books);
  } catch (error) {
    res.status(404).json({ msg: error });
  }
});

router.get('/:id', async (req: any, res: any) => {
  const { id } = req.params;
  const repo = container.get(BooksRepository);

  try {
    const books = await repo.getBook(id);
    res.json(books);
  } catch (error) {
    res.status(404).json({ msg: error });
  }
});

router.post('/', fileMiddleware.single('fileBook'), async (req: any, res: any) => {
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;

  const newBook = {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  };

  try {
    const repo = container.get(BooksRepository);
    const book = await repo.createBook(newBook);
    res.json(book);
  } catch (error) {
    res.status(404).json({ msg: error });
  }
});

router.put('/:id', fileMiddleware.single('fileBook'), async (req: any, res: any) => {
  const { id } = req.params;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  } = req.body;
   const data = {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  }
  try {
    const repo = container.get(BooksRepository);
    repo.updateBook(id, data);
    res.redirect(`/books/${id}`);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

router.delete('/:id', async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const repo = container.get(BooksRepository);
    repo.deleteBook(id);
    res.json('ok');
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

export default router;
