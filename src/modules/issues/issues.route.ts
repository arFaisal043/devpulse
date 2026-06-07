import { Router, type Request, type Response } from "express";
import { issuesController } from "./issues.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, issuesController.createIssue);
router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getIssuesById);
router.patch("/:id", authMiddleware, issuesController.updateIssue);
router.delete("/:id", authMiddleware, issuesController.deleteIssue);


export const IssuesRoute = router;