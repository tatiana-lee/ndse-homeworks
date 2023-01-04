// const Book = require('./Book.js')

interface Book {
  id: string;
  title: string;
  description: string;
  authors: string;
  favorite: string;
  fileCover: string;
  fileName: string;
  fileBook: string
};

abstract class BooksRepository {
  createBook(book: Book) {
    console.log('Создать книгу');
    return book;
  };
  getBook(id: string) {
    console.log('Получение книги по id');
    return id;
  };
  getBooks() {
    console.log('Получение всех книг');
    return 0;
  };
  updateBook(id: string) {
    console.log('Обновдение книги');
    return 0;
  };
  deleteBook(id: string) {
    console.log('Удаление книги');
    return 0;
  }
}
