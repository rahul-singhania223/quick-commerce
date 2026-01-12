import api from "@/config/api.config";
import { authFormSchema } from "@/schema/auth.schema";
import { AxiosError } from "axios";
import { NextRequest } from "next/server";
import z, { nullable } from "zod";
import { jwtVerify } from "jose";
import { ErrorResponse } from "@/types/types";

export const getOTP = async (data: z.infer<typeof authFormSchema>) => {
  try {
    const res = await api.post("/user/get-otp", data);
    return res;
  } catch (error) {
    console.log(error);
    const errorResponse = (error as AxiosError).response?.data as ErrorResponse;

    throw errorResponse;
  }
};

export const verifyOTP = async (data: { OTP: string; phone: string, session_id: string }) => {
  try {
    const res = await api.post("/user/verify-otp", {
      OTP: data.OTP,
      phone: data.phone,
      session_id: data.session_id
    });
    return res;
  } catch (error) {
    console.log(error);
    const errorResponse = (error as AxiosError).response?.data as ErrorResponse;

    throw errorResponse;
  }
};

// GET OTP META DATA
export const getOTPMetaData = async (data: {
  session_id: string;
  phone: string;
}) => {
  try {
    const res = await api.get(`/user/otp-status?session_id=${data.session_id}&phone=${data.phone}`);
    return res;
  } catch (error) {
    console.log(error);
    const errorResponse = (error as AxiosError).response?.data as ErrorResponse;
    
    throw errorResponse;
  }
};

// CHECK AUTH
export const checkAuth = async (req: NextRequest) => {
  const refresh_token = req.cookies.get("refresh_token")?.value || "";

  if (!refresh_token) return null;
  if (refresh_token.split(".").length !== 3) return null;

  try {
    const key = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!);
    const isValidToken = await jwtVerify(refresh_token, key);

    if (!isValidToken) return null;

    const userId = isValidToken.payload.userId;

    return { user_id: userId, authenticated: true };
  } catch (error) {
    console.log(error);
    return null;
  }
};

// LOG OUT
export const logout = async () => {
  try {
    const res = await api.get("/user/logout");
    return res;
  } catch (error) {
    console.log(error);
    const errorResponse = (error as AxiosError).response?.data as ErrorResponse;
    
    throw errorResponse;
  }
};

// GET USER
export const getUser = async () => {
  try {
    const res = await api.get("/user");
    return res;
  } catch (error) {
    console.log(error);
    const errorResponse = (error as AxiosError).response?.data as ErrorResponse;
    
    throw errorResponse;
  }
};