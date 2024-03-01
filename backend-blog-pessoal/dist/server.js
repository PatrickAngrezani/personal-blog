var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import cors from "cors";
import pkg from "pg";
const PORT = 8000;
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
app.get("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db.connect();
        console.log('endponit requested');
        // Other asynchronous code here
        res.send("Success");
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
    finally {
        yield db.end();
    }
}));
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
export default server;
