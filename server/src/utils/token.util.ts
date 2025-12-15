import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();




export const generateAccessToken = (data: any) => {
  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
  return accessToken;
};

export const generateRefreshToken = (data: any) => {
  const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
  return refreshToken;
};