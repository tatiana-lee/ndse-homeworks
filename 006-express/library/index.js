const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const errorMiddleware = require('./middleware/error');
const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const apiRouter = require('./routes/api/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname + 'views')));

app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/api/books', apiRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
const MongoURL = process.env.MONGODB_URL;

async function start(PORT, MongoURL) {
  try {
    await mongoose.connect(MongoURL, {dbName: 'library'});
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    });
  } catch (error) {
    console.log(error);
  }
}

start(PORT, MongoURL);
