import React from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className, hover, padding = "p-6", ...props }) {
  return (
    <div
      className={cn(
        hover ? "enterprise-card-hover" : "enterprise-card",
        padding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ChartCard({ title, description, children, actions, className, testid }) {
  return (
    <Card className={cn("flex flex-col", className)} data-testid={testid}>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </Card>
  );
}
