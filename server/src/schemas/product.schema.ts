import { z } from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name too short")
    .max(120, "Product name too long"),

  description: z.string().max(1000).optional().nullable().default(null),

  category_id: z.string().uuid("Invalid category ID"),
  image: z.string().url("Image must be a valid URL"),

  brand_id: z
    .string()
    .uuid("Invalid brand ID")
    .optional()
    .nullable()
    .default(null),

  is_active: z.boolean().optional().default(true),
});
