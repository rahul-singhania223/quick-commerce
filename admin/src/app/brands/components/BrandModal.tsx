"use client";

import React, { useState, useEffect, useRef } from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Button } from "@/src/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import LogoUploader from "./logo-uploader";
import { BrandsServices } from "@/src/services/brands.services";
import { toast } from "sonner";
import { useBrandsStore } from "@/src/store/brands.store";

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandId?: string | null;
}

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long!")
    .max(50, "Name must be at most 20 characters long!"),
  logo: z.url({ message: "Invalid logo URL!" }),
  is_active: z.boolean().default(true).optional(),
});

export default function BrandModal({
  isOpen,
  onClose,
  brandId,
}: BrandModalProps) {
  const isEdit = !!brandId;

  const { getBrand, addBrand } = useBrandsStore();

  const brandData = brandId ? getBrand(brandId) : null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: brandData?.name || "",
      logo: brandData?.logo || "",
      is_active: brandData?.is_active || true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);

      // Update
      if (isEdit && brandData) {
        const res = await BrandsServices.updateBrand(brandData.id, values);

        if (res.error) return toast.error(res.error);
        if (res.data) {
          addBrand(res.data);
          toast.success("Brand updated successfully!");
          return onClose();
        }
      }

      // Create
      const res = await BrandsServices.createBrand(values);

      if (res.error) return toast.error(res.error);
      if (res.data) {
        addBrand(res.data);
        toast.success("Brand created successfully!");
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[480px] p-6 rounded-[16px] gap-6">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-semibold text-gray-900">
            {isEdit ? "Edit Brand" : "Create Brand"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            {/* Brand Name */}
            <FormField
              disabled={isSaving}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-[13px] font-medium text-gray-700">
                    Brand Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Nike"
                      className="h-10 focus-visible:ring-primary rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Logo */}
            <FormField
              disabled={isSaving}
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-[13px] font-medium text-gray-700">
                    Brand Logo
                  </FormLabel>
                  <FormControl>
                    <LogoUploader
                      value={field.value}
                      onChange={(url) => field.onChange(url)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Status */}
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
                          Enable to show in catalogs
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

            <DialogFooter className="mt-2 pt-4 border-t border-gray-100 flex gap-3 sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSaving}
                className="rounded-lg text-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving || !form.formState.isValid}
                className=" rounded-lg px-8"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Brand"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
