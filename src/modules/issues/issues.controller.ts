import { catchAsync } from "../../utils/catchAsync";
import { issueService } from "./issues.service";
import { sendSuccess } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";

const createIssue = catchAsync(async (req: Request, res: Response) => {
  const reporterId = req.user!.id; // Automatically gets the ID of the logged-in user!
  const result = await issueService.createIssue(req.body, reporterId);
  sendSuccess(res, StatusCodes.CREATED, "Issue created successfully", result);
});

const getAllIssues = catchAsync(async (req: Request, res: Response) => {
  const result = await issueService.getAllIssues(req.query);
  sendSuccess(res, StatusCodes.OK, "Issues retrieved successfully!", result);
})

export const issuesController = {
  createIssue,
  getAllIssues,
};
