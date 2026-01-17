import React from "react";

interface VariantListContainerProps {
  variants: {
    id: string;
    name: string;
    mrp: string;
  }[];
  selectedVariantId: string | null;
  onSelect: (variantId: string) => void;
}

interface VariantRowProps {
  variant: {
    id: string;
    name: string;
    mrp: string;
  };
  isSelected: boolean;
  onSelect: (variantId: string) => void;
}

const VariantRow = ({ variant, isSelected, onSelect }: VariantRowProps) => {
  const { name } = variant;

  return (
    <button
      onClick={() => onSelect(variant.id)}
      className={`
        w-full h-12 lg:h-11 px-3 mb-2 flex items-center justify-between
        border rounded-xl transition-all duration-200
        
        ${
          isSelected
            ? "bg-[#F0FDF4] border-[#16A34A]"
            : "bg-[#FFFFFF] border-[#E5E7EB]"
        }
      `}
    >
      {/* Left: Variant Name */}
      <span className="text-[14px] font-medium text-foreground leading-4.5">
        {name}
      </span>

      {/* Right: Selection Indicator / Unavailable Text */}
      <div className="flex items-center">
        <div
          className={`
              w-4 h-4 rounded-full flex items-center justify-center transition-colors
              ${
                isSelected
                  ? "bg-[#16A34A] border-none"
                  : "bg-transparent border-2 border-[#D1D5DB]"
              }
            `}
        >
          {/* Inner Dot for Selected State */}
          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
      </div>
    </button>
  );
};

const VariantListContainer = ({
  variants,
  selectedVariantId,
  onSelect,
}: VariantListContainerProps) => {
  return (
    <div className="w-full px-3 pt-2 pb-3 bg-background border-t border-border">
      {/* Section Label */}
      <p className="text-sm lg:text-[12px] font-medium text-[#6B7280] mb-2">
        Choose variant
      </p>

      {/* Variant Rows */}
      <div className="flex flex-col">
        {variants.map((variant) => (
          <VariantRow
            key={variant.id}
            variant={variant}
            isSelected={selectedVariantId === variant.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default VariantListContainer;
