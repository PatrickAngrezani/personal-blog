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
}
