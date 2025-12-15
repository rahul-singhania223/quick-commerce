export class APIResponse {
  status: String;
  data: any;
  message?: string;

  constructor(status: string, message?: string, data?: any) {
    this.message = message;
    this.data = data;
    this.status = status;
  }
}
