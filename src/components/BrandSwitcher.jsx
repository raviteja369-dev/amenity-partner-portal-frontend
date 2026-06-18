import React from "react";
import { useBrand } from "@/context/BrandContext";
import { cn } from "@/lib/utils";

export default function BrandSwitcher({ allowed, compact = false, stacked = false }) {
  const { brand, brands, setBrand, locked } = useBrand();
  if (locked) return null;
  const list = (allowed || Object.keys(brands)).map((k) => brands[k]).filter(Boolean);

  if (stacked) {
    return (
      <div className="space-y-1.5" data-testid="brand-switcher">
        {list.map((b) => {
          const active = b.key === brand.key;
          return (
            <button
              key={b.key}
              type="button"
              onClick={() => setBrand(b.key)}
              data-testid={`brand-switch-${b.key}`}
              className={cn(
                "w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left",
                active
                  ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: b.accentHex }} aria-hidden />
              <span className="truncate">{b.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center rounded-lg border border-border bg-card overflow-hidden", compact && "w-full")} data-testid="brand-switcher">
      {list.map((b) => {
        const active = b.key === brand.key;
        return (
          <button
            key={b.key}
            type="button"
            onClick={() => setBrand(b.key)}
            data-testid={`brand-switch-${b.key}`}
            className={cn(
              "flex-1 min-w-0 px-2 py-2 text-xs font-medium transition-colors border-r border-border last:border-r-0",
              active ? "bg-primary/10 text-primary" : "bg-card hover:bg-muted text-foreground"
            )}
          >
            <span className="inline-flex items-center justify-center gap-1.5 w-full truncate">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ background: b.accentHex }} aria-hidden />
              <span className="truncate">{b.name}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
