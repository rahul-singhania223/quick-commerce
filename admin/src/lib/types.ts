export type UUID = string;
export type ISODateString = string;
export type DecimalString = string;

export interface ProductStats {
  products_count: number;
}
export interface CategoryStats {
  categories_count: number;
}

export interface BrandStats {
  brands_count: number;
}

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
  products_count: number;
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
  level: number;
  is_active: boolean;
  products_count: number;
  brands_count: number;
  parent: { id: UUID; name: string };
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export interface CategoryWithRelations extends Category {
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
  variants_count: number;
  store_products_count: number;
}

export interface ProductWithRelations extends Product {
  category?: Category;
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

export type LngLat = [number, number];

export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: LngLat[][];
}

export type ZoneTimeBucket = "ALL_DAY" | "PEAK" | "OFF_PEAK";

export interface ZoneStat {
  bucket: ZoneTimeBucket;
  avgTime: number; // minutes
  p90Time: number; // minutes
  sampleSize: number;
  lastComputedAt: string; // ISO string
}

export interface Zone {
  id: string;
  name: string;
  city: string;

  boundary: GeoJSONPolygon;

  is_active: boolean;

  stats: ZoneStat[];

  createdAt: string;
  updatedAt: string;

  _count?: {
    stores?: number;
  };
}

export interface ZoneWithRelations extends Zone {
  stores?: Store[];
}

export interface CreateZoneInput {
  name: string;
  city: string;
  boundary: GeoJSONPolygon;
  is_active?: boolean;
}

export interface ZoneETA {
  zoneId: string;
  zoneName: string;
  city: string;

  etaMinutes: number;
  etaRange?: {
    min: number;
    max: number;
  };
}

// export interface Product {
//   id: UUID;
// }

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
