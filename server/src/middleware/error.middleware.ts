import { ApiError } from "../utils/api-error.js";

const apiErrorHandler = async (error: any, req: any, res: any, next: any) => {
  let statusCode = 500;
  let errorCode = "INTERNAL_SERVER_ERROR";
  let message = "Internal server error!";

  console.log(error)

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    errorCode = error.errorCode;
    message = error.message;
  }

  return res.status(statusCode).json({
    status: "FAILED",
    errorCode,
    message,
    errorDetails: error.errorDetails || null,
  });
};

export default apiErrorHandler;
