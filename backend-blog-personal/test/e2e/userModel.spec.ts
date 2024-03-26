import app from "../../src/index";
import request from "supertest";
import { expect, jest, test } from "@jest/globals";
import { Client } from "pg";
import dotenv from "dotenv";
import { connectToDatabase, disconnectToDatabase } from "../../src/db/db";

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: Number(process.env.DB_PORT),
};

let db: Client;

beforeEach(async () => {
  db = new Client(dbConfig);
  await connectToDatabase();
});

afterEach(async () => {
  await disconnectToDatabase();
});

describe("UserModel", () => {
  test("should get all users when not passing ID as parameter", async () => {
    const response = await request(app).get("/users");
    const users = response.body;

    expect(response.status).toEqual(200);
    expect(users).toBeDefined();
  });

  test("should get an users with ID provided", async () => {
    const response = await request(app).get(
      "/users/6f028f78-7f13-4fb7-ad97-eb98afc277e6"
    );
    const users = response.body;

    expect(response.status).toEqual(200);
    expect(users).toBeDefined();
  });

  test("should throw error when there is no user with ID provided", async () => {
    try {
      const response = await request(app).get(
        "/users/6f028f78-7f13-4fb7-ad97-eb98afc277e9"
      );

      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ message: "Error retrieving users" });
    } catch (error) {
      console.error(error);
    }
  });
});
