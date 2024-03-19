import { CreateUserDto } from "../db/dto/createUserDto.dto";
import { Pool, QueryResult } from "pg";
import { GetUsersResponseDto } from "../db/dto/response/getUserResponseDto.dto";
import { NotFoundException } from "../errors/notFoundException";
import { DeleteUserResponseDto } from "../db/dto/response/deleteUserResponseDto.dto";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export default class UserModel {
  async createUser(dto: CreateUserDto): Promise<any> {
    const client = await pool.connect();

    if (!dto.email || !dto.nationalId)
      throw new Error("missing email or national_id");

    const users = await this.checkExistingUsers(dto);
    if (users) throw new Error("email or national_id is not available");

    try {
      const result: QueryResult = await client.query(
        "INSERT INTO blog.user (first_name, last_name, email, national_id, post_limit, blocked, number_of_comments) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [
          dto.firstName,
          dto.lastName,
          dto.email,
          dto.nationalId,
          dto.postLimit || 10,
          false,
          dto.numberOfComments || 100,
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error({ error });
      throw new Error("Error creating user");
    } finally {
      client.release();
    }
  }

  async deleteUser(id: string) {
    const client = await pool.connect();

    try {
      const result: QueryResult = await client.query(
        "DELETE FROM blog.user WHERE id = $1",
        [id]
      );

      return result.rows[0];
    } catch (error) {
      console.error({ error });
      throw new Error("Error deleting user");
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
          "SELECT first_name, last_name, email, national_id, deleted_at FROM blog.user"
        );

        users = result.rows.map(this.rowToDto);
      } else {
        const query = `SELECT first_name, last_name, email, national_id, deleted_at FROM blog.user WHERE id = $1`;
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
}
