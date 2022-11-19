const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const errorMiddleware = require('./middleware/error');
const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const apiRouter = require('./routes/api/index');
const userRouter = require('./routes/user');
const userApiRouter = require('./routes/userApi/userApi');

const http = require('http');
const socketIO = require('socket.io');

const app = express();

const server = http.Server(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname + 'views')));

app.use(session({ secret: 'SECRET', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/api/books', apiRouter);
app.use('/', userRouter);
app.use('/api/user', userApiRouter);

app.use(errorMiddleware);

io.on('connection', (socket) => {
  const { id } = socket;
  console.log(`Socket connected: ${id}`);

  socket.on('message-to-all', (msg) => {
    msg.type = 'all';
    socket.broadcast.emit('message-to-all', msg);
    socket.emit('message-to-all', msg);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${id}`);
  });
});

const PORT = process.env.PORT || 3000;
const MongoURL = process.env.MONGODB_URL;

async function start(PORT, MongoURL) {
  try {
    await mongoose.connect(MongoURL, { dbName: 'library' });
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start(PORT, MongoURL);
