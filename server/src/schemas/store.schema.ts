import z from "zod";

export const createStoreSchema = z.object({
  zone_id: z.string().uuid({ message: "Invalid zone ID!" }),
  name: z.string().min(3, "Name must be at least 3 characters long!"),
  owner_name: z
    .string()
    .min(3, "Owner name must be at least 3 characters long!"),

  gst_number: z
    .string()
    .length(15, "GST number must be 15 characters long!")
    .regex(
      /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
      "Invalid GST number!"
    ),
  address: z.string().min(10, "Address must be at least 10 characters long!"),
  lattitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});
