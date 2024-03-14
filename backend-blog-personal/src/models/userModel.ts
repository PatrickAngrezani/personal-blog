import { CreateUserDto } from "../db/dto/createUserDto";
import { Pool, QueryResult } from "pg";

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

    const users = await this.checkExistingUsers(dto);

    try {
      const result: QueryResult = await client.query(
        "INSERT INTO blog.users (first_name, last_name, email, post_limit, blocked, number_of_comments) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [
          dto.firstName,
          dto.lastName,
          dto.email,
          dto.postLimit || 10,
          false,
          dto.numberOfComments || 100,
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error("Error creating user");
    } finally {
      client.release();
    }
  }

  async deleteUser(id: string) {
    const client = await pool.connect();

    try {
      const result: QueryResult = await client.query(
        "DELETE FROM blog.users WHERE id = $1",
        [id]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error("Error deleting user");
    } finally {
      client.release();
    }
  }

  async softDelete(id: string) {
    const client = await pool.connect();

    try {
      const result: QueryResult = await client.query(
        "UPDATE blog.users SET deleted_at = NOW() WHERE id = $1",
        [id]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error("Error soft deleting user");
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
}
