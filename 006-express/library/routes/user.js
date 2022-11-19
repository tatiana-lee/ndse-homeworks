const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

const verify = async (username, password, done) => {
  try {
    const user = await User.findOne({
      username: username,
      password: password,
    }).select('-__v');
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

const options = {
  usernameField: 'username',
  passwordField: 'password',
  emailField: 'email',
};

passport.use('local', new LocalStrategy(options, verify));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, email: user.email });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'SECRET', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

app.get('/login', (req, res) => {
  res.render('user/login', { title: 'Авторизация' });
});

app.get('/signup', (req, res) => {
  res.render('user/signup', { title: 'Регистрация' });
});

app.get(
  '/me',
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }
    next();
  },
  (req, res) => {
    res.render('user/profile', { title: 'Ваш профиль', user: req.user });
  }
);

app.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

app.post(
  '/login',
  passport.authenticate('local', { session: 'SECRET' }),
  (req, res) => {
    console.log('req.user: ', req.user);
    res.redirect('/');
  }
);

app.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  const newUser = new User({ username, password, email });

  try {
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    res.redirect('/404');
  }
});

module.exports = app;
