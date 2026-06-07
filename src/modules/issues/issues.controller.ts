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
  // console.log(req.query.sort)
  const result = await issueService.getAllIssues(req.query);
  sendSuccess(res, StatusCodes.OK, "Issues retrieved successfully!", result);
})

const getIssuesById = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;
  const result = await issueService.getIssuesById(id as string);
  sendSuccess(res, StatusCodes.OK, "Issue retrieved successfully!", result);
});

export const issuesController = {
  createIssue,
  getAllIssues,
  getIssuesById,
};
