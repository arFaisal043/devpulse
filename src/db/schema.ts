import { pool } from "../config";

const createTable = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(50) UNIQUE NOT NULL,
            role VARCHAR(50) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
    console.log("Users Table crated...");

    await pool.query(`
        CREATE TABLE IF NOT EXISTS issues(
            id SERIAL PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            type VARCHAR(50) NOT NULL CHECK (type IN ('bug', 'feature_request')),
            status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
            reporter_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
    console.log("Issues Table crated...");
  } catch (error) {
    console.error("Error in initializing database schema:", error);
  }
};


export default createTable;