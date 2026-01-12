import z from "zod";

export const createStoreFormSchema = z.object({
  zone_id: z.uuid({ message: "Invalid zone ID!" }),
  name: z.string().min(3, "Name must be at least 3 characters long!"),
  logo: z.url({ message: "Invalid logo URL!" }),
  owner_name: z.string().min(3, "Name must be at least 3 characters long!"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid phone number!"),
  address: z.string().min(3, "Address must be at least 10 characters long!"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  gst: z
    .string()
    .length(15, "GST number must be 15 characters long!")
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
      "Invalid GST number!"
    ),
  fssai: z
    .string()
    .regex(/^[0-9]{14}$/, "Invalid FSSAI number!")
    .optional(),
  adhaar: z
    .string()
    .length(12, "Adhaar number must be 12 characters long!")
    .regex(/^[2-9]{1}[0-9]{11}$/, {
      message: "Invalid Adhaar number!",
    }),
  pan: z
    .string()
    .length(10, "PAN number must be 10 characters long!")
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN number!"),
  inside_photo: z.url({ message: "Invalid photo URL!" }),
  front_photo: z.url({ message: "Invalid photo URL!" }),
});

export const STORE_FORM_STEPS = [
  "BASIC",
  "OWNER",
  "LOCATION",
  "LEGAL",
  "REVIEW",
] as const;

export type StoreFormStep = (typeof STORE_FORM_STEPS)[number];

export type StoreFormData = {
  zone_id?: string;
  name?: string;
  logo?: string;
  owner_name?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  gst?: string;
  fssai?: string;
  adhaar?: string;
  pan?: string;
  inside_photo?: string;
  front_photo?: string;
};
