"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const BooksRepository_1 = require("../models/BooksRepository");
const UserRepository_1 = require("../models/UserRepository");
exports.container = new inversify_1.Container();
exports.container.bind(BooksRepository_1.BooksRepository).toSelf();
exports.container.bind(UserRepository_1.UserRepository).toSelf();
