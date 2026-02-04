import express, { NextFunction, type Request, type Response } from "express";
import {
  addressRouter,
  brandRouter,
  categoryRouter,
  inventoryRouter,
  productRouter,
  productVariantRouter,
  storeProductRouter,
  storeRouter,
  userRouter,
  zoneRouter,
} from "./routers/index.js";
import { ApiError } from "./utils/api-error.js";
import apiErrorHandler from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

config();

const app = express();

import cors, { CorsRequest } from "cors";
import path from "path";

const allowedOrigins = process.env.ALLOWED_ORIGINS!.split(" ");

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());


app.use(
  "/favicon.ico",
  express.static(path.join(process.cwd(), "public/favicon.ico"))
);

// TODO: delete this
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/store", storeRouter);
app.use("/api/v1/zone", zoneRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/product-variant", productVariantRouter);
app.use("/api/v1/store-product", storeProductRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/address", addressRouter);

// catch unkown routes
app.use((req: Request, res: Response, next: NextFunction) => {
  return next(
    new ApiError(400, "UNKNOWN_ROUTE", `Route ${req.originalUrl} not found!`)
  );
});

app.use(apiErrorHandler);

export default app;
