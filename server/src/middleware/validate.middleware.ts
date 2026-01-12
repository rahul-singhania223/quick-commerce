import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/api-error.js";

export const validateForm =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction): any => {
    const data = req.body;

    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return res.status(400).json({
        status: "FAILED",
        message: "Validation failed",
        errors,
      });
    }

    req.body = result.data;

    next();
  };
