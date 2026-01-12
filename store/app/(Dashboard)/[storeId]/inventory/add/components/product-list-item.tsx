import React from "react";
import { ChevronRight } from "lucide-react";
import { ProductSearchResult } from "@/types/types";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  product: ProductSearchResult;
  selectedProduct: ProductSearchResult | null;
  onClick: () => void;
}

const ProductListItem = ({ product, onClick, selectedProduct }: Props) => {
  const { name, brand, category, variants } = product;

  const isSelected = selectedProduct?.id === product.id;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full h-16 px-3 py-2.5 bg-white border border-border flex flex-row items-center gap-3 active:bg-gray-50 transition-colors text-left hover:bg-muted/50 rounded-lg",
        { "bg-[#F0FDF4] hover:bg-[#F0FDF4] border-[#16A34A]": isSelected }
      )}
    >
      <Image
        className="w-10 h-10 object-contain"
        src={"/images/logo.png"}
        alt="product-image"
        width={150}
        height={150}
      />

      <div className="flex-1 flex flex-col justify-center gap-0.5 min-w-0">
        <h3 className="text-[14px] font-medium text-foreground leading-4.5 truncate">
          {name}
        </h3>
        <p className="text-[12px] font-normal text-body/70 leading-4 truncate">
          {brand?.name} - {category?.name}
        </p>
        <span className="w-0.5 h-0.5 rounded-full bg-muted/10" />
        <p className="text-[12px] font-medium text-body/70 leading-4 shrink-0">
          {variants.length} {variants.length === 1 ? "variant" : "variants"}
        </p>
      </div>

      <div className="ml-2 shrink-0">
        <ChevronRight size={16} className="text-body/80" />
      </div>
    </button>
  );
};

export default ProductListItem;
