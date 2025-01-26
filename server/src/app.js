import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config({
    path: "./.env"
});
const app = express();

//Configuration 
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  }));

import userRouter from "./routes/user.route.js";
app.use("/api/user", userRouter);

import QrRouter from "./routes/Qr.routes.js";
app.use("/api/qr", QrRouter);

import adminRouter from "./routes/admin.route.js";
app.use("/api/admin", adminRouter);

export { app }