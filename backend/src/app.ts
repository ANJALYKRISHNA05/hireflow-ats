import express from "express";
import { connectDB } from "./config/database";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

connectDB()
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Backend is working perfectly!");
});


export default app;
