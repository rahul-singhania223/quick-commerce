import { z } from "zod";

export const authFormSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters." })
    .regex(/^[6-9]\d{9}$/, "Invalid phone number!"),
});
