import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnimatedCounter } from "@/hooks/useMediaQuery";
import { Card } from "./Card";

export function StatCard({ label, value, sub, icon: Icon, trend, trendUp, loading, testid, className }) {
  const numericValue = typeof value === "number" ? value : null;
  const animated = useAnimatedCounter(numericValue ?? 0);

  return (
    <Card className={cn("relative", className)} data-testid={testid}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground leading-snug">{label}</p>
          <p className="mt-2 text-2xl lg:text-3xl font-bold tracking-tight text-foreground font-mono-tabular break-words">
            {loading ? (
              <span className="inline-block h-8 w-16 rounded-md skeleton-shimmer" />
            ) : numericValue !== null ? (
              animated.toLocaleString("en-IN")
            ) : (
              value
            )}
          </p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
          {trend && (
            <div className={cn("mt-2 inline-flex items-center gap-1 text-xs font-medium", trendUp ? "text-success" : "text-danger")}>
              {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend}
            </div>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
            <Icon size={18} />
          </div>
        )}
      </div>
    </Card>
  );
}
