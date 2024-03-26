import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
};

export const connectToDatabase = async (): Promise<void> => {
  const db = new Client(dbConfig);
  try {
    await db.connect();
    console.log("Connected to database succesfully");
  } catch (error) {
    console.error("Error connecting to database");
    throw error;
  } finally {
    await db.end();
  }
};

export const disconnectToDatabase = async (): Promise<void> => {
  const db = new Client(dbConfig);
  try {
    await db.end();
    console.log("Disconnected to database succesfully");
  } catch (error) {
    console.error("Error disconnecting to database");
    throw error;
  }
};
