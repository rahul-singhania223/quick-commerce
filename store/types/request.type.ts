export type ErrorResponse = {
  errorCode: number;
  messageDetails: any;
  message: string;
  status: string;
};

export type SuccessResponse = {
  message: string;
  status: string;
  data: any;
};
