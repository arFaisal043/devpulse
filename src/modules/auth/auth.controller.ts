import type { Request, Response } from "express";
import { authservice } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../../utils/response";
import { catchAsync } from "../../utils/catchAsync";

// sign up
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authservice.registerUserService(req.body);
  sendSuccess(res, StatusCodes.CREATED, "User registered successfully!", result);
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authservice.loginUserService(req.body);
  sendSuccess(res, StatusCodes.OK, "Login successful!", result);
})


export const authController = {
  registerUser,
  loginUser
}