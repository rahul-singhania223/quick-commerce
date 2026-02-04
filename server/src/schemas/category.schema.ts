import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name is too short")
    .max(64, "Category name is too long"),

  parent_id: z
    .string()
    .uuid("Invalid parent category ID")
    .optional()
    .nullable()
    .default(null),

  is_active: z.boolean().optional().default(true),
});
