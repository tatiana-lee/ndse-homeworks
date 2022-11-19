const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

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
};

passport.use('local', new LocalStrategy(options, verify));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
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

app.get('/login', (req, res) => {
  res.json({ user: req.user });
});

app.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    res.json(req.user);
  }
);

app.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  const newUser = new User({ username, password, email });

  try {
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.json({ errmsg: error });
  }
});

module.exports = app;
