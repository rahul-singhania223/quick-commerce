import { z } from "zod";

export const createAddressSchema = z.object({
  label: z.enum(["HOME", "WORK", "OTHER"]).default("HOME"),

  name: z.string().min(2, "Name must be at least 2 characters").max(100),

  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

  addressLine1: z.string().min(5, "Address line 1 is too short").max(200),

  addressLine2: z.string().max(200).optional().nullable().default(null),

  landmark: z.string().max(200).optional().nullable().default(null),

  city: z.string().min(2).max(100),

  state: z.string().min(2).max(100),

  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),

  latitude: z.number().min(-90).max(90),

  longitude: z.number().min(-180).max(180),

  isDefault: z.boolean().optional().default(false),
});

export type CreateAddressSchema = z.infer<typeof createAddressSchema>;
