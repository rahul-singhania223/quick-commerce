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

  // level: z.number().int().min(0).max(5), // hard cap to prevent insane nesting

  image: z
    .string()
    .url("Invalid image URL")
    .optional()
    .nullable()
    .default(null),

  description: z.string().max(255).optional().nullable().default(null),

  sort_order: z.number().int().min(0).optional().default(0),

  is_active: z.boolean().optional().default(true),
});
