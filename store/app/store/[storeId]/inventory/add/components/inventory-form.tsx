"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import api from "@/config/api.config";
import { cn } from "@/lib/utils";
import { productQuery } from "@/quries/product.query";
import { ErrorResponse, Inventory, ProductSearchResult } from "@/types/types";
import {
  Box,
  IndianRupee,
  Loader2,
  Percent,
  Search,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ProductListItem from "./product-list-item";
import VariantListContainer from "./variant";
import z, { set } from "zod";
import { createStoreProductSchema } from "@/schema/product.schema";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface Props {
  data?: Inventory;
}

export default function InventoryForm({ data }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>(
    data ? [data.store_product.variant?.product] : []
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(
    data?.store_product?.variant?.product || null
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    data?.store_product?.variant_id || ""
  );
  const [error, setError] = useState<{
    fields: string[];
    errorObj: {
      [key: string]: string[];
    };
  } | null>(null);

  const [formData, setFormData] = useState<
    z.infer<typeof createStoreProductSchema>
  >({
    storeProduct: {
      variant_id: data?.store_product?.variant_id || "",
      selling_price: Number(data?.store_product?.selling_price) || 0,
      discount_percent: Number(data?.store_product?.discount_percent) || 0,
      is_listed: data?.store_product?.is_listed || true,
    },
    inventory: {
      stock_quantity: data?.stock_quantity || 0,
      low_stock_alert: data?.low_stock_alert || 5,
    },
  });

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const params = useParams();
  const storeId = params.storeId;

  const router = useRouter();

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const updateInventory = async () => {
    if (!data || !storeId) return;
    setError(null);

    console.log(formData);

    const result = createStoreProductSchema.safeParse(formData);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const errorFields = Object.keys(errors);
      setError({ fields: errorFields, errorObj: errors });
      return;
    }

    try {
      setSubmitting(true);

      const res = await productQuery.updateInventory(
        storeId as string,
        data.store_product_id as string,
        data.id as string,
        formData
      );
      toast.success("Inventory updated successfully!");
      router.back();
    } catch (error) {
      console.log(error);
      const errorDetails = (error as AxiosError).response
        ?.data as ErrorResponse;

      const errorMessage = errorDetails.message || "Something went wrong!";

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const createInventory = async () => {
    if (!storeId) return;
    setError(null);

    const result = createStoreProductSchema.safeParse(formData);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const errorFields = Object.keys(errors);
      setError({ fields: errorFields, errorObj: errors });
      return;
    }

    try {
      setSubmitting(true);

      const res = await productQuery.createInventory(
        storeId as string,
        formData
      );
      toast.success("Inventory created successfully!");
      router.back();
    } catch (error) {
      console.log(error);
      const errorDetails = (error as AxiosError).response
        ?.data as ErrorResponse;

      const errorMessage = errorDetails.message || "Something went wrong!";

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Empty query → reset state
    if (!query.trim()) {
      setResults(data ? [data.store_product.variant?.product] : []);
      setLoading(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      // Cancel previous request
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setLoading(true);

        const res = await productQuery.searchProducts(query);

        const data = await res.data.data;
        setResults(data);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }, 300); // ⏱ debounce delay

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  return (
    <div className="flex flex-col lg:flex-row gap-5 justify-between p-0 lg:p-6 mt-5 lg:mt-0 pb-30 lg:pb-0">
      <div className="flex-1 rounded-lg shadow-sm bg-white p-5 space-y-6 h-fit max-h-screen overflow-y-auto">
        <div className="relative">
          <Label className={cn("mb-3 text-base text-foreground", {})}>
            Select Product:
          </Label>
          <div className="flex items-center border rounded-lg h-12 lg:h-11 px-3 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary">
            <Search className="text-muted-foreground size-5 lg:size-4" />
            <input
              value={query}
              onChange={onSearchChange}
              type="text"
              className="h-full flex-1 ml-4 focus:border-none focus:outline-none "
              placeholder="Search product..."
            />
          </div>
          <div
            className={cn(
              "w-full mt-4 h-[35vh] bg-background p-2 rounded-lg overflow-y-auto space-y-4"
            )}
          >
            {loading && (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Loader2 className="animate-spin" />
              </div>
            )}

            {!loading && query.length > 0 && results.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <p>No results found</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <>
                {results.map((result) => (
                  <ProductListItem
                    key={result.id}
                    product={result}
                    selectedProduct={selectedProduct}
                    onClick={() => setSelectedProduct(result)}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        <div className="">
          <Label
            className={cn("mb-3 text-base text-foreground", {
              "text-destructive": error?.fields.includes("variant_id"),
            })}
          >
            Select Variant:
          </Label>
          <div className="w-full h-40 bg-background p-2 rounded-lg">
            {!selectedProduct && (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <p>Select a product first</p>
              </div>
            )}

            {selectedProduct && selectedProduct.variants.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-[13px] text-muted-foreground">
                <p>No variants available</p>
              </div>
            )}

            {selectedProduct && selectedProduct.variants.length > 0 && (
              <VariantListContainer
                variants={selectedProduct.variants}
                selectedVariantId={selectedVariantId}
                onSelect={(id) => {
                  setSelectedVariantId(id);
                  setFormData({
                    ...formData,
                    storeProduct: { ...formData.storeProduct, variant_id: id },
                  });
                }}
              />
            )}
          </div>
          {error?.fields.includes("variant_id") && (
            <p className="text-xs text-destructive mt-1">
              {error?.errorObj?.variant_id[0]}!
            </p>
          )}
        </div>

        <div className="flex justify-between gap-4">
          <div className="flex items-center justify-between p-2 border rounded-lg gap-4">
            <div>
              <Label className="text-base text-foreground mb-1">Listed</Label>
              <p className="text-sm lg:text-xs text-body/70">
                Customers cannot see/order unlisted products.
              </p>
            </div>
            <Switch
              checked={formData.storeProduct.is_listed}
              onCheckedChange={() =>
                setFormData({
                  ...formData,
                  storeProduct: {
                    ...formData.storeProduct,
                    is_listed: !formData.storeProduct.is_listed,
                  },
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="flex-1 rounded-lg shadow-sm bg-white p-5 lg:p-4 space-y-4 h-fit">
        {/* PRICE */}
        <div>
          <Label
            className={cn("mb-2 text-base text-foreground", {
              "text-destructive": error?.fields.includes("selling_price"),
            })}
          >
            Price (Rs.):
          </Label>
          <div className="flex items-center border rounded-lg h-12 px-3 focus-within:ring-1 focus-within:ring-primary max-w-sm">
            <IndianRupee className="text-muted-foreground size-4" />
            <input
              value={formData.storeProduct.selling_price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  storeProduct: {
                    ...formData.storeProduct,
                    selling_price: Number(e.target.value),
                  },
                })
              }
              type="number"
              className="h-full flex-1 ml-4 text-lg  focus:border-none focus:outline-none"
              placeholder="Eg. 200"
            />
          </div>
          {error?.fields.includes("selling_price") && (
            <p className="text-xs text-destructive mt-1">
              {error?.errorObj?.selling_price[0]}!
            </p>
          )}
        </div>

        {/* DISCOUNT */}
        <div>
          <Label
            className={cn("mb-2 text-base text-foreground", {
              "text-destructive": error?.fields.includes("discount_percent"),
            })}
          >
            Discount (%):
          </Label>
          <div className="flex items-center border rounded-lg h-12 px-3 focus-within:border-primary/50 max-w-sm focus-within:ring-1 focus-within:ring-primary">
            <Percent className="text-muted-foreground size-4" />
            <input
              value={formData.storeProduct.discount_percent}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  storeProduct: {
                    ...formData.storeProduct,
                    discount_percent: Number(e.target.value),
                  },
                })
              }
              min={0}
              max={100}
              type="number"
              className="h-full flex-1 ml-4 text-lg focus:border-none focus:outline-none"
              placeholder="Eg. 52"
            />
          </div>
          {error?.fields.includes("discount_percent") && (
            <p className="text-xs text-destructive mt-1">
              {error?.errorObj?.discount_percent[0]}!
            </p>
          )}
        </div>
        {/* STOCK  */}
        <div>
          <Label
            className={cn("mb-2 text-base text-foreground", {
              "text-destructive": error?.fields.includes("stock_quantity"),
            })}
          >
            Stock:
          </Label>
          <div className="flex items-center border rounded-lg h-12 px-3 focus-within:border-primary/50 max-w-sm focus-within:ring-1 focus-within:ring-primary">
            <Box className="text-muted-foreground size-4" />
            <input
              value={formData.inventory.stock_quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  inventory: {
                    ...formData.inventory,
                    stock_quantity: Number(e.target.value),
                  },
                })
              }
              type="number"
              className="h-full flex-1 ml-4 text-lg focus:border-none focus:outline-none"
              placeholder="Eg. 12"
            />
          </div>

          {error?.fields.includes("stock_quantity") && (
            <p className="text-xs text-destructive mt-1">
              {error?.errorObj?.stock_quantity[0]}!
            </p>
          )}
        </div>

        {/* STOCK ALERT */}
        <div>
          <Label
            className={cn("mb-2 text-base text-foreground", {
              "text-destructive": error?.fields.includes("stock_quantity"),
            })}
          >
            Low Stock Alert:
          </Label>
          <div className="flex items-center border rounded-lg h-12 px-3 focus-within:border-primary/50 max-w-sm focus-within:ring-1 focus-within:ring-primary">
            <TriangleAlert className="text-muted-foreground size-4" />
            <input
              value={formData.inventory.low_stock_alert}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  inventory: {
                    ...formData.inventory,
                    low_stock_alert: Number(e.target.value),
                  },
                })
              }
              type="number"
              className="h-full flex-1 ml-4 text-lg focus:border-none focus:outline-none"
              placeholder="Eg. 20"
            />
          </div>

          {error?.fields.includes("stock_quantity") && (
            <p className="text-xs text-destructive mt-1">
              {error?.errorObj?.stock_quantity[0]}!
            </p>
          )}
        </div>

        <Button
          disabled={submitting}
          onClick={data ? updateInventory : createInventory}
          className="h-12 text-base mt-6 cursor-pointer w-full lg:max-w-xs"
        >
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {data ? "Update Inventory" : "Add Inventory"}
        </Button>
      </div>
    </div>
  );
}
