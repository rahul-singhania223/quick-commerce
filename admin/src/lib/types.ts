export type UUID = string;
export type ISODateString = string;
export type DecimalString = string;

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

export interface Brand {
  id: UUID;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
  _count: {
    products: number;
  };
}

export interface CreateBrandPayload {
  name: string;
  logo?: string | null;
  is_active?: boolean;
}

export interface UpdateBrandPayload {
  name?: string;
  logo?: string | null;
  is_active?: boolean;
}

export interface BrandWithProducts extends Brand {
  products: Product[];
}

export interface Category {
  id: UUID;
  name: string;
  slug: string;
  parent_id?: UUID | null;
  level: 0 | 1 | 2;
  image?: string | null;
  description?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: ISODateString;
  updated_at: ISODateString;
  _count: {
    children: number;
    products: number;
  };
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export interface CategoryWithRelations extends Category {
  parent?: Category | null;
  children?: Category[];
  products?: Product[];
}

export interface CreateCategoryPayload {
  name: string;
  parent_id?: UUID | null;
  is_active?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  parent_id?: UUID | null;
  image?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

export interface Product {
  id: UUID;
  name: string;
  slug: string;
  image: string;
  description?: string | null;
  category_id: UUID;
  brand_id?: UUID | null;
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
  _count: {
    variants?: number;
    storeProducts?: number;
  };
}

export interface ProductWithRelations extends Product {
  category: Category;
  brand?: Brand | null;
}

export interface CreateProductPayload {
  name: string;
  image: string;
  description?: string | null;
  category_id: UUID;
  brand_id?: UUID | null;
  is_active?: boolean;
}

export interface UpdateProductPayload {
  name?: string;
  image?: string | null;
  description?: string | null;
  category_id?: UUID;
  brand_id?: UUID | null;
  is_active?: boolean;
}

export interface ProductVariant {
  id: UUID;
  product_id: UUID;

  name: string;

  weight?: number | null;
  unit?: string | null;

  mrp: number;
  image: string;

  is_active: boolean;

  created_at: Date;
  updated_at: Date;

  // relations
  product?: Product;
  store_products?: StoreProduct[];
}

export type CreateProductVariantInput = Omit<
  ProductVariant,
  "id" | "created_at" | "updated_at" | "store_products" | "product"
>;

export interface StoreProduct {
  id: UUID;

  store_id: UUID;
  variant_id: UUID;

  selling_price: DecimalString;
  discount_percent?: DecimalString | null;

  is_available: boolean;
  is_listed: boolean;

  created_at: Date;
  updated_at: Date;

  // relations
  inventory?: Inventory | null;

  store?: Store;
  variant?: ProductVariant;

  productId?: UUID | null;
  product?: Product | null;
}

export interface Inventory {
  id: UUID;

  store_product_id: UUID;

  stock_quantity: number;
  reserved_quantity: number;

  low_stock_alert: number;

  created_at: Date;
  updated_at: Date;

  // relations
  store_product?: StoreProduct;
}

export interface Address {
  id: string;

  userId: UUID;

  label: AddressLabel;

  name: string;
  phone: string;

  addressLine1: string;
  addressLine2?: string | null;
  landmark?: string | null;

  city: string;
  state: string;
  country: string;
  pincode: string;

  latitude: number;
  longitude: number;

  isDefault: boolean;

  createdAt: Date;
  updatedAt: Date;

  // relations
  user?: User;
}

export interface Product {
  id: UUID;
}

export interface Store {
  id: UUID;
}

export interface User {
  id: UUID;
}

export enum AddressLabel {
  HOME = "HOME",
  WORK = "WORK",
  OTHER = "OTHER",
}

export enum Role {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
  STORE_OWNER = "STORE_OWNER",
  DELIVERY_PARTNER = "DELIVERY_PARTNER",
}

export enum StoreStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  BUSY = "BUSY",
}

export enum Status {
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
}
