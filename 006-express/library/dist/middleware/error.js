"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (req, res) => {
    res.status(404);
    const content = '404 | not found';
    res.send(content);
};
exports.errorMiddleware = errorMiddleware;
