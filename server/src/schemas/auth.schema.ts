import z from "zod";

export const generateOTPSchema = z.object({
  phone: z
    .string()
    .length(10, "Invalid phone number!")
    .regex(/^[6-9]\d{9}$/, "Invalid phone number!"),
});

export const otpFormSchema = z.object({
  OTP: z
    .string()
    .length(6, "Invalid OTP!")
    .regex(/^\d{6}$/, "Invalid OTP!"),
  phone: z
    .string()
    .length(10, "Invalid phone number!")
    .regex(/^[6-9]\d{9}$/, "Invalid phone number!"),
  session_id: z.string().uuid({ message: "Invalid session ID!" }),
});
