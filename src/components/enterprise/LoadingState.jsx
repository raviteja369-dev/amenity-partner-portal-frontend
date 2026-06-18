import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";

export function Skeleton({ className }) {
  return <div className={cn("rounded-md skeleton-shimmer", className)} />;
}

export function StatCardSkeleton() {
  return (
    <Card>
      <Skeleton className="h-3 w-20 mb-3" />
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-3 w-32" />
    </Card>
  );
}

export function TableSkeleton({ cols = 5, rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-border/40">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-4">
              <Skeleton className="h-4 w-full max-w-[120px]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card><Skeleton className="h-[300px] w-full" /></Card>
        <Card><Skeleton className="h-[300px] w-full" /></Card>
      </div>
    </div>
  );
}

export function PageLoading({ message = "Loading…" }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
