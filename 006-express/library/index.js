const e = require('express');
const express = require('express');
const { v4: uuid } = require('uuid');

const library = {
  books: [],
};

class Book {
  constructor(
    title = '',
    description = '',
    authors = '',
    favorite = '',
    fileCover = '',
    fileName = '',
    id = uuid()
  ) {
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.id = id;
  }
}

const app = express();
app.use(express.json());

app.get('/api/books', (req, res) => {
  const { books } = library;
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const { books } = library;
  const { id } = req.params;
  const i = books.findIndex((book) => book.id === id);

  if (i !== -1) {
    res.json(books[i]);
  } else {
    res.status(404);
    res.json('Code: 404 | Not found');
  }
});

app.post('/api/books', (req, res) => {
  const { books } = library;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;

  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  );
  books.push(newBook);

  res.status(201);
  res.json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const { books } = library;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const { id } = req.params;
  const i = books.findIndex((book) => book.id === id);

  if (i !== -1) {
    books[i] = {
      ...books[i],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
    };
    res.json(books[i]);
  } else {
    res.status(404);
    res.json('Code: 404 | Not found');
  }
});

app.delete('/api/books/:id', (req, res) => {
  const { books } = library;
  const { id } = req.params;
  const i = books.findIndex((book) => book.id === id);

  if (i !== -1) {
    books.splice(i, 1);
    res.json('OK');
  } else {
    res.status(404);
    res.json('Code: 404 | Not found');
  }
});


app.post('/api/user/login', (req, res) => {
  const user = { 'id': 1, 'mail': "test@mail.ru" }
  res.status(201)
  res.json(user)
})

const PORT = process.env.PORT || 3000;
app.listen(PORT);
