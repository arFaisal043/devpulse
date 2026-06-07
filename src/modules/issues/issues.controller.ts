import { catchAsync } from "../../utils/catchAsync";
import { issueService } from "./issues.service";
import { sendSuccess } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";

const createIssue = catchAsync(async (req: Request, res: Response) => {
  //By ! means: "I guarantee that req.user is defined here."
  const reporterId = req.user!.id; // Automatically gets the ID of the logged-in user!
  const result = await issueService.createIssue(req.body, reporterId);
  sendSuccess(res, StatusCodes.CREATED, "Issue created successfully", result);
});

export const issuesController = {
  createIssue,
};
