import { CreateUserDto } from "../db/dto/createUserDto.dto";
import { CreateUserResponseDto } from "../db/dto/response/createUserResponseDto.dto";
import { GetUsersResponseDto } from "../db/dto/response/getUserResponseDto.dto";
import { UpdateUserResponseDto } from "../db/dto/response/updateUserResponseDto.dto";
import { UpdateUserDto } from "../db/dto/updateUserDto.dto";
import UserModel from "../models/userModel";

export class UserController {
  constructor(private readonly userModel: UserModel) {}

  async createUser(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    return await this.userModel.createUser(dto);
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

  async updateUser(dto: UpdateUserDto): Promise<UpdateUserResponseDto> {
    return await this.userModel.updateUser(dto);
  }
}
