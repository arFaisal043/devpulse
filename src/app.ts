import express, { type Application, type Request, type Response } from "express";
import { AuthRoutes } from "./modules/auth/auth.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import CookieParser from "cookie-parser";
import { logMiddleware } from "./middleware/logger";
import { IssuesRoute } from "./modules/issues/issues.route";
import cors from "cors";

const app: Application = express();


app.use(express.json());
app.use(express.text());

app.use(CookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5000",
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(logMiddleware);

// _________ Root Route

app.get("/", (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Welcome to DevPulse",
    });
})

// _________  All Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/issues", IssuesRoute);


// _________ Global Error Handler 

app.use(globalErrorHandler);

export default app;