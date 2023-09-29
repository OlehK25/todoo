import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { plainToInstance } from "class-transformer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validate } from "deep-email-validator";

import { AppDataSource } from "../data-source";
import { User } from "../users/users.entity";
import { Role } from "../enums/Role";
import { Email } from "../utils/email";
import { PasswordResetToken } from "./password.entity";

dotenv.config({ path: "../../.env" });

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateCode = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

class AuthController {
  constructor() {
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.createSendToken = this.createSendToken.bind(this);
    this.restrictTo(...Object.values(Role));
    this.forgotPassword = this.forgotPassword.bind(this);
    this.getCode = this.getCode.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  public createSendToken = async (
    user: User,
    statusCode: number,
    req: Request,
    res: Response,
  ) => {
    const token = signToken(user.id);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });

    res.status(statusCode).json({
      status: "success",
      token,
      data: { user },
    });
  };

  public login = async (
    req: Request,
    res: Response,
  ): Promise<Response | void> => {
    const { email, password } = req.body;

    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(400).json({
          error:
            "Invalid Credentials. While there isn`t user with the specified email address",
        });
      }

      const isMatch = await User.comparePasswords(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Invalid Credentials (wrong password)" });
      }

      await this.createSendToken(user, 200, req, res);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  public signup = async (
    req: Request,
    res: Response,
  ): Promise<Response | void> => {
    const { email, password, passwordConfirm, name } = req.body;

    if (!email || !password || !name || !passwordConfirm) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const { valid } = await validate({
      email,
      validateSMTP: false,
    });

    if (!valid) {
      return res.status(400).json({
        error: `Email isn\`t valid. Please try again!`,
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: "Passwords don`t match" });
    }

    try {
      const existingUser = await AppDataSource.getRepository(User).findOne({
        where: {
          email,
        },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User already exists with this email address" });
      }

      const newUser = plainToInstance(User, {
        email,
        password,
        name,
        verified: false,
      });

      const url = `${req.protocol}://localhost:3000`;
      await new Email(newUser, url).sendWelcome();

      const createdUser = await AppDataSource.getRepository(User).save(newUser);

      await this.createSendToken(createdUser, 201, req, res);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  public logout = (req: Request, res: Response): Response => {
    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });

    return res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  };

  public restrictTo =
    (...roles: Role[]) =>
    (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.body.user.role)) {
        return res
          .status(403)
          .json({ error: "You do not have permission to perform this action" });
      }

      return next();
    };

  public forgotPassword = async (
    req: Request,
    res: Response,
  ): Promise<Response | void> => {
    const { email } = req.body;

    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { email },
      });
      if (!user) {
        return res
          .status(404)
          .json({ error: "There's no user with this email address." });
      }

      const code = generateCode();
      const resetToken = new PasswordResetToken();
      resetToken.userId = user.id;
      resetToken.token = +code;
      resetToken.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

      await AppDataSource.getRepository(PasswordResetToken).save(resetToken);

      await new Email(user, code).sendPasswordReset();

      res
        .status(200)
        .json({ status: "success", message: "Reset code sent to email!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  public getCode = async (
    req: Request,
    res: Response,
  ): Promise<Response | void> => {
    const { email, code } = req.body;

    try {
      const userI = await AppDataSource.getRepository(User).findOne({
        where: { email },
      });
      if (!userI) {
        return res.status(404).json({ error: "User not found." });
      }

      const resetToken = await AppDataSource.getRepository(
        PasswordResetToken,
      ).findOne({ where: { userId: userI.id, token: code } });
      if (!resetToken) {
        return res.status(400).json({ error: "Invalid reset code." });
      }

      if (resetToken.expiresAt < new Date()) {
        return res.status(400).json({ error: "Reset code has expired." });
      }

      res.status(200).json({ status: "success", message: "Code is valid!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
  ): Promise<Response | void> => {
    const { email, code, newPassword, newPasswordConfirm } = req.body;

    try {
      if (newPassword !== newPasswordConfirm)
        return res.status(400).json({ error: "Passwords don`t match" });

      const user = await AppDataSource.getRepository(User).findOne({
        where: { email },
      });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const resetToken = await AppDataSource.getRepository(
        PasswordResetToken,
      ).findOne({ where: { userId: user.id, token: code } });
      if (!resetToken) {
        return res.status(400).json({ error: "Invalid reset code." });
      }

      if (resetToken.expiresAt < new Date()) {
        return res.status(400).json({ error: "Reset code has expired." });
      }

      user.password = newPassword;
      await user.hashPassword();
      await AppDataSource.getRepository(User).save(user);
      await AppDataSource.getRepository(PasswordResetToken).remove(resetToken);

      res
        .status(200)
        .json({ status: "success", message: "Password reset successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export const authController = new AuthController();
