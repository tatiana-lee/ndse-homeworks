import express from 'express';
import session from 'express-session';
import passport from 'passport';
import Strategy from 'passport-local';
import { container } from '../container/container';
import { UserModel } from '../models/User.model';
import { UserRepository } from '../models/UserRepository';

const verify = async (username: string, password: string, done: any) => {
  try {
    const user = await UserModel.findOne({
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

passport.use('local', new Strategy.Strategy(options, verify));

passport.serializeUser(function (user: any, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, email: user.email });
  });
});

passport.deserializeUser(function (user: any, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'SECRET', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req: any, res: any) => {
  res.render('index', { user: req.user });
});

app.get('/login', (req: any, res: any) => {
  res.render('user/login', { title: 'Авторизация' });
});

app.get('/signup', (req: any, res: any) => {
  res.render('user/signup', { title: 'Регистрация' });
});

app.get(
  '/me',
  (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }
    next();
  },
  (req: any, res: any) => {
    res.render('user/profile', { title: 'Ваш профиль', user: req.user });
  }
);

app.get('/logout', function (req: any, res: any, next: any) {
  req.logout(function (err: any) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

app.post(
  '/login',
  passport.authenticate('local'),
  (req: any, res: any) => {
    console.log('req.user: ', req.user);
    res.redirect('/');
  }
);

app.post('/signup', async (req: any, res: any) => {
  const { username, password, email } = req.body;
  const data = { username, password, email };

  try {
    const repo = container.get(UserRepository);
    repo.createUser(data);
    res.redirect('/login');
  } catch (error) {
    console.log(error)
    res.redirect('/404');
  }
});

export default app;
