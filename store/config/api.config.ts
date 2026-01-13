import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_PRODUCTION_SERVER_URL ||
    "http://localhost:5000" + "/api/v1",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
