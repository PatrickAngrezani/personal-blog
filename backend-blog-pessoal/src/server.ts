import express from "express";
import cors from "cors";
import pkg from "pg";

const PORT: number = 8000;
const app = express();
app.use(cors());

const { Client } = pkg;

const db = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 5434,
});

app.get("", async (req: any, res: any) => {
  try {
    await db.connect();
    console.log('endponit requested');
    res.send("Success");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    await db.end();
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default server;
