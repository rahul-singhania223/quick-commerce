import z from "zod";

export const authFormSchema = z.object({
  phone: z
    .string()
    .length(10, "Enter a valid phone number!")
    .regex(/^[6-9]\d{9}$/, "Enter a valid phone number!"),
});