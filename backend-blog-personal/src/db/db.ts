import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config({ override: true });

let dbConfig: any;

dbConfig = {
  user: process.env.DB_USER ? process.env.DB_USER : process.env.DB_USER_TEST,
  host: process.env.DB_HOST ? process.env.DB_HOST : process.env.DB_HOST_TEST,
  database: process.env.DB_DATABASE
    ? process.env.DB_DATABASE
    : process.env.DB_DATABASE_TEST,
  password: String(
    process.env.DB_PASSWORD
      ? process.env.DB_PASSWORD
      : process.env.DB_PASSWORD_TEST
  ),
  port: Number(
    process.env.DB_PORT ? process.env.DB_PORT : process.env.DB_PORT_TEST
  ),
};

export const connectToDatabase = async (): Promise<void> => {
  const db = new Client(dbConfig);
  try {
    await db.connect();
    console.log("Connected to database succesfully: ", dbConfig);
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
