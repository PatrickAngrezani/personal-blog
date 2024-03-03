// @ts-ignore
import express, { Application } from "express";
import cors from "cors";
import { connectToDatabase } from "./db/db.js";

const startServer = async () => {
  await connectToDatabase();

  const app: Application = express();
  const PORT: number = 8000;
  app.use(cors());
  app.use(express.json());

  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  return server;
};

startServer();
