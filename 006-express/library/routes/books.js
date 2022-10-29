const express = require('express');
const router = express.Router();
const { Book } = require('../models/Book');
const accepts = require('accepts');

const fileMiddleware = require('../middleware/fileBook');

const library = {
  books: [],
};

[1, 2, 3].map((el) => {
  const newBook = new Book(
    `book ${el}`,
    `desc book ${el}`,
    `author book ${el}`
  );
  library.books.push(newBook);
});

router.get('/', (req, res) => {
  const { books } = library;
  res.render('book/index', {
    title: 'Books',
    books: books,
  });
});

router.get('/create', (req, res) => {
  res.render('book/create', {
    title: 'Books | create',
    books: {},
  });
});

router.get('/:id', (req, res) => {
  const { books } = library;
  const { id } = req.params;
  const i = books.findIndex((book) => book.id === id);

  if (i === -1) {
    res.redirect('/404');
  }

  res.render('book/view', {
    title: 'Books | view',
    books: books[i],
  });
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

router.get('/update/:id', (req, res) => {
  const { books } = library;
  const { id } = req.params;
  const i = books.findIndex((book) => book.id === id);

  if (i === -1) {
    res.redirect('/404');
  }

  res.render('book/update', {
    title: 'Books | view',
    books: books[i],
  });
});

router.post('/create', fileMiddleware.single('fileBook'), (req, res) => {
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

  res.redirect('/books');
});

router.post('/update/:id', fileMiddleware.single('fileBook'), (req, res) => {
  const { books } = library;
  const { id } = req.params;
  const { title, description, authors, fileName, fileBook } = req.body;
  const i = books.findIndex((book) => book.id === id);

  if (i === -1) {
    res.redirect('/404');
  }

  books[i] = {
    ...books[i],
    title,
    description,
    authors,
    fileName,
    fileBook,
  };

  res.redirect(`/books/${id}`);
});

router.post('/delete/:id', (req, res) => {
  const { books } = library;
  const { id } = req.params;
  const i = books.findIndex((book) => book.id === id);

  if (i === -1) {
    res.redirect('/404');
  }

  books.splice(i, 1);
  res.redirect('/books');
});

module.exports = router;
