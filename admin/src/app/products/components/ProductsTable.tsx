import {
  Edit2,
  MoreVertical,
  ImageIcon,
  ArrowRight,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { useProductsStore } from "@/src/store/products.store";
import ProductsTableSkeleton from "./ProductsTableSkeleton";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { useAlertStore } from "@/src/store/alert.store";
import { CategoryServices } from "@/src/services/category.services";
import { toast } from "sonner";
import { ProductServices } from "@/src/services/products.services";
import VariantSidePanel from "./VariantSidePanel";
import CreateVariantPanel from "./CreateVariantPanel";

interface Product {
  id: string;
  name: string;
  sku: string;
  image?: string;
  categoryPath: string;
  brand: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
}

export default function ProductsTable({
  onEdit,
}: {
  onEdit: (id: string) => void;
}) {
  const {
    products: productsMap,
    isLoading,
    removeProduct,
    getProduct,
  } = useProductsStore();
  const { show: showAlert } = useAlertStore();

  const [deletingProductId, setDeletingProductId] = useState<string>("");
  const [variantSidePanelOpen, setVariantSidePanelOpen] = useState<string>("");
  const [createVariantPanelOpen, setCreateVariantPanelOpen] =
    useState<string>("");

  const deleteCategory = async (id: string) => {
    try {
      setDeletingProductId(id);

      const res = await ProductServices.deleteProduct(id);
      if (res.error) return toast.error(res.error);

      toast.success("Category deleted successfully!");
      removeProduct(id);
    } finally {
      setDeletingProductId("");
    }
  };

  const onDelete = (id: string) => {
    showAlert({
      title: "Delete Product",
      message: `Deleting this product will also delete its ${getProduct(id)?._count.variants} variants & related ${getProduct(id)?._count.storeProducts} store products. Are you sure you want to delete this product?`,
      onConfirm: () => {
        deleteCategory(id);
      },
    });
  };
  if (isLoading) return <ProductsTableSkeleton />;

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="h-12 border-b border-gray-200 bg-gray-50/50">
              <th className="min-w-[320px] px-4 text-[12px] font-medium uppercase tracking-wider text-gray-500">
                Product
              </th>
              <th className="w-[220px] px-4 text-[12px] font-medium uppercase tracking-wider text-gray-500">
                Category
              </th>
              <th className="w-[160px] px-4 text-[12px] font-medium uppercase tracking-wider text-gray-500">
                Brand
              </th>
              <th className="w-[120px] px-4 text-right text-[12px] font-medium uppercase tracking-wider text-gray-500">
                Variants
              </th>
              <th className="w-[120px] px-4 text-center text-[12px] font-medium uppercase tracking-wider text-gray-500">
                Store Products
              </th>
              <th className="w-[120px] px-4 text-center text-[12px] font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="w-[80px] px-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from(productsMap.values()).map((p) => (
              <tr
                key={p.id}
                className="group h-[64px] hover:bg-gray-50/80 transition-colors"
              >
                {/* 1. Product Info */}
                <td className="px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                      {p.image ? (
                        <img
                          src={p.image}
                          className="h-full w-full object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-medium text-gray-900 line-clamp-1">
                        {p.name}
                      </span>
                      <span className="text-[12px] text-gray-500 font-mono tracking-tighter">
                        {p.slug}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 2. Category Path */}
                <td className="px-4 text-[13px] text-gray-600">
                  <span className="line-clamp-1" title={p.category.name}>
                    {p.category.name}
                  </span>
                </td>

                {/* 3. Brand */}
                <td className="px-4 text-[13px] text-gray-600">
                  {p.brand?.name || "-"}
                </td>

                {/* 4. Variants */}
                <td className="px-4 text-center font-medium text-[14px]">
                  <button
                    onClick={() => setVariantSidePanelOpen(p.id)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {p._count.variants || 0}
                    <ArrowRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
                    />
                  </button>
                </td>

                {/* 5. Store Products */}
                <td className="px-4 text-center">
                  <button
                    // onClick={() => onViewProducts(p.id)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer "
                  >
                    {p._count.storeProducts || 0}
                    <ArrowRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
                    />
                  </button>
                </td>

                {/* 6. Status Badge */}
                <td className="px-4 text-center">
                  <Badge
                    variant="secondary"
                    className={`h-6 rounded-full px-2 text-[11px] font-medium shadow-none ${
                      p.is_active
                        ? "bg-[#DCFCE7] text-[#166534]"
                        : "bg-[#E5E7EB] text-[#374151]"
                    }`}
                  >
                    {p.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>

                {/* 7. Actions */}
                <td className="px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      disabled={!!deletingProductId}
                      type="button"
                      onClick={() => onEdit(p.id)}
                      variant={"ghost"}
                      className="cursor-pointer"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => onDelete(p.id)}
                      disabled={!!deletingProductId}
                      variant={"destructive"}
                      className="bg-destructive/20 hover:bg-destructive/50 cursor-pointer text-destructive"
                    >
                      {deletingProductId === p.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </Button>
                  </div>
                  {variantSidePanelOpen === p.id && (
                    <VariantSidePanel
                      productId={p.id}
                      productName={p.name}
                      onClose={() => setVariantSidePanelOpen("")}
                      onAdd={() => setCreateVariantPanelOpen(p.id)}
                      onEdit={() => {}}
                    />
                  )}

                  {createVariantPanelOpen === p.id && (
                    <CreateVariantPanel
                      productId={p.id}
                      onClose={() => setCreateVariantPanelOpen("")}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
