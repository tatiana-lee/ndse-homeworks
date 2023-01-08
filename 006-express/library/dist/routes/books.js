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
const http_1 = __importDefault(require("http"));
const container_1 = require("../container/container");
const fileBook_1 = require("../middleware/fileBook");
const BooksRepository_1 = require("../models/BooksRepository");
const router = express_1.default.Router();
const COUNTER_URL = process.env.COUNTER_URL;
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repo = container_1.container.get(BooksRepository_1.BooksRepository);
        const books = yield repo.getBooks();
        res.render('book/index', {
            title: 'Books',
            books: books,
        });
    }
    catch (error) {
        console.log(error);
        res.redirect('/404');
    }
}));
router.get('/create', (req, res) => {
    res.render('book/create', {
        title: 'Books | create',
        books: {},
    });
});
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const repo = container_1.container.get(BooksRepository_1.BooksRepository);
        const books = yield repo.getBook(id);
        const cnt = http_1.default.request(`${COUNTER_URL}/counter/${id}/incr`, { method: 'POST' }, (cb) => {
            cb.setEncoding('utf-8');
            let rawData = '';
            cb.on('data', (chunk) => (rawData += chunk));
            cb.on('end', () => {
                const counter = JSON.parse(rawData).views;
                try {
                    res.render('book/view', {
                        title: 'Books | view',
                        books: books,
                        cntr: counter,
                    });
                }
                catch (error) {
                    console.log(error);
                }
            });
        });
        cnt.end();
    }
    catch (error) {
        res.redirect('/404');
    }
}));
router.get('/:id/download', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const repo = container_1.container.get(BooksRepository_1.BooksRepository);
        const book = yield repo.getBook(id);
        res.download(__dirname + '/../public/books/' + (book === null || book === void 0 ? void 0 : book.fileBook), book === null || book === void 0 ? void 0 : book.fileName);
    }
    catch (error) {
        res.redirect('/404');
    }
}));
router.get('/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const repo = container_1.container.get(BooksRepository_1.BooksRepository);
        const book = yield repo.getBook(id);
        res.render('book/update', {
            title: 'Books | view',
            books: book,
        });
    }
    catch (error) {
        res.redirect('/404');
    }
}));
router.post('/create', fileBook_1.fileMiddleware.single('fileBook'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, authors, favorite, fileCover, fileName, fileBook } = req.body;
    const newBook = {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook,
    };
    try {
        const repo = container_1.container.get(BooksRepository_1.BooksRepository);
        yield repo.createBook(newBook);
        res.redirect('/books');
    }
    catch (error) {
        res.redirect('/404');
    }
}));
router.post('/update/:id', fileBook_1.fileMiddleware.single('fileBook'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, authors, favorite, fileCover, fileName, fileBook } = req.body;
    try {
        const data = {
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
            fileBook,
        };
        const repo = container_1.container.get(BooksRepository_1.BooksRepository);
        repo.updateBook(id, data);
        res.redirect(`/books/${id}`);
    }
    catch (error) {
        res.redirect('/404');
    }
}));
router.post('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const repo = container_1.container.get(BooksRepository_1.BooksRepository);
        yield repo.deleteBook(id);
        res.redirect('/books');
    }
    catch (error) {
        res.status(500).json(error);
        res.redirect('/404');
    }
}));
exports.default = router;
