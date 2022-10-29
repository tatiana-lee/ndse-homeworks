const express = require('express');
const router = express.Router();
const { Book } = require('../models/Book');

const fileMiddleware = require('../middleware/fileBook');

const library = {
  books: [],
};

router.get('/', (req, res) => {
  const { books } = library;
  res.json(books);
});

router.get('/:id', (req, res) => {
  const { books } = library;
  const { id } = req.params;
  const i = books.findIndex((book) => book.id === id);

  if (i !== -1) {
    res.json(books[i]);
  } else {
    res.status(404);
    res.json({ errcode: 404, errmsg: 'Not found' });
  }
});

router.get('/:id/download', (req, res) => {
  const { books } = library;
  const { id } = req.params;
  const i = books.findIndex((book) => book.id === id);

  if (i !== -1) {
    res.download(
      __dirname + '/../public/books/' + books[i].fileBook,
      books[i].fileName
    );
  } else {
    res.status(404);
    res.json({ errcode: 404, errmsg: 'Not found' });
  }
});

router.post('/', fileMiddleware.single('fileBook'), (req, res) => {
  const { books } = library;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  } = req.body;

  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    req.file.originalname || fileName,
    req.file.filename || fileBook
  );
  books.push(newBook);

  res.status(201);
  res.json(newBook);
});

router.put('/:id', fileMiddleware.single('fileBook'), (req, res) => {
  const { books } = library;
  const { id } = req.params;
  const i = books.findIndex((book) => book.id === id);

  const fileName = req.file.originalname;
  const fileBook = req.file.filename;

  if (i !== -1) {
    const updatedBook = {
      ...books[i],
      ...req.body,
      fileName,
      fileBook,
    };
    books[i] = updatedBook;
    res.json(books[i]);
  } else {
    res.status(404);
    res.json('Code: 404 | Not found');
  }
});

router.delete('/:id', (req, res) => {
  const { books } = library;
  const { id } = req.params;
  const i = books.findIndex((book) => book.id === id);

  if (i !== -1) {
    books.splice(i, 1);
    res.json('OK');
  } else {
    res.status(404);
    res.json({ errcode: 404, errmsg: 'Not found' });
  }
});

router.post('../user/login', (req, res) => {
  const user = { id: 1, mail: 'test@mail.ru' };
  res.status(201);
  res.json(user);
});

module.exports = router;
