import { Router, type Request, type Response } from "express";
import { issuesController } from "./issues.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, issuesController.createIssue);


export const IssuesRoute = router;