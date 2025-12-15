export class ApiError extends Error {
  statusCode: number;
  errorCode: string;
  errorDetails: any;

  constructor(
    statusCode: number,
    errorCode: string,
    message: string,
    errorDetails?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errorDetails = errorDetails;
    Error.captureStackTrace(this);
  }
}
