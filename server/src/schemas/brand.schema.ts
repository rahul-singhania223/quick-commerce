import { z } from "zod";

// brand form schema
export const brandFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long!"),
  logo: z
    .string()
    .url({ message: "Invalid logo URL!" })
    .optional()
    .nullable()
    .default(null),
  description: z
    .string()
    .max(100, { message: "Description is too long!" })
    .optional()
    .nullable()
    .default(null),
  is_active: z.boolean().default(true),
});
