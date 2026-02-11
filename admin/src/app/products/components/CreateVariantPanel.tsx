"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Loader2, Save } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import ImageUploader from "./ImageUploader";
import { VariantServices } from "@/src/services/variants.services";
import { toast } from "sonner";
import { useProductsStore } from "@/src/store/products.store";

// Form Validation Schema
const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required (e.g., 500ml)"),
  weight: z
    .string()
    .min(1, "Weight is required")
    .min(1, "Weight is too Low!")
    .max(10000, "Weight is too high!"),
  unit: z.string().min(1, "Please select a unit"),
  mrp: z
    .string()
    .min(1, "MRP is required")
    .min(1, "MRP is too Low!")
    .max(10000, "MRP is too high!"),
  image: z.url({ message: "Invalid image URL!" }),
  is_active: z.boolean(),
});

interface CreateVariantPanelProps {
  productId: string;
  onClose: () => void;
}

export default function CreateVariantPanel({
  productId,
  onClose,
  //   onSubmit,
}: CreateVariantPanelProps) {
  const { getProduct, addProduct } = useProductsStore();

  const form = useForm<z.infer<typeof variantSchema>>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      name: "",
      weight: "",
      unit: "g",
      mrp: "",
      image: "",
      is_active: true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (values: z.infer<typeof variantSchema>) => {
    try {
      setIsSaving(true);

      const res = await VariantServices.createVariant({
        ...values,
        product_id: productId,
        mrp: Number(values.mrp),
        weight: Number(values.weight),
      });

      if (res.error) {
        return toast.error(res.error);
      }

      if (res.data) {
        toast.success("Variant created successfully!");
        const product = getProduct(productId);
        if (product) {
          addProduct({
            ...product,
            variants_count: product.variants_count
              ? product.variants_count + 1
              : 1,
          });
        }
        form.reset();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[60] w-[420px] border-l border-gray-200 bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex h-[72px] items-center justify-between px-6 border-b border-gray-100 bg-white shrink-0">
        <div className="flex flex-col items-start">
          <h2 className="text-[18px] font-semibold text-gray-900">
            New Variant
          </h2>
          <span className="text-[12px] text-gray-500 font-medium">
            Add size or weight options
          </span>
        </div>
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
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Display Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-semibold">
                    Display Name*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Value Pack or 1.2kg"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-[11px]">
                    How the variant appears to the customer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Weight & Unit Grid */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-semibold">
                      Weight/Vol*
                    </FormLabel>
                    <FormControl>
                      <Input
                        min={0}
                        type="number"
                        placeholder="500"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-semibold">
                      Unit*
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-100">
                        <SelectItem value="g">g (Grams)</SelectItem>
                        <SelectItem value="kg">kg (Kilograms)</SelectItem>
                        <SelectItem value="ml">ml (Milliliters)</SelectItem>
                        <SelectItem value="l">l (Liters)</SelectItem>
                        <SelectItem value="pcs">pcs (Pieces)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pricing */}
            <FormField
              control={form.control}
              name="mrp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-semibold">
                    Printed MRP (₹)*
                  </FormLabel>
                  <FormControl>
                    <Input
                      min={0}
                      max={100000}
                      type="number"
                      placeholder="0.00"
                      className="h-10 font-bold text-gray-900"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image URL (Placeholder for your ImageUploader) */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-semibold">
                    Variant Image
                  </FormLabel>
                  <FormControl>
                    <ImageUploader
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Toggle */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[14px] font-semibold text-gray-900">
                      Active
                    </FormLabel>
                    <p className="text-[12px] text-gray-500">
                      Show this variant in store
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-white flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full h-11  text-white font-semibold rounded-lg shadow-sm gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Create Variant
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSaving}
              className="w-full h-10 text-gray-500"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
