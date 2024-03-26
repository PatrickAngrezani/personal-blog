import express, { Application } from "express";
import cors from "cors";
import { connectToDatabase } from "./db/db";
import userRouter from "./routes/usersRoute";

const PORT: number = 8000;

const app: Application = express();
app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await connectToDatabase();
    app.use("/users", userRouter);

    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    return server;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

startServer();

export default app;
