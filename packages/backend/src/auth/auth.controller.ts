import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { plainToInstance } from "class-transformer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { AppDataSource } from "../data-source";
import { User } from "../users/users.entity";
import { Role } from "../enums/Role";

dotenv.config({ path: "../../.env" });

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

class AuthController {
  constructor() {
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.createSendToken = this.createSendToken.bind(this);
    this.restrictTo(...Object.values(Role));
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
}

export const authController = new AuthController();
