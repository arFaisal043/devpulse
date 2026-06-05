import type { Request, Response } from "express";
import { authservice } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../../utils/response";
import { catchAsync } from "../../utils/catchAsync";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authservice.registerUserService(req.body);
  sendSuccess( res, StatusCodes.CREATED, "User registered successfully!", result);
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authservice.loginUserService(req.body);

  //set refresh token in cookies
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
  });
  
  sendSuccess(res, StatusCodes.OK, "Login successful!", result);
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  //const result = await authservice.;
  //sendSuccess(res, StatusCodes.OK, "Token refreshed successfully!", result);
});

export const authController = {
  registerUser,
  loginUser,
  refreshToken,
};
