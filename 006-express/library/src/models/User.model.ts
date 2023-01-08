import { Schema, model } from 'mongoose';
import { IUser } from './user';

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

export const UserModel = model<IUser>('User', userSchema);
