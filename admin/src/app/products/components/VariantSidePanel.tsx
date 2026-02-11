import { ProductVariant } from "@/src/lib/types";
import { VariantServices } from "@/src/services/variants.services";
import { useEffect, useState } from "react";
import React from "react";
import {
  Edit2,
  MoreVertical,
  ImageIcon,
  Weight,
  X,
  Plus,
  AlertCircle,
  Loader2,
  PackageOpen,
  Trash2,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useProductsStore } from "@/src/store/products.store";

interface VariantSidePanelProps {
  productId: string;
  productName?: string;
  onClose: () => void;
  onAdd: () => void;
  onEdit: (variant: ProductVariant) => void;
}

export default function VariantSidePanel({
  productId,
  productName = "Product",
  onClose,
  onAdd,
  onEdit,
}: VariantSidePanelProps) {
  const [variants, setVariants] = useState<ProductVariant[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const [deleting, setDeleting] = useState("");

  const { addProduct, getProduct } = useProductsStore();

  const fetchVariants = async () => {
    try {
      setLoading(true);
      setLoadingFailed(false);
      const data = await VariantServices.getAllVariants({ productId });
      if (!data) return setLoadingFailed(true);
      setVariants(data);
    } finally {
      setLoading(false);
    }
  };

  const deleteVariant = async (id: string) => {
    try {
      setDeleting(id);
      const res = await VariantServices.deleteVariant(id);
      if (res.error) return toast.error(res.error);

      const product = getProduct(productId);
      if (product) {
        addProduct({
          ...product,
          variants_count: product.variants_count
            ? product.variants_count - 1
            : 0,
        });
      }

      fetchVariants();
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting("");
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [productId]);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[420px] border-l border-gray-200 bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex h-[72px] items-center justify-between px-6 border-b border-gray-100 bg-white shrink-0">
        <div className="flex flex-col items-start">
          <h2 className="text-[16px] font-semibold text-gray-900 truncate max-w-[260px]">
            {productName}
          </h2>
          <span className="text-[12px] text-gray-500 font-medium">
            Manage Variants
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

      {/* Action Row */}
      <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2">
          {variants?.length || 0} Variants
        </span>
        <Button onClick={onAdd} size="sm" className="h-8  rounded-lg gap-1.5">
          <Plus size={14} />
          Add Variant
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <VariantLoadingSkeleton />
        ) : loadingFailed ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle size={32} className="text-red-400 mb-3" />
            <p className="text-[14px] font-medium text-gray-900">
              Failed to load variants
            </p>
            <Button
              variant="link"
              onClick={fetchVariants}
              className="text-blue-600"
            >
              Retry
            </Button>
          </div>
        ) : variants && variants.length > 0 ? (
          variants.map((v) => (
            <VariantListItem
              key={v.id}
              variant={v}
              onEdit={() => onEdit(v)}
              deleteVariant={deleteVariant}
              deleting={deleting}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageOpen size={48} className="text-gray-200 mb-4" />
            <p className="text-[15px] font-semibold text-gray-900">
              No variants yet
            </p>
            <p className="text-[13px] text-gray-500 mt-1 max-w-[200px]">
              Add different sizes or weights for this product.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function VariantListItem({
  variant,
  onEdit,
  deleteVariant,
  deleting,
}: {
  variant: ProductVariant;
  onEdit: () => void;
  deleteVariant: (id: string) => void;
  deleting: string;
}) {
  return (
    <div className="group relative flex items-center gap-4 p-3 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
        {variant.image ? (
          <img
            src={variant.image}
            alt=""
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <ImageIcon size={18} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-gray-900 truncate">
            {variant.name}
          </span>
          {!variant.is_active && (
            <Badge className="h-4 text-[9px] uppercase bg-gray-100 text-gray-500 border-none">
              Disabled
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1 text-[12px] text-gray-500">
            <Weight size={12} className="text-gray-400" />
            <span>
              {variant.weight}
              {variant.unit}
            </span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="text-[13px] font-bold text-gray-900">
            ₹{Number(variant.mrp).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          disabled={deleting === variant.id}
          onClick={() => deleteVariant(variant.id)}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-gray-400 hover:bg-destructive/10"
        >
          {deleting === variant.id ? (
            <Loader2 size={16} className="animate-spin text-destructive/50" />
          ) : (
            <Trash2 size={16} className="text-destructive/50" />
          )}
        </Button>
      </div>
    </div>
  );
}

function VariantLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 animate-pulse"
        >
          <div className="h-12 w-12 rounded-lg bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 bg-gray-100 rounded" />
            <div className="h-2 w-20 bg-gray-50 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
