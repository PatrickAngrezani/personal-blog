import request from "supertest";
import { expect, test } from "@jest/globals";
import dotenv from "dotenv";
import { connectToDatabase, disconnectToDatabase } from "../../src/db/db";
import express, { Application } from "express";
import cors from "cors";
import userRouter from "../../src/routes/usersRoute";
import { CreateUserDto } from "../../src/db/dto/createUserDto.dto";
import UserModel from "../../src/models/userModel";

dotenv.config();

let server: any;
const app: Application = express();
app.use(cors());
app.use(express.json());
const userModel = new UserModel();

beforeAll(async () => {
  await connectToDatabase();
  app.use("/users", userRouter);
  server = app.listen();
});

afterAll(async () => {
  await disconnectToDatabase();
  await server.close();
});

describe("User - GET '/'", () => {
  test("should get all users when not passing ID as parameter", async () => {
    const response = await request(app).get("/users");
    const users = response.body;

    expect(response.status).toEqual(200);
    expect(users).toBeDefined();
  });

  test("should get an users with ID provided", async () => {
    const response = await request(app).get(
      "/users/8550d2e9-93de-4703-a1be-f09edd2cb182"
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

describe("User - POST '/create'", () => {
  const firstNames = [
    "John",
    "Jane",
    "Emily",
    "Michael",
    "Sarah",
    "David",
    "Jessica",
    "Robert",
    "Jennifer",
    "Matthew",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
    "Davis",
    "Garcia",
    "Rodriguez",
    "Wilson",
  ];

  const firstNameIndex = Math.floor(Math.random() * firstNames.length);
  const lastNameIndex = Math.floor(Math.random() * lastNames.length);
  const firstName = firstNames[firstNameIndex];
  const lastName = lastNames[lastNameIndex];

  test("should create a new user", async () => {
    const createUserDto: CreateUserDto = {
      firstName,
      lastName,
      email: `${firstName}${lastName}${userModel.generateRandomNumber(
        2
      )}@email.com`.toLowerCase(),
      nationalId: userModel.formatNationalId(
        Number(userModel.generateRandomNumber(11))
      ),
      postLimit: 2,
      blocked: false,
      numberOfComments: 9,
    };

    console.log({ createUserDto });

    const response = await request(app)
      .post("/users/create")
      .send(createUserDto);

    expect(response.status).toEqual(201);
    expect(response.body).toBeDefined();
  });
});
