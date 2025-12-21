import express, { NextFunction, type Request, type Response } from "express";
import { storeRouter, userRouter, zoneRouter } from "./routers/index.ts";
import { ApiError } from "./utils/api-error.ts";
import apiErrorHandler from "./middleware/error.middleware.ts";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

config();

const app = express();

import cors, { CorsRequest } from "cors";

const allowedOrigins = process.env.ALLOWED_ORIGINS!.split(" ");

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  const userAgent = req.headers["user-agent"];
  res.json(userAgent);
});


app.use("/api/v1/user", userRouter);
app.use("/api/v1/store", storeRouter);
app.use("/api/v1/zone", zoneRouter);

// catch unkown routes
app.use((req: Request, res: Response, next: NextFunction) => {
  return next(
    new ApiError(400, "UNKNOWN_ROUTE", `Route ${req.originalUrl} not found!`)
  );
});

app.use(apiErrorHandler);

export default app;
