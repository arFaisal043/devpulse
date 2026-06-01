import type { Response } from "express";

// ________ Using generics type

type TResponse <T> = {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
    error?: any;
}

export const sendSuccessResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};

export const sendErrorResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    error: data.error,
  });
};

