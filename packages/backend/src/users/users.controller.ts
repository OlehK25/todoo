import { Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { User } from "./users.entity";

const filterObj = <T>(
  obj: Record<string, T>,
  ...allowedFields: string[]
): Record<string, T> => {
  const newObj: Record<string, T> = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

class UsersController {
  constructor() {}

  public async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await AppDataSource.getRepository(User).find();
      const usersJSON = users.map((user) => user.toJSON());
      return res.status(200).json(usersJSON);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async getUser(req: Request, res: Response): Promise<Response> {
    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: req.params.id },
      });
      const userJSON = user?.toJSON();
      return res.status(200).json(userJSON);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public getMe(req: Request, res: Response) {
    return res.status(200).json({ user: req.body.user });
  }

  public deleteMe = async (req: Request, res: Response): Promise<Response> => {
    try {
      await AppDataSource.getRepository(User).delete(req.body.user.id);
      return res.status(204).json({ status: "success" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  public updateMe = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (
        req.body.name &&
        !req.body.password &&
        !req.body.passwordConfirm &&
        !req.body.currentPassword
      ) {
        const filteredBody = filterObj(req.body, "name");

        await AppDataSource.getRepository(User).update(
          req.body.user?.id,
          filteredBody,
        );

        return res.status(200).json({ status: "success" });
      } else {
        if (!req.body.currentPassword) {
          return res.status(401).json({
            error: "Please provide your current password.",
          });
        }

        const user = await AppDataSource.getRepository(User).findOne({
          where: { id: req.body.user?.id },
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await User.comparePasswords(
          req.body.currentPassword,
          user.password,
        );
        if (!isMatch) {
          return res
            .status(403)
            .json({ error: "Your current password is incorrect" });
        }

        if (req.body.password !== req.body.passwordConfirm) {
          return res.status(402).json({ error: "Passwords don`t match" });
        }
        user.password = req.body.password;
        await user.hashPassword();
        await AppDataSource.getRepository(User).save(user);

        return res.status(200).json({ status: "success" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  public async getUserWithTasks(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: req.body.user?.id },
        relations: ["tasks"],
      });
      const userJSON = user?.toJSON();
      return res.status(200).json({ userJSON });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export const userController = new UsersController();
