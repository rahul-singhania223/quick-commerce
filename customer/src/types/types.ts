import { ImageSourcePropType } from "react-native";

export type Address = {
  id: string;
  name: string;
  address1: string;
  address2: string;
  flat_number: string;
  floor: string;
  city: string;
  state: string;
  zip: string;
};

export type Image = {
  id: string;
  image: ImageSourcePropType;
};

export type Product = {
  name: string;
  brand: string;
  variant: string;
  price: number;
  category?: string;
  images: Image[];
  mrp: number;
  discount?: number;
};

export type SuccessResponse = {
  message: string;
  status: string;
  data: any;
};
export type ErrorResponse = {
  errorCode: number;
  messageDetails: any;
  message: string;
  status: string;
};

export type OtpMeta = {
  phone: string;
  session_id: string;
  resend_at: number;
  attempts_left: number;
  time_left: number;
  created_at: number;
};

export type User = {
  id: string;
  phone: string;
  email: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
  _count?: any;
  addresses?: Address[];
};
