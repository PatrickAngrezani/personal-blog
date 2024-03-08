import { CreateUserDto } from "../db/dto/createUserDto";
import UserModel from "../models/userModel";

export class UserController {
  constructor(private readonly userModel: UserModel) {}

  async createUser(createUserDto: CreateUserDto) {
    return await this.userModel.createUser(createUserDto);
  }

  async deleteUser(id: string) {
    return await this.userModel.deleteUser(id);
  }
}
