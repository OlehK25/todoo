import { Router } from "express";

import { userController } from "./users.controller";
import { loginValidation, signupValidation } from "./users.validator";
import { authMiddleware } from "../middleware/auth";

export const usersRouter: Router = Router();

usersRouter.post(
  "/login",
  loginValidation,
  userController.login.bind(userController),
);
usersRouter.post(
  "/signup",
  signupValidation,
  userController.signup.bind(userController),
);
usersRouter.get("/", authMiddleware, userController.getAllUsers);
