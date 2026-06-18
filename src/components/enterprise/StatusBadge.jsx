import React from "react";
import { cn } from "@/lib/utils";

const styles = {
  lead: "bg-muted text-muted-foreground",
  client: "bg-primary/10 text-primary",
  paid: "bg-success/10 text-success",
  unpaid: "bg-warning/10 text-warning",
  active: "bg-success/10 text-success",
  inactive: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        styles[status] || "bg-muted text-muted-foreground",
        className
      )}
    >
      {status}
    </span>
  );
}
