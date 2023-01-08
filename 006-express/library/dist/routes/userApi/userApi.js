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
const container_1 = require("../../container/container");
const User_model_1 = require("../../models/User.model");
const UserRepository_1 = require("../../models/UserRepository");
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
};
passport_1.default.use('local', new passport_local_1.default.Strategy(options, verify));
passport_1.default.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
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
app.get('/login', (req, res) => {
    res.json({ user: req.user });
});
app.post('/login', passport_1.default.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    res.json(req.user);
});
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    const data = { username, password, email };
    try {
        const repo = container_1.container.get(UserRepository_1.UserRepository);
        const newUser = repo.createUser(data);
        res.json(newUser);
    }
    catch (error) {
        res.json({ errmsg: error });
    }
}));
exports.default = app;
