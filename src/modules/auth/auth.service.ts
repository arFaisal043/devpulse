import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../utils/customError";
import config, { pool } from "../../config";
import bcrypt from "bcryptjs";
import type { LoginInterface, SignupInterface } from "./auth.interface";
import jwt from "jsonwebtoken";

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
    RETURNING *
    `,
    [name, email, hashPass, userRole],
  );
  delete result.rows[0].password; // show all columns except password

  return result.rows[0];
};

const loginUserService = async (credentials: LoginInterface) => {
  const { email, password } = credentials;

  // _______ Verify User ________________________

  // check 1: User give email and password or not?
  if (!email || !password) {
    throw new CustomError(
      "Email and password are required",
      StatusCodes.BAD_REQUEST,
    );
  }

  // check 2: If user are registered or not?  -> fetch from DB
  const result = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
  `,
    [email],
  );

  const user = result.rows[0];
  //console.log(user) // user details

  if (!user) {
    throw new CustomError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  // check 3: Compare password
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new CustomError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }
  //console.log("Password is matched ...");

  // _______ JWT Token Generate ________________________

  const payload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, config.secret as string, {
    expiresIn: config.expiresIn as any,
  });

  const refreshToken = jwt.sign(payload, config.refreshSecret as string, {
    expiresIn: config.refreshExpiresIn as any,
  });

  delete user.password; // Remove password from response

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};

export const authservice = {
  registerUserService,
  loginUserService,
};
