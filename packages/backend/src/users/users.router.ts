import { Router } from "express";

import { userController } from "./users.controller";
import { loginValidation, signupValidation } from "./users.validator";
import { authMiddleware } from "../middleware/auth";
import { authController } from "../auth/auth.controller";
import { Role } from "../enums/Role";

export const usersRouter: Router = Router();

usersRouter.post(
  "/signup",
  signupValidation,
  authController.signup.bind(authController),
);
usersRouter.post(
  "/login",
  loginValidation,
  authController.login.bind(authController),
);
usersRouter.post(
  "/forgotPassword",
  authController.forgotPassword.bind(authController),
);
usersRouter.post("/getCode", authController.getCode.bind(authController));
usersRouter.patch(
  "/resetPassword",
  authController.resetPassword.bind(authController),
);

usersRouter.use(authMiddleware);
usersRouter.get("/logout", authController.logout.bind(authController));

usersRouter.get("/me", userController.getMe);
usersRouter.patch("/updateMe", userController.updateMe);
usersRouter.delete("/deleteMe", userController.deleteMe);

usersRouter.use(authController.restrictTo(Role.admin));
usersRouter.get("/", userController.getAllUsers);
usersRouter.get("/userscripts", userController.getUserWithTasks);
usersRouter.get("/:id", userController.getUser);
