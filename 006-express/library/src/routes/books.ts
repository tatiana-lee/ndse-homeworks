import express from 'express';
import http from 'http';
import { container } from '../container/container';
import { fileMiddleware } from '../middleware/fileBook';
import { BooksRepository } from '../models/BooksRepository';

const router = express.Router();
const COUNTER_URL = process.env.COUNTER_URL;

router.get('/', async (req: any, res: any) => {
  try {
    const repo = container.get(BooksRepository);
    const books = await repo.getBooks();
    res.render('book/index', {
      title: 'Books',
      books: books,
    });
  } catch (error) {
    console.log(error)
    res.redirect('/404');
  }
});

router.get('/create', (req: any, res: any) => {
  res.render('book/create', {
    title: 'Books | create',
    books: {},
  });
});

router.get('/:id', async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const repo = container.get(BooksRepository);
    const books = await repo.getBook(id);

    const cnt = http.request(
      `${COUNTER_URL}/counter/${id}/incr`,
      { method: 'POST' },
      (cb) => {
        cb.setEncoding('utf-8');
        let rawData = '';
        cb.on('data', (chunk) => (rawData += chunk));
        cb.on('end', () => {
          const counter = JSON.parse(rawData).views;
          try {
            res.render('book/view', {
              title: 'Books | view',
              books: books,
              cntr: counter,
            });
          } catch (error) {
            console.log(error);
          }
        });
      }
    );
    cnt.end();
  } catch (error) {
    res.redirect('/404');
  }
});

router.get('/:id/download', async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const repo = container.get(BooksRepository);
    const book = await repo.getBook(id);
    res.download(
      __dirname + '/../public/books/' + book?.fileBook,
      book?.fileName
    );
  } catch (error) {
    res.redirect('/404');
  }
});

router.get('/update/:id', async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const repo = container.get(BooksRepository);
    const book = await repo.getBook(id);
    res.render('book/update', {
      title: 'Books | view',
      books: book,
    });
  } catch (error) {
    res.redirect('/404');
  }
});

router.post('/create', fileMiddleware.single('fileBook'), async (req: any, res: any) => {
  const { title, description, authors, favorite, fileCover, fileName, fileBook } =
    req.body;

  const newBook = {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  };

  try {
    const repo = container.get(BooksRepository);
    await repo.createBook(newBook);
    res.redirect('/books');
  } catch (error) {
    res.redirect('/404');
  }
});

router.post('/update/:id', fileMiddleware.single('fileBook'), async (req: any, res: any) => {
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName, fileBook } =
    req.body;

  try {
    const data =  {
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      fileBook,
    };
    const repo = container.get(BooksRepository);
    repo.updateBook(id, data);
    res.redirect(`/books/${id}`);
  } catch (error) {
    res.redirect('/404');
  }
});

router.post('/delete/:id', async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const repo = container.get(BooksRepository);
    await repo.deleteBook(id);
    res.redirect('/books');
  } catch (error) {
    res.status(500).json(error);
    res.redirect('/404');
  }
});

export default router;
