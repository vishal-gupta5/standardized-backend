import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import authRoute from "./modules/auth/auth.routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ urlencoded: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);

export default app;
