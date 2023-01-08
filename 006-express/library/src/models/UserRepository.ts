import { injectable } from "inversify";
import { IUser } from "./user";
import { UserModel } from "./User.model";

interface CreateUserDto {
  username: IUser['username'];
  password: IUser['password'];
  email: IUser['email']
};

@injectable()
export class UserRepository {
  async createUser(data: CreateUserDto): Promise<IUser> {
    const user = new UserModel(data);
    await user.save();
    return user
  }
};
