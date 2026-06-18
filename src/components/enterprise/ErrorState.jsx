import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Card } from "./Card";

export function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <Card className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger mb-4">
        <AlertCircle size={22} />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {message && <p className="mt-1 text-sm text-muted-foreground max-w-sm">{message}</p>}
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary mt-4">
          <RefreshCw size={14} /> Try again
        </button>
      )}
    </Card>
  );
}
