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

userRouter.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send("invalid parameter");
  }

  try {
    await userController.deleteUser(id);
    res.status(201).json("user deleted succesfully");
  } catch (error) {
    next(error);
  }
});
