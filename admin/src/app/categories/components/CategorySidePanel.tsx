import { X, Loader2 } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Button } from "@/src/components/ui/button";
import z from "zod";
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
import { useState } from "react";
import { CategoryServices } from "@/src/services/category.services";
import { toast } from "sonner";
import { useCategoryStore } from "@/src/store/category.store";

export const createCategoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(64, "Category name cannot exceed 64 characters"),

  parent_id: z.uuid("Invalid parent category").nullable(),
  is_active: z.boolean(),
});

export default function CategorySidePanel({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) {
  const isEdit = !!id;

  const { addCategory, categories, getCategory, isLoading } =
    useCategoryStore();

  const categoryData = getCategory(id ?? "");

  const [parentCategoriesOptions, setParentCategoriesOptions] = useState(
    Array.from(categories.values()).map((cat) => ({
      label: cat.name,
      value: cat.id,
    })),
  );
  const [parentCategoriesLoading, setParentCategoriesLoading] =
    useState(isLoading);

  const form = useForm<z.infer<typeof createCategoryFormSchema>>({
    resolver: zodResolver(createCategoryFormSchema),
    defaultValues: {
      name: categoryData?.name ?? "",
      parent_id: categoryData?.parent.id ?? null,
      is_active: categoryData?.is_active ?? true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (
    data: z.infer<typeof createCategoryFormSchema>,
  ) => {
    try {
      setIsSaving(true);

      // update category
      if (isEdit && categoryData) {
        const res = await CategoryServices.updateCategory(
          categoryData.id,
          data,
        );
        if (res.error) return toast.error(res.error);

        if (res.data) {
          addCategory(res.data);
          toast.success("Category updated successfully!");
          return onClose();
        }
      }

      // create category
      const res = await CategoryServices.createCategory(data);
      if (res.error) return toast.error(res.error);

      if (res.data) {
        addCategory(res.data);
        toast.success("Category created successfully!");
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const onParentCategorySearch = async (q: string) => {
    try {
      setParentCategoriesLoading(true);
      const res = await CategoryServices.getAllCategories({ search: q });

      if (!res) return toast.error("Something went wrong!");

      setParentCategoriesOptions(
        res.data.map((cat) => ({
          label: cat.name,
          value: cat.id,
        })),
      );
    } finally {
      setParentCategoriesLoading(false);
    }
  };

  return (
    <div className="w-[400px] border-l border-gray-200 bg-white flex flex-col shadow-xl animate-in slide-in-from-right duration-300">
      {/* Panel Header */}
      <div className="h-[64px] border-b border-gray-100 flex items-center justify-between px-5">
        <h2 className="text-[16px] font-semibold text-gray-900">
          {isEdit ? "Edit Category" : "New Category"}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} className="text-gray-400" />
        </Button>
      </div>

      {/* Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="">
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Name */}
            <FormField
              disabled={isSaving}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-[13px] font-medium text-gray-700">
                    Category Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Dairy"
                      className="h-10 font-semibold focus-visible:ring-primary rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* parent */}
            <FormField
              disabled={isSaving}
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-[13px] font-medium text-gray-700">
                    Parent Category
                  </FormLabel>
                  <FormControl>
                    <SelectInput
                      options={parentCategoriesOptions}
                      selectedValue={getCategory(field.value ?? "")?.name ?? ""}
                      onSelect={(value) => field.onChange(value)}
                      isLoading={isSaving || parentCategoriesLoading}
                      onSearch={(q) => onParentCategorySearch(q)}
                      label="Select Parent Category"
                      clearSelection={() => field.onChange(null)}
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
                          Enable to show in navigation
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
          </div>

          {/* Actions */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
            <Button
              disabled={isSaving}
              type="submit"
              className="w-full h-10 rounded-lg"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Category
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-gray-500 h-10"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
