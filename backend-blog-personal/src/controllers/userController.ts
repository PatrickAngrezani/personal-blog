import { CreateUserDto } from "../db/dto/createUserDto.dto";
import { GetUsersResponseDto } from "../db/dto/response/getUserResponseDto.dto";
import UserModel from "../models/userModel";

export class UserController {
  constructor(private readonly userModel: UserModel) {}

  async createUser(createUserDto: CreateUserDto) {
    return await this.userModel.createUser(createUserDto);
  }

  async deleteUser(id: string) {
    return await this.userModel.deleteUser(id);
  }

  async softDelete(id: string) {
    return await this.userModel.softDelete(id);
  }

  async getUsers(id?: string): Promise<GetUsersResponseDto[]> {
    return await this.userModel.getUsers(id);
  }
}
