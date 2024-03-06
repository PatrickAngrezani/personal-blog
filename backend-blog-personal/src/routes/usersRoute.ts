import express, { Router } from "express";
import { UserController } from "../controllers/userController";
import UserModel from "../models/userModel";
import { CreateUserDto } from "../db/dto/createUserDto";

const userModel = new UserModel();
const userController = new UserController(userModel);

export const userRouter: Router = express.Router();

userRouter.post("/create", async (req, res, next) => {
  const dto: CreateUserDto = req.body;

  try {
    const result = await userController.createUser(dto);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});
