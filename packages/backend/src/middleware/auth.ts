import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { AppDataSource } from "../data-source";
import { User } from "../users/users.entity";
import { ExtendedJwtPayload } from "./interfaces/ExtendedJwtPayload";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization?.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(403).json({ error: "Access Denied, Token Missing!" });
    }

    const payload = verify(
      token,
      process.env.JWT_SECRET as string,
    ) as ExtendedJwtPayload;
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: payload.id },
    });

    if (!user) {
      return res.status(403).json({ error: "User not found!" });
    }

    req.body.user = user;
    return next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(403).json({ error: "Invalid Token!" });
      }
      console.log(error.message);
      return res.status(500).json({ error: "Server error!" });
    } else {
      // Handle other unknown error types if necessary
      return res.status(500).json({ error: "Unknown server error!" });
    }
  }
};
