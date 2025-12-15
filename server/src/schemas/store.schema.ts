import z from "zod";

export const storeFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long!"),
  owner_name: z
    .string()
    .min(3, "Owner name must be at least 3 characters long!"),
  gst_number: z
    .string()
    .length(15, "GST number must be 15 characters long!")
    .regex(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/, "Invalid GST number!"),
  address: z.string().min(10, "Address must be at least 10 characters long!"),
  city: z.string().min(3, "City must be at least 3 characters long!"),
  zip_code: z
    .string()
    .length(6, "Zip code must be 6 characters long!")
    .regex(/^[1-9]{1}\d{2}\s?\d{3}$/, "Invalid zip code!"),
    lattitude: z.string().min(1, "Lattitude value is required!"),
    longitude: z.string().min(1, "Longitude value is required!"),
});
