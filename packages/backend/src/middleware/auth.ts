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
      // Set token from Bearer token in header
      token = req.headers.authorization.split(" ")[1];

      // Set token from cookie
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(403).json({ error: "Access Denied, Token Missing!" });
    } else {
      const payload = verify(
        token,
        process.env.JWT_SECRET as string,
      ) as ExtendedJwtPayload;

      req.body.user = await AppDataSource.getRepository(User).findOne({
        where: { id: payload.id },
      });
      return next();
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: "Invalid Token!" });
  }
};
