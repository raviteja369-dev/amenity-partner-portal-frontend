import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FadeIn } from "./motion";

export function PageHeader({ eyebrow, title, description, actions, breadcrumbs, testid }) {
  return (
    <FadeIn>
      <div className="border-b border-border bg-card" data-testid={testid}>
        <div className="px-6 lg:px-8 py-6">
          {breadcrumbs?.length > 0 && (
            <nav className="flex items-center flex-wrap gap-1.5 text-sm text-muted-foreground mb-3" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={crumb.label}>
                  {i > 0 && <ChevronRight size={14} className="shrink-0" />}
                  {crumb.to ? (
                    <Link to={crumb.to} className="hover:text-foreground transition-colors">{crumb.label}</Link>
                  ) : (
                    <span className="text-foreground font-medium">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
          {!breadcrumbs?.length && eyebrow && (
            <p className="text-sm text-muted-foreground mb-1">{eyebrow}</p>
          )}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
              {description && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-3xl">{description}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

export function SectionTitle({ children, right, className }) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <h2 className="text-base font-semibold text-foreground">{children}</h2>
      {right}
    </div>
  );
}
