import { Container } from 'inversify';
import { BooksRepository } from '../models/BooksRepository';
import { UserRepository } from '../models/UserRepository';


export const container = new Container();

container.bind(BooksRepository).toSelf();
container.bind(UserRepository).toSelf();
