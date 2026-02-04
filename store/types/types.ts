export type ErrorResponse = {
  errorCode: number;
  messageDetails: any;
  message: string;
  status: string;
};

export type SuccessResponse = {
  message: string;
  status: string;
  data: any;
};

export type OtpMeta = {
  phone: string;
  session_id: string;
  resend_at: number;
  attempts_left: number;
  created_at: number;
};

export type User = {
  id: string;
  phone: string;
  email: string | null;
  role: Role;
  status: string;
  created_at: Date;
  updated_at: Date;
  Stores?: Store[];
};

export type Store = {
  id: string;
  user_id: string;
  logo: string;
  name: string;
  owner_name: string;
  phone: string;
  zone_id: string;
  address: string;
  latitude: number;
  longitude: number;
  gst: string;
  pan: string;
  adhaar: string;
  fssai?: string;
  inside_photo: string;
  front_photo: string;
  verified: boolean;
  status: Store_Status;
  created_at: Date;
  updated_at: Date;
  User?: User;
  Zone?: Zone;
};

export type ProductSearchResult = {
  id: string;
  name: string;
  image?: string;
  brand?: { name: string };
  category?: { name: string };
  variants: {
    id: string;
    name: string;
    mrp: string;
  }[];
};

export type Zone = {
  id: string;
  name: string;
  boundary: string;
  created_at: Date;
  updated_at: Date;
  Stores?: Store[];
};

export type Brand = {
  id: string;
  name: string;
  logo: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  Products?: Product[];
};

export type Category = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  level: number;
  created_at: Date;
  updated_at: Date;
  Products?: Product[];
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand_id: string;
  category_id: string;
  variants: ProductVariant[];
  created_at: Date;
  updated_at: Date;
  brand?: Brand;
  category?: Category;
};

export type ProductVariant = {
  id: string;
  name: string;
  mrp: string;
  image: string;
  created_at: Date;
  updated_at: Date;
  product?: Product;
};

export type StoreProduct = {
  id: string;
  store_id: string;
  variant_id: string;
  selling_price: number;
  discount_percent: number;
  is_available: boolean;
  is_listed: boolean;
  created_at: Date;
  updated_at: Date;
  variant?: ProductVariant;
  inventory: Inventory;
};

export type Inventory = {
  id: string;
  store_product_id: string;
  stock_quantity: number;
  low_stock_alert: number;
  reserved_quantity: number;
  created_at: Date;
  updated_at: Date;
  store_product: StoreProduct;
};

export enum Role {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  STORE_OWNER = "STORE_OWNER",
  DELIVERY_PARTNER = "DELIVERY_PARTNER",
}

export enum Store_Status {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  BUSY = "BUSY",
}

export enum Today_Stats {
  REVENUE = "REVENUE",
  ORDER = "ORDER",
}
