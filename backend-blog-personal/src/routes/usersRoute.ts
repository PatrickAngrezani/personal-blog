import express, { Router } from "express";
import { UserController } from "../controllers/userController";
import UserModel from "../models/userModel";
import { CreateUserDto } from "../db/dto/createUserDto.dto";
import { GetUsersResponseDto } from "../db/dto/response/getUserResponseDto.dto";
import { UpdateUserDto } from "../db/dto/updateUserDto.dto";

const userModel = new UserModel();
const userController = new UserController(userModel);

export const userRouter: Router = express.Router();

userRouter.post("/create", async (req, res, next) => {
  const dto: CreateUserDto = req.body;

  try {
    res.status(201).json(await userController.createUser(dto));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
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

userRouter.put("/update", async (req, res) => {
  const dto: UpdateUserDto = req.body;

  try {
    res.status(200).json(await userController.updateUser(dto));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
});
