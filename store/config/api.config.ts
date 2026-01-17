import axios from "axios";

// let serverUrl =
//   process.env.NEXT_PUBLIC_PRODUCTION_SERVER_URL || "http://192.168.1:5000";

const  API_BASE_URL = "http://192.168.31.105:5000";


const api = axios.create({
  baseURL: API_BASE_URL + "/api/v1",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
