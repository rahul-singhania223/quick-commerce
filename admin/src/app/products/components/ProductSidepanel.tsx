"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Loader2,
  AlertCircle,
  Folder,
  CornerDownRight,
  Hash,
  ImageIcon,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import z, { set } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import SelectInput from "@/src/components/SelectInput";
import { Brand, Category, ProductWithRelations } from "@/src/lib/types";
import { useCategoryStore } from "@/src/store/category.store";
import { useBrandsStore } from "@/src/store/brands.store";
import ImageUploader from "./ImageUploader";
import { ProductServices } from "@/src/services/products.services";
import { toast } from "sonner";
import { useProductsStore } from "@/src/store/products.store";
import { useDebounce } from "@/src/hooks/useDebounce";

interface ProductSidePanelProps {
  id?: string | null;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Name is too short").max(150, "Name is too long"),

  image: z.url("Image must be a valid URL"),

  category_id: z.uuid("Invalid category"),

  brand_id: z.uuid("Invalid brand").optional().nullable(),

  is_active: z.boolean().optional(),
});

export default function ProductSidePanel({
  id,
  onClose,
}: ProductSidePanelProps) {
  const isEdit = !!id;

  const {
    categories,
    fetchCategories,
    isLoading: isLoadingCategories,
    clearCategories,
  } = useCategoryStore();
  const {
    brands,
    fetchBrands,
    isLoading: isLoadingBrands,
    clearBrands,
  } = useBrandsStore();

  const categoriesOptions = useMemo(
    () => Array.from(categories.values()),
    [categories],
  );

  const brandsOptions = useMemo(() => Array.from(brands.values()), [brands]);

  const { addProduct, getProduct } = useProductsStore();

  const product: ProductWithRelations | undefined = getProduct(id ?? "");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name ?? "",
      image: product?.image ?? "",
      category_id: product?.category?.id ?? "",
      brand_id: product?.brand?.id ?? null,
      is_active: product?.is_active ?? true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [categoryInput, setCategoryInput] = useState(
    product?.category?.name ?? "",
  );
  const [brandInput, setBrandInput] = useState(product?.brand?.name ?? "");

  const debounceCategoryInput = useDebounce(categoryInput, 400);
  const debounceBrandInput = useDebounce(brandInput, 400);

  const [openCategorySelector, setOpenCategorySelector] = useState(false);
  const [openBrandSelector, setOpenBrandSelector] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleBrandInputChange = (value: string) => {
    setBrandInput(value);
    setOpenCategorySelector(false);
    setOpenBrandSelector(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchBrands({ search: value });
    }, 400); // delay in ms
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);

      // update product
      if (isEdit && product) {
        const res = await ProductServices.updateProduct(product.id, data);
        if (res.error) return toast.error(res.error);

        if (res.data) {
          addProduct(res.data);
          toast.success("Product updated successfully!");
          return onClose();
        }
      }

      // create product
      const res = await ProductServices.createProduct(data);
      if (res.error) return toast.error(res.error);

      if (res.data) {
        addProduct(res.data);
        toast.success("Product created successfully!");
        return onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!debounceCategoryInput.trim()) return;
    if (product && product.category?.name === debounceCategoryInput) return;

    fetchCategories({ search: debounceCategoryInput });
  }, [debounceCategoryInput]);

  useEffect(() => {
    if (!debounceBrandInput.trim()) return;
    if (product && product.brand?.name === debounceBrandInput) return;

    fetchBrands({ search: debounceBrandInput });
  }, [debounceBrandInput]);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[420px] border-l border-gray-200 bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex h-[72px] items-center justify-between px-6 border-b border-gray-100 bg-white">
        <h2 className="text-[18px] font-semibold text-gray-900">
          {isEdit ? "Edit Product" : "Create Product"}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X size={20} className="text-gray-400" />
        </Button>
      </div>

      <Form {...form}>
        <form
          onClick={(e) => {
            e.bubbles.valueOf();
            e.stopPropagation();
            setOpenBrandSelector(false);
            setOpenCategorySelector(false);
          }}
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-6 space-y-5 mt-4 overflow-y-auto"
        >
          {/* Product Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name*</FormLabel>
                <FormControl>
                  <Input
                    className="h-10 focus:ring-primary! focus:ring-1!"
                    placeholder="Product name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Category */}
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category*</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      value={categoryInput}
                      onChange={(e) => {
                        field.onChange("");
                        setOpenBrandSelector(false);
                        setOpenCategorySelector(true);
                        setCategoryInput(e.target.value);
                      }}
                      className="h-10 focus:ring-primary! focus:ring-1!"
                      placeholder="Type to search..."
                    />
                    <Selector
                      options={categoriesOptions}
                      onSelect={(category) => {
                        setCategoryInput(category.name);
                        field.onChange(category.id);
                        clearCategories();
                      }}
                      type="category"
                      isLoading={
                        categoryInput.length > 0 && isLoadingCategories
                      }
                      isOpen={openCategorySelector}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Brand */}
          <FormField
            control={form.control}
            name="brand_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand*</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      value={brandInput}
                      onChange={(e) => {
                        field.onChange(null);
                        setOpenBrandSelector(true);
                        setOpenCategorySelector(false);
                        setBrandInput(e.target.value);
                      }}
                      className="h-10 focus:ring-primary! focus:ring-1!"
                      placeholder="Type to search..."
                    />
                    <Selector
                      options={brandsOptions}
                      onSelect={(brand) => {
                        setBrandInput(brand.name);
                        field.onChange(brand.id);
                        clearBrands();
                      }}
                      type="brand"
                      isLoading={brandInput.length > 0 && isLoadingBrands}
                      isOpen={openBrandSelector}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploader
                    value={field.value}
                    onChange={(url) => field.onChange(url)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* status */}
          <FormField
            disabled={isSaving}
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormControl>
                  <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <div className="grid gap-0.5">
                      <span className="text-[14px] font-medium text-gray-900">
                        Active Status
                      </span>
                      <span className="text-[12px] text-gray-500">
                        Enable to show in catelogs
                      </span>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(val) => field.onChange(val)}
                      disabled={isSaving}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-white flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full  h-11 text-[15px] font-semibold rounded-lg shadow-sm"
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="animate-spin mr-2" /> : null}
              Save Product
            </Button>
            <Button
              type="button"
              disabled={isSaving}
              variant="ghost"
              onClick={onClose}
              className="w-full text-gray-500 h-10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface SelectorProps {
  options: Brand[] | Category[];
  onSelect: (option: Brand | Category) => void;
  type: "category" | "brand";
  isLoading: boolean;
  isOpen: boolean;
}

