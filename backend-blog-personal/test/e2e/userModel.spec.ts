import request from "supertest";
import { expect, test } from "@jest/globals";
import dotenv from "dotenv";
import { connectToDatabase, disconnectToDatabase } from "../../src/db/db";
import express, { Application } from "express";
import cors from "cors";
import userRouter from "../../src/routes/usersRoute";
import { CreateUserDto } from "../../src/db/dto/createUserDto.dto";
import UserModel from "../../src/models/userModel";
import { UpdateUserDto } from "../../src/db/dto/updateUserDto.dto";

dotenv.config();

let server: any;
const app: Application = express();
app.use(cors());
app.use(express.json());
const userModel = new UserModel();

beforeAll(async () => {
  if (process.env.DB_DATABASE === "postgres")
    throw new Error("incorrect database");
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
      "/users/f1ec1a48-0ffc-4d6b-8bb6-f2fa47d89d01"
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

    const response = await request(app)
      .post("/users/create")
      .send(createUserDto);

    expect(response.status).toEqual(201);
    expect(response.body).toBeDefined();
  });

  test('should throw an error "missing email or national_id"', async () => {
    const createUserDto = {
      firstName,
      lastName,
      nationalId: userModel.formatNationalId(
        Number(userModel.generateRandomNumber(11))
      ),
      postLimit: 2,
      blocked: false,
      numberOfComments: 9,
    };

    const response = await request(app)
      .post("/users/create")
      .send(createUserDto);

    expect(response.status).toEqual(500);
    expect(response.body).toMatchObject({ message: "Error creating user" });
  });

  test('should throw an error "email or national_id is not available"', async () => {
    const createUserDto = {
      firstName,
      lastName,
      email: `michaelrodriguez86@email.com`,
      nationalId: userModel.formatNationalId(
        Number(userModel.generateRandomNumber(11))
      ),
      postLimit: 2,
      blocked: false,
      numberOfComments: 9,
    };

    const response = await request(app)
      .post("/users/create")
      .send(createUserDto);

    expect(response.status).toEqual(500);
    expect(response.body).toMatchObject({ message: "Error creating user" });
  });
});

describe("User - PUT 'update'", () => {
  test("should update user", async () => {
    const updateUserDto: UpdateUserDto = {
      id: "f1ec1a48-0ffc-4d6b-8bb6-f2fa47d89d01",
      email: "michaelrodriguezupdated@email.com",
      numberOfComments: 11,
      postLimit: 3,
      userToken: 123456,
    };

    const response = await request(app)
      .put("/users/update")
      .send(updateUserDto);

    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toEqual(updateUserDto.id);
  });

  test("should throw error when there is no user with ID provided", async () => {
    const updateUserDto: UpdateUserDto = {
      id: "random-id",
      email: "randomemail@email.com",
      numberOfComments: 11,
      postLimit: 3,
      userToken: 123456,
    };

    const response = await request(app)
      .put("/users/update")
      .send(updateUserDto);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({ message: "Error updating user" });
  });

  test("should throw error when email not provided in DTO", async () => {
    const updateUserDto = {
      id: "75faa509-9a84-405e-b67e-87c5e38a310d",
      numberOfComments: 11,
      postLimit: 3,
      userToken: 123456,
    };

    const response = await request(app)
      .put("/users/update")
      .send(updateUserDto);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({ message: "Error updating user" });
  });
});
