import express, { type Application, type Request, type Response } from "express";
import { userRoute } from "./modules/auth/auth.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import CookieParser from "cookie-parser";

const app: Application = express();


app.use(express.json());
app.use(express.text());

app.use(CookieParser());

// _________ Root Route

app.get("/", (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Welcome to DevPulse",
    });
})

// All Routes
app.use("/api/auth", userRoute);



// _________ Global Error Handler 

app.use(globalErrorHandler);

export default app;