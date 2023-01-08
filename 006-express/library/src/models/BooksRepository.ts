import { BookModel } from './Book.model';
import { IBook } from './book';
import { injectable } from 'inversify';

interface CreateBookDto {
  title: IBook['title'];
  description: IBook['description'];
  authors: IBook['authors']
};

@injectable()
export class BooksRepository {
  async createBook(data: CreateBookDto): Promise<IBook> {
    const book = new BookModel(data)
    await book.save();
    return book;
  };

  async getBook(id: string): Promise<IBook | null> {
    const books = await BookModel.findById(id).select('-__v');
    return books;
  };

  async getBooks(): Promise<IBook[]> {
    const books = await BookModel.find().select('-__v');
    return books;
  };

  async updateBook(id: string, data: CreateBookDto): Promise<IBook | null> {
    const books = await BookModel.findByIdAndUpdate(id, data)
    return books;
  };
  
  async deleteBook(id: string): Promise<IBook | null> {
    await BookModel.deleteOne({ _id: id });
    return null;
  }
};
