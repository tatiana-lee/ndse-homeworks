import express from 'express';
import session from 'express-session';
import passport from 'passport';
import Strategy from 'passport-local';
import { container } from '../../container/container';
import { UserModel } from '../../models/User.model';
import { UserRepository } from '../../models/UserRepository';

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
};

passport.use('local', new Strategy.Strategy(options, verify));

passport.serializeUser(function (user: any, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
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

app.get('/login', (req: any, res: any) => {
  res.json({ user: req.user });
});

app.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req: any, res: any) => {
    res.json(req.user);
  }
);

app.post('/signup', async (req: any, res: any) => {
  const { username, password, email } = req.body;
  const data = { username, password, email }
  try {
    const repo = container.get(UserRepository)
    const newUser = repo.createUser(data)
    res.json(newUser);
  } catch (error) {
    res.json({ errmsg: error });
  }
});

export default app;
