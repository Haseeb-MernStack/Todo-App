import express from 'express';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from './db/database.js';
import userRouter from "./routes/user.js";
import todoRouter from "./routes/todo.js";
import cookieParser from 'cookie-parser';
import cors from "cors";
const app = express();
dotenv.config();

// mongodb ko hamesha dotenv ke niche rakhna ha.
connectDB();
// both middlewares must be included otherwise code are not running.
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
})
);

// simple middleware 
app.use("/api/v1/user", userRouter);
app.use("/api/v1/todo", todoRouter);

// http://localhost:8000/api/v1/user/ --> iss ko kehte hain route grouping,iss tarha se apni API ban jy gi.
// http://localhost:8000/api/v1/todo/ --> iss ko kehte hain route grouping,iss tarha se apni API ban jy gi.

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listen at port ${PORT}`);
})