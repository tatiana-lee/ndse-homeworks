require('dotenv').config();
const express = require('express');
const path = require('path');
const errorMiddleware = require('./middleware/error');
const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const yandexRouter = require('./routes/ya-user');
const passport = require('./passport');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET || 'COOKIE_SECRET',
  })
);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname + 'views')));

app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/user', yandexRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`);
});
