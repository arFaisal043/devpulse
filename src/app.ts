import express, { type Application, type Request, type Response } from "express";

const app: Application = express();


// _________ Root Route

app.get("/", (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Welcome to DevPulse",
    });
})

export default app;