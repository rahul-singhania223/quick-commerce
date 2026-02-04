import { z } from "zod";

// brand form schema
export const brandFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long!"),
  logo: z.string().url({ message: "Invalid logo URL!" }),

  is_active: z.boolean().default(true),
});
