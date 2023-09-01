import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { plainToInstance } from "class-transformer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { AppDataSource } from "../data-source";
import { User } from "./users.entity";

dotenv.config({ path: "../../.env" });

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

class UsersController {
  constructor() {
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.createSendToken = this.createSendToken.bind(this);
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

  public async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await AppDataSource.getRepository(User).find();
      const usersJSON = users.map((user) => user.toJSON());
      return res.json(usersJSON).status(200);
    } catch (error) {
      console.error(error);
      return res.json({ error: "Internal Server Error" }).status(500);
    }
  }

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
        return res
          .json({
            error:
              "Invalid Credentials. While there isn`t user with the specified email address",
          })
          .status(400);
      }

      const isMatch = await User.comparePasswords(password, user.password);
      if (!isMatch) {
        return res
          .json({ error: "Invalid Credentials (wrong password)" })
          .status(400);
      }

      await this.createSendToken(user, 200, req, res);
    } catch (error) {
      console.error(error);
      return res.json({ error: "Internal Server Error" }).status(500);
    }
  };

  public signup = async (
    req: Request,
    res: Response,
  ): Promise<Response | void> => {
    const { email, password, passwordConfirm, name } = req.body;

    if (!email || !password || !name || !passwordConfirm) {
      return res.json({ error: "All fields are required!" }).status(400);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ error: errors.array() }).status(400);
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
          .json({ error: "User already exists with this email address" })
          .status(400);
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
      return res.json({ error: "Internal Server Error" }).status(500);
    }
  };
}

export const userController = new UsersController();