function Selector({
  options,
  onSelect,
  type,
  isLoading,
  isOpen,
}: SelectorProps) {
  if (!isOpen) return null;
  if (isLoading && type === "category") return <CategorySearchSkeleton />;
  if (isLoading && type === "brand") return <BrandSearchSkeleton />;

  if (options.length == 0) return null;

  return (
    <div className="bg-white shadow border rounded-lg p-4 max-h-[400px] overflow-y-auto absolute left-0 right-0 mt-2 space-y-0.5 z-10">
      {type === "category" &&
        options.map((cat) => {
          const category = cat as Category;
          return (
            <button
              type="button"
              key={category.id}
              onClick={() => onSelect(category)}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-primary/5 group transition-colors text-left outline-none focus:bg-blue-50 cursor-pointer rounded-lg"
            >
              <div className="flex items-center gap-3">
                {/* Level Indicator Icon */}
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-white border border-transparent group-hover:border-blue-100 transition-colors">
                  <Folder size={16} className="text-primary/80" />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-gray-900 leading-none">
                      {category.name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        category.level === 1
                          ? "bg-blue-100 text-blue-700"
                          : category.level > 1
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      L{category.level}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-400 group-hover:text-primary font-medium">
                  {category.products_count} products
                </span>
              </div>
            </button>
          );
        })}

      {type === "brand" &&
        options.map((option) => {
          const brand = option as Brand;

          return (
            <button
              key={brand.id}
              onClick={() => onSelect(brand)}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-primary/5 group transition-colors text-left outline-none focus:bg-primary/5"
            >
              <div className="flex items-center gap-3">
                {/* Brand Logo Container */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white group-hover:border-blue-200">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt=""
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <ImageIcon size={18} className="text-gray-300" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-gray-900 leading-none">
                    {brand.name}
                  </span>
                  <code className="text-[11px] text-gray-500 mt-1.5 font-mono bg-gray-50 px-1 rounded border border-gray-100 group-hover:bg-white transition-colors">
                    {brand.slug}
                  </code>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-400 group-hover:text-primary font-medium">
                  {brand.products_count} products
                </span>
              </div>
            </button>
          );
        })}
    </div>
  );
}

function CategorySearchSkeleton() {
  return (
    <div className="max-h-[400px] overflow-hidden py-2 animate-pulse">
      {/* Label Skeleton */}
      <div className="px-3 mb-4">
        <div className="h-3 w-20 bg-gray-100 rounded" />
      </div>

      <div className="space-y-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-full flex items-center justify-between px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              {/* Level Icon Placeholder */}
              <div className="w-8 h-8 rounded-lg bg-gray-100 shrink-0" />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {/* Category Name Placeholder */}
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  {/* Level Badge Placeholder */}
                  <div className="h-4 w-6 bg-gray-100 rounded" />
                </div>
                {/* Path Placeholder */}
                <div className="h-3 w-48 bg-gray-100 rounded" />
              </div>
            </div>

            {/* Product Count Placeholder */}
            <div className="h-3 w-16 bg-gray-50 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandSearchSkeleton() {
  return (
    <div className="max-h-[400px] overflow-hidden py-2 animate-pulse">
      <div className="px-3 mb-4">
        <div className="h-3 w-16 bg-gray-100 rounded" />
      </div>

      <div className="space-y-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-full flex items-center justify-between px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              {/* Logo Box Placeholder */}
              <div className="h-10 w-10 rounded-lg bg-gray-100 shrink-0" />

              <div className="flex flex-col gap-2">
                {/* Brand Name Placeholder */}
                <div className="h-4 w-24 bg-gray-200 rounded" />
                {/* Slug Badge Placeholder */}
                <div className="h-3.5 w-32 bg-gray-50 rounded" />
              </div>
            </div>

            {/* Stats Placeholder */}
            <div className="h-3 w-12 bg-gray-50 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
