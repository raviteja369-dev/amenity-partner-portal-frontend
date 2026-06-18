import React from "react";
import { useBrand } from "@/context/BrandContext";

export default function BrandMark({ size = "sm", showParent = false }) {
  const { brand, parent } = useBrand();
  const sizes = {
    xs: { box: "h-6 w-6 text-xs", text: "text-sm" },
    sm: { box: "h-9 w-9 text-sm", text: "text-base" },
    md: { box: "h-11 w-11 text-base", text: "text-lg" },
    lg: { box: "h-14 w-14 text-xl", text: "text-2xl" },
  };
  const s = sizes[size] || sizes.sm;
  return (
    <div className="flex items-center gap-3 min-w-0" data-testid="brand-mark">
      <div
        className={`${s.box} shrink-0 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold`}
        aria-hidden
      >
        {brand.short[0]}
      </div>
      <div className="min-w-0 leading-tight">
        <div className={`${s.text} font-semibold text-foreground truncate`}>{brand.name}</div>
        {showParent && (
          <div className="text-xs text-muted-foreground truncate">
            {parent.name} portal
          </div>
        )}
      </div>
    </div>
  );
}
