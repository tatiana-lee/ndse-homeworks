const express = require('express');
const path = require('path');
const errorMiddleware = require('./middleware/error');
const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname + 'views')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
