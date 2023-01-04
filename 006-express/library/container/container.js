const Container = require('inversify');
const BooksRepository = require('../models/BooksRepository');

const container = new Container();

container.bind(BooksRepository).toSelf();

module.exports = container;
