import { CreateUserDto } from "../db/dto/createUserDto.dto";
import { Pool, QueryResult } from "pg";
import { GetUsersResponseDto } from "../db/dto/response/getUserResponseDto.dto";
import { NotFoundException } from "../errors/notFoundException";
import { DeleteUserResponseDto } from "../db/dto/response/deleteUserResponseDto.dto";
import { CreateUserResponseDto } from "../db/dto/response/createUserResponseDto.dto";
import { UpdateUserDto } from "../db/dto/updateUserDto.dto";
import { UpdateUserResponseDto } from "../db/dto/response/updateUserResponseDto.dto";
import dotenv from "dotenv";
import { randomBytes, randomInt } from "crypto";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER ? process.env.DB_USER : process.env.DB_USER_TEST,
  host: process.env.DB_HOST ? process.env.DB_HOST : process.env.DB_HOST_TEST,
  database: process.env.DB_DATABASE
    ? process.env.DB_DATABASE
    : process.env.DB_DATABASE_TEST,
  password: String(
    process.env.DB_PASSWORD
      ? process.env.DB_PASSWORD
      : process.env.DB_PASSWORD_TEST
  ),
  port: Number(
    process.env.DB_PORT ? process.env.DB_PORT : process.env.DB_PORT_TEST
  ),
});

export default class UserModel {
  async createUser(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    const client = await pool.connect();

    if (!dto.email || !dto.nationalId)
      throw new Error("missing email or national_id");

    const users = await this.checkExistingUsers(dto);
    if (users) throw new Error("email or national_id is not available");

    try {
      const result: QueryResult = await client.query(
        "INSERT INTO blog.user (first_name, last_name, email, national_id, post_limit, user_token, blocked, number_of_comments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [
          dto.firstName,
          dto.lastName,
          dto.email,
          this.formatNationalId(dto.nationalId),
          dto.postLimit || 10,
          this.generateUserToken(),
          false,
          dto.numberOfComments || 100,
        ]
      );

      const response: CreateUserResponseDto = {
        email: result.rows[0].email,
        nationalId: result.rows[0].national_id,
      };

      return response;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteUser(id: string) {
    const client = await pool.connect();

    try {
      const checkDeletedUser = await this.getUsers(id);
      if (!checkDeletedUser) throw new NotFoundException("User not found");
      await client.query("DELETE FROM blog.user WHERE id = $1", [id]);

      const response: DeleteUserResponseDto = {
        id,
        deletedAt: this.formatDate(Date.now()),
      };

      return response;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async softDelete(id: string) {
    const client = await pool.connect();

    try {
      const checkDeletedUser = await this.getUsers(id);
      if (checkDeletedUser[0].deletedAt)
        throw new Error("User already soft deleted");

      await client.query(
        "UPDATE blog.user SET deleted_at = NOW() WHERE id = $1",
        [id]
      );

      const response: DeleteUserResponseDto = {
        id,
        deletedAt: this.formatDate(Date.now()),
      };

      return response;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async getUsers(id?: string): Promise<GetUsersResponseDto[]> {
    const client = await pool.connect();
    let users: GetUsersResponseDto[] = [];

    try {
      if (!id) {
        const result: QueryResult = await client.query(
          "SELECT * FROM blog.user"
        );

        users = result.rows.map(this.rowToDto);
      } else {
        const query = `SELECT * FROM blog.user WHERE id = $1`;
        const values = [id];

        const result = await client.query(query, values);

        if (result.rows.length > 0) {
          users = result.rows.map(this.rowToDto);
        } else {
          throw new NotFoundException("User not found");
        }
      }

      return users;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  async updateUser(dto: UpdateUserDto): Promise<UpdateUserResponseDto> {
    const client = await pool.connect();

    const user = await this.getUsers(dto.id);
    if (!user) throw new NotFoundException("User not found");

    if (!dto.email) throw new Error("Email should be provided");

    try {
      let query = `
        UPDATE blog.user
        SET `;

      const updateFields = [];
      const updateData = [];

      if (dto.firstName) {
        updateFields.push("first_name = $" + (updateFields.length + 1));
        updateData.push(dto.firstName);
      }

      if (dto.lastName) {
        updateFields.push("last_name = $" + (updateFields.length + 1));
        updateData.push(dto.lastName);
      }

      updateFields.push("email = $" + (updateFields.length + 1));
      updateData.push(dto.email);
      updateFields.push("user_token = $" + (updateFields.length + 1));
      updateData.push(dto.userToken);
      updateFields.push("post_limit = $" + (updateFields.length + 1));
      updateData.push(dto.postLimit);
      updateFields.push("number_of_comments = $" + (updateFields.length + 1));
      updateData.push(dto.numberOfComments);

      query += updateFields.join(", ");
      query +=
        `, updated_at = NOW() 
                  WHERE id = $` +
        (updateData.length + 1);

      updateData.push(dto.id);

      query += `
        RETURNING id;
      `;

      const result: QueryResult = await client.query(query, updateData);
      const response: UpdateUserResponseDto = {
        id: result.rows[0].id,
        updatedAt: this.formatDate(Date.now()),
      };

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  async checkExistingUsers(dto: CreateUserDto) {
    const client = await pool.connect();

    const result: QueryResult = await client.query("SELECT * FROM blog.user");
    const users = result.rows;

    try {
      const existingUsers = users.filter((user) => {
        let match = false;

        if (user.deleted_at === null) {
          if (dto.nationalId === user.national_id) {
            match = true;
          }
          if (dto.email === user.email) {
            match = true;
          }
        }

        return match;
      });

      if (existingUsers.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  formatDate(dateNow: number): string {
    const deletedAt = new Date(dateNow).toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Sao_Paulo",
    });

    return deletedAt;
  }

  rowToDto(row: any) {
    return new GetUsersResponseDto(
      row.first_name,
      row.last_name,
      row.email,
      row.national_id,
      row.deleted_at
    );
  }

  generateRandomNumber(digits: number) {
    let number = "";

    for (let i = 0; i < digits; i++) {
      number += String(Math.floor(Math.random() * 10));
    }

    return number;
  }

  formatNationalId(number: string) {
    const parts = number.slice(0, 9);
    const numberGroups = parts.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return numberGroups + "-" + number.slice(-2);
  }

  generateUserToken() {
    const token = randomBytes(3).toString("hex").slice(0, 6);
    return token.toUpperCase();
  }
}
