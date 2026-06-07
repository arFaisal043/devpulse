import { CustomError } from "../utils/customError";
import { StatusCodes } from "http-status-codes";
import config, { pool } from "../config";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

export const authMiddleware = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    // __________ 1. if client's doesn't has token in header
    const token = req.headers.authorization; // --> get auth token
    if (!token) {
      throw new CustomError(
        "Unauthorized: Token missing or invalid",
        StatusCodes.UNAUTHORIZED,
      );
    }

    // __________ 2. verify the token
    const decode = jwt.verify(
      token as string,
      config.secret as string,
    ) as JwtPayload;
    // console.log(decode);

    // __________ 3. find the user into DB or not?
    const userData = await pool.query(
      `
    SELECT * FROM users WHERE email = $1
    `,
      [decode.email],
    );
    const user = userData.rows[0];
    // console.log(user);

    if (userData.rows.length === 0) {
      throw new CustomError("User not found!", StatusCodes.NOT_FOUND);
    }

    // __________ 5. Role based auth (RBAC)

    //console.log("Auth Role: ", user.role) ;
    const userRoleList = ["contributor", "maintainer"];
    if (!userRoleList.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: "This profile is not allowed for access all users",
      });
    }

    req.user = decode; // req: { user: {} }

    next();
  } catch (error) {
    next(error);
  }
};

