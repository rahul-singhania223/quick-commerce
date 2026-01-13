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
    .length(4, "Invalid OTP!")
    .regex(/^\d{4}$/, "Invalid OTP!"),
  phone: z
    .string()
    .length(10, "Invalid phone number!")
    .regex(/^[6-9]\d{9}$/, "Invalid phone number!"),
  session_id: z.string().uuid({ message: "Invalid session ID!" }),
});
