const express = require('express');
const http = require('http');
const router = express.Router();
const Book = require('../models/Book');
const { v4: uuid } = require('uuid');

const COUNTER_URL = process.env.COUNTER_URL;

const fileMiddleware = require('../middleware/fileBook');

router.get('/', async (req, res) => {
  try {
    const books = await Book.find().select('-__v');
    res.render('book/index', {
      title: 'Books',
      books: books,
    });
  } catch (error) {
    res.redirect('/404');
  }
});

router.get('/create', (req, res) => {
  res.render('book/create', {
    title: 'Books | create',
    books: {},
  });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const books = await Book.findById(id).select('-__v');
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
            console.log(error.message);
          }
        });
      }
    );
    cnt.end();
  } catch (error) {
    res.redirect('/404');
  }
});

router.get('/:id/download', async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id).select('-__v');
    res.download(
      __dirname + '/../public/books/' + book.fileBook,
      book.fileName
    );
  } catch (error) {
    res.redirect('/404');
  }
});

router.get('/update/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id).select('-__v');
    res.render('book/update', {
      title: 'Books | view',
      books: book,
    });
  } catch (error) {
    res.redirect('/404');
  }
});

router.post('/create', fileMiddleware.single('fileBook'), async (req, res) => {
  const id = uuid();
  const { title, description, authors, favorite, fileCover, fileName, fileBook } =
    req.body;

  const newBook = new Book({
    id,
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  });

  try {
    await newBook.save();
    res.redirect('/books');
  } catch (error) {
    res.redirect('/404');
  }
});

router.post('/update/:id', fileMiddleware.single('fileBook'), async (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName, fileBook } =
    req.body;

  try {
    await Book.findByIdAndUpdate(id, {
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      fileBook,
    });
    res.redirect(`/books/${id}`);
  } catch (error) {
    res.redirect('/404');
  }
});

router.post('/delete/:id',  async (req, res) => {
  const { id } = req.params;

  try {
    await Book.deleteOne({ _id: id });
    res.redirect('/books');
  } catch (error) {
    res.status(500).json(error);
    res.redirect('/404');
  }
});

module.exports = router;
