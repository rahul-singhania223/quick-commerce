import axios from "axios";
import {
  getAccessTokenCached,
  getRefreshTokenCached,
} from "./utils/token.utils";

export const api = axios.create({
  baseURL: "http://192.168.31.105:5000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessTokenCached();
    const refreshToken = await getRefreshTokenCached();

    if (accessToken) {
      config.headers.Authorization = `Bearer accessToken:${accessToken} refreshToken:${refreshToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
