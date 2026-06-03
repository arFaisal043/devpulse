import dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

// connect with DB by POOL 
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err, client) => {
  console.error("Unexpected error: ", err);
  process.exit(-1);
});

// DB connect
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("Database connected successfully!");
    client.release();
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

const config = {
  port: process.env.PORT,
  secret: process.env.JWT_SECRET_KEY,
  expiresIn: process.env.JWT_EXPIRES_IN,
  refreshSecret: process.env.JWT_REFRESH_SECRET_KEY,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN
};

export default config;