import type { Request, Response } from "express";
import app from "./app";
import config, { connectDB } from "./config";
import createTable from "./db/schema";


const startServer = async () => {
    try {
        connectDB();
        createTable();
        
        app.listen(config.port, () => {
          console.log(`Server is running on http://localhost:${config.port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer(); // config.port