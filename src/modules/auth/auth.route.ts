import { Router, type Request, type Response } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup", authController.registerUser);
router.post("/login", authController.loginUser);

export const userRoute = router;