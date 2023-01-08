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
const container_1 = require("../../container/container");
const fileBook_1 = require("../../middleware/fileBook");
const BooksRepository_1 = require("../../models/BooksRepository");
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repo = container_1.container.get(BooksRepository_1.BooksRepository);
        const books = yield repo.getBooks();
        res.json(books);
    }
    catch (error) {
        res.status(404).json({ msg: error });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const repo = container_1.container.get(BooksRepository_1.BooksRepository);
    try {
        const books = yield repo.getBook(id);
        res.json(books);
    }
    catch (error) {
        res.status(404).json({ msg: error });
    }
}));
router.post('/', fileBook_1.fileMiddleware.single('fileBook'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    const newBook = {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    };
    try {
        const repo = container_1.container.get(BooksRepository_1.BooksRepository);
        const book = yield repo.createBook(newBook);
        res.json(book);
    }
    catch (error) {
        res.status(404).json({ msg: error });
    }
}));
router.put('/:id', fileBook_1.fileMiddleware.single('fileBook'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, authors, favorite, fileCover, fileName, fileBook, } = req.body;
    const data = {
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
        repo.updateBook(id, data);
        res.redirect(`/books/${id}`);
    }
    catch (error) {
        res.status(500).json({ msg: error });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const repo = container_1.container.get(BooksRepository_1.BooksRepository);
        repo.deleteBook(id);
        res.json('ok');
    }
    catch (error) {
        res.status(500).json({ msg: error });
    }
}));
exports.default = router;
