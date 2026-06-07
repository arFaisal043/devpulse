import { Router, type Request, type Response } from "express";
import { issuesController } from "./issues.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, issuesController.createIssue);
router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getIssuesById);


export const IssuesRoute = router;