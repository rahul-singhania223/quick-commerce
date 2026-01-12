import { Router } from "express";
import { getAuthUser, getOTP, getOTPStatus, logout, verifyOTP } from "../controllers/user.controller.ts";
import { validateForm } from "../middleware/validate.middleware.ts";
import { generateOTPSchema, otpFormSchema } from "../schemas/auth.schema.ts";
import { authorizeUser } from "../middleware/auth.middleware.ts";

const router = Router();

// GET USER
router.get("/", authorizeUser, getAuthUser);

// GET OTP
router.post("/get-otp", validateForm(generateOTPSchema), getOTP);

// VERIFY OTP + AUTHENTICATION
router.post("/verify-otp", validateForm(otpFormSchema), verifyOTP);

// GET OTP STATUS
router.get("/otp-status", getOTPStatus);

// LOG OUT
router.get("/logout", authorizeUser, logout);


export default router;
