const express = require('express');
const router = express.Router();
const Book = require('../../models/Book');
const container = require('../../container/container')
const { v4: uuid } = require('uuid');

const fileMiddleware = require('../../middleware/fileBook');

router.get('/', async (req, res) => {
  try {
    // const books = await Book.find().select('-__v');
    const repo = container.get(BooksRepository);
    const books = await repo.getBooks();
    res.json(books);
  } catch (error) {
    res.status(404).json({ msg: error });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const repo = container.get(BooksRepository);

  try {
    // const books = await Book.findById(id).select('-__v');
    const books = await repo.getBook(id)
    res.json(books);
  } catch (error) {
    res.status(404).json({ msg: error });
  }
});

router.post('/', fileMiddleware.single('fileBook'), async (req, res) => {
  const id = uuid();
  const { title, description, authors, favorite, fileCover, fileName } =
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
    // await newBook.save();
    const repo = container.get(BooksRepository);
    const book = await repo.createBook(newBook)
    res.json(book);
  } catch (error) {
    res.status(404).json({ msg: error });
  }
});

router.put('/:id', fileMiddleware.single('fileBook'), async (req, res) => {
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

  try {
    // await Book.findByIdAndUpdate(id, {
    //   title,
    //   description,
    //   authors,
    //   favorite,
    //   fileCover,
    //   fileName,
    //   fileBook,
    // });
    const repo = container.get(BooksRepository);
    repo.updateBook(id)
    res.redirect(`/books/${id}`);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // await Book.deleteOne({ _id: id });
    const repo = container.get(BooksRepository);
    repo.deleteBook(id)
    res.json('ok');
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

module.exports = router;
