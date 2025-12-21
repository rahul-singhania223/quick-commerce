import { Router } from "express";
import { getOTP, getOTPStatus, verifyOTP } from "../controllers/user.controller.ts";
import { validateForm } from "../middleware/validate.middleware.ts";
import { generateOTPSchema, otpFormSchema } from "../schemas/auth.schema.ts";

const router = Router();

// GET OTP
router.post("/get-otp", validateForm(generateOTPSchema), getOTP);

// VERIFY OTP + AUTHENTICATION
router.post("/verify-otp", validateForm(otpFormSchema), verifyOTP);

// GET OTP STATUS
router.get("/otp-status", getOTPStatus);


export default router;
