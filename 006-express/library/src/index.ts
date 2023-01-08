import 'reflect-metadata';

import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { errorMiddleware } from './middleware/error';
import indexRouter from './routes/index';
import booksRouter from './routes/books';
import apiRouter from './routes/api/index';
import userRouter from './routes/user';
import userApiRouter from './routes/userApi/userApi';

import http from 'http';
import * as SocketIO from 'socket.io';

const app = express();

const server = http.createServer(app);
const io = new SocketIO.Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../views')));

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

  socket.on('message-to-all', (msg: any) => {
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

async function start(PORT: any, MongoURL: any) {
  try {
    await mongoose.connect(MongoURL, { dbName: 'library' });
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start(PORT, MongoURL);
