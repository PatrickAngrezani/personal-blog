import { CreateUserDto } from "../db/dto/createUserDto";
import UserModel from "../models/userModel";

export class UserController {
  constructor(private readonly userModel: UserModel) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userModel.createUser(createUserDto);
    return newUser;
  }
}
