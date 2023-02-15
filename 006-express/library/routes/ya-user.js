const express = require('express');
const passport = require('../passport');

const app = express();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

app.get('/profile', isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

app.get('/login', passport.authenticate('yandex'));
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

app.get(
  '/login/callback',
  passport.authenticate('yandex', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = app;
