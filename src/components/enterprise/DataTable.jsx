import React from "react";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { EmptyState } from "./EmptyState";
import { TableSkeleton } from "./LoadingState";

export function DataTable({
  columns,
  data,
  loading,
  emptyTitle,
  emptyHint,
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  pagination,
  onExport,
  exportLabel = "Export CSV",
  rowKey = "id",
  onRowClick,
  testid,
  className,
}) {
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1;

  return (
    <Card padding="p-0" className={cn("overflow-hidden", className)} data-testid={testid}>
      {(search !== undefined || onExport) && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/30">
          {search !== undefined && (
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder}
                className="input-enterprise pl-9 h-9"
              />
            </div>
          )}
          {onExport && (
            <button type="button" onClick={onExport} className="btn-secondary h-9 text-xs">
              <Download size={14} /> {exportLabel}
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted/50 backdrop-blur-sm">
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton cols={columns.length} rows={5} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle || "No data"} hint={emptyHint} />
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row[rowKey]}
                  data-testid={row.testid || `row-${row[rowKey]}`}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-border/60 last:border-0 transition-colors",
                    onRowClick && "cursor-pointer hover:bg-muted/40"
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3.5 align-middle", col.className)}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.total > pagination.pageSize && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
          <span className="text-xs text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.pageSize + 1}–{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="btn-secondary h-8 w-8 p-0 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-xs font-medium">{pagination.page} / {totalPages}</span>
            <button
              type="button"
              disabled={pagination.page >= totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="btn-secondary h-8 w-8 p-0 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

export function exportToCsv(filename, columns, data) {
  const headers = columns.map((c) => c.header).join(",");
  const rows = data.map((row) =>
    columns.map((c) => {
      const val = c.csvValue ? c.csvValue(row) : (c.render ? "" : row[c.key]);
      const str = String(val ?? "").replace(/"/g, '""');
      return `"${str}"`;
    }).join(",")
  );
  const blob = new Blob([[headers, ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
