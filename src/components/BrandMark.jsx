import React from "react";
import { useBrand } from "@/context/BrandContext";

export default function BrandMark({ size = "sm", showParent = false }) {
  const { parent } = useBrand();
  const sizes = {
    xs: { box: "h-6 w-6", text: "text-sm" },
    sm: { box: "h-9 w-9", text: "text-base" },
    md: { box: "h-11 w-11", text: "text-lg" },
    lg: { box: "h-14 w-14", text: "text-2xl" },
  };
  const s = sizes[size] || sizes.sm;

  return (
    <div className="flex items-center gap-3 min-w-0" data-testid="brand-mark">
      <img
        src="/amenity-forge-logo.png"
        alt={parent.name}
        className={`${s.box} shrink-0 rounded-lg object-cover`}
      />
      <div className="min-w-0 leading-tight">
        <div className={`${s.text} font-semibold text-foreground truncate`}>{parent.name}</div>
        {showParent && (
          <div className="text-xs text-muted-foreground truncate">{parent.product}</div>
        )}
      </div>
    </div>
  );
}
