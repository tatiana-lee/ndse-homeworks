"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const container_1 = require("../container/container");
const User_model_1 = require("../models/User.model");
const UserRepository_1 = require("../models/UserRepository");
const verify = (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_model_1.UserModel.findOne({
            username: username,
            password: password,
        }).select('-__v');
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
});
const options = {
    usernameField: 'username',
    passwordField: 'password',
    emailField: 'email',
};
passport_1.default.use('local', new passport_local_1.default.Strategy(options, verify));
passport_1.default.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username, email: user.email });
    });
});
passport_1.default.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({ secret: 'SECRET', resave: true, saveUninitialized: true }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});
app.get('/login', (req, res) => {
    res.render('user/login', { title: 'Авторизация' });
});
app.get('/signup', (req, res) => {
    res.render('user/signup', { title: 'Регистрация' });
});
app.get('/me', (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}, (req, res) => {
    res.render('user/profile', { title: 'Ваш профиль', user: req.user });
});
app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
app.post('/login', passport_1.default.authenticate('local'), (req, res) => {
    console.log('req.user: ', req.user);
    res.redirect('/');
});
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    const data = { username, password, email };
    try {
        const repo = container_1.container.get(UserRepository_1.UserRepository);
        repo.createUser(data);
        res.redirect('/login');
    }
    catch (error) {
        console.log(error);
        res.redirect('/404');
    }
}));
exports.default = app;
