import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../utils/customError";
import { pool } from "../../config";
import bcrypt from "bcryptjs";
import type { SignupInterface } from "./auth.interface";

const registerUserService = async (userData: SignupInterface) => {
  const { name, email, password, role } = userData;

  // _______ check required fields
  if (!name || !email || !password) {
    throw new CustomError(
      "Name, Email and Password are required",
      StatusCodes.BAD_REQUEST,
    );
  }

  // ______ check role
  const userRole = role === "maintainer" ? "maintainer" : "contributor";

  // _______ email already exists or not?
  const existsEmail = await pool.query(
    `
      SELECT id FROM users WHERE email = $1
    `,
    [email],
  );
  //console.log(existsEmail); // ..., rowCount: 0, ...

  if (existsEmail.rows.length > 0) {
    throw new CustomError("Email already exists", StatusCodes.BAD_REQUEST);
  }

  // _________ Hash password

  // ensure that password is a string before hashing
  if (typeof password !== "string") {
    throw new CustomError("Password must be a string", StatusCodes.BAD_REQUEST);
  }

  const hashPass = await bcrypt.hash(password, 10);
  //console.log(hashPass);

  // insert into users table
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, role)
    VALUES($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, email, hashPass, userRole],
  );

  return result.rows[0];
};;

export const authservice = {
  registerUserService,
};
