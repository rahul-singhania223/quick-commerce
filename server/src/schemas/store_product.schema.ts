import { z } from "zod";

export const createStoreProductSchema = z.object({
  storeProduct: z.object({
    variant_id: z.string().uuid({
      message: "Variant is required",
    }),

    selling_price: z
      .number({
        message: "Selling price is required",
      })
      .positive("Selling price must be greater than 0")
      .max(100000, "Selling price is too high"),

    discount_percent: z
      .number({
        message: "Discount is required",
      })
      .min(0, "Discount cannot be negative")
      .max(50, "Discount cannot exceed 50%")
      .optional()
      .default(0),

    is_listed: z.boolean().optional().default(true),
  }),
  inventory: z.object({
    stock_quantity: z
      .number({
        message: "Initial stock is required",
      })
      .int("Stock must be an integer")
      .min(1, "Stock must be more than 0"),

    low_stock_alert: z
      .number({})
      .int("Low stock alert must be an integer")
      .min(0, "Low stock alert cannot be negative")
      .optional()
      .default(5),
  }),
});
