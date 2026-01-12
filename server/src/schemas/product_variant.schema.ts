import { z } from "zod";

export const createProductVariantSchema = z.object({
  product_id: z.string().uuid("Invalid product ID"),

  name: z
    .string()
    .trim()
    .min(1, "Variant name required")
    .max(50, "Variant name too long"),
  // e.g. "500ml", "1kg", "Pack of 6"

  sku: z
    .string()
    .trim()
    .min(3)
    .max(64)
    .regex(/^[A-Z0-9-_]+$/, "SKU must be uppercase alphanumeric with - or _"),

  mrp: z
    .number()
    .positive("MRP must be greater than 0")
    .max(100000, "MRP too large"),

  weight: z.number().positive().optional().nullable().default(null),

  unit: z
    .enum(["g", "kg", "ml", "l", "pcs"])
    .optional()
    .nullable()
    .default(null),

  image: z
    .string()
    .url("Invalid image URL")
    .optional()
    .nullable()
    .default(null),

  is_active: z.boolean().optional().default(true),
});
