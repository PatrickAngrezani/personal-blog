import express, { Router } from "express";
import { UserController } from "../controllers/userController";
import UserModel from "../models/userModel";
import { CreateUserDto } from "../db/dto/createUserDto.dto";
import { GetUsersResponseDto } from "../db/dto/response/getUserResponseDto.dto";

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

userRouter.delete("/hard_delete/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send("invalid parameter");
  }

  try {
    res.status(201).json(await userController.deleteUser(id));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error hard deleting user" });
  }
});

userRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send("invalid parameter");
  }

  try {
    res.status(200).json(await userController.softDelete(id));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error soft deleting user" });
  }
});

userRouter.get("/:id?", async (req, res) => {
  const id = req.params.id;

  try {
    const users: GetUsersResponseDto[] = await userController.getUsers(id);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving users" });
  }
});
