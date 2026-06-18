import React from "react";
import { Inbox } from "lucide-react";

export function EmptyState({ title, hint, icon: Icon = Inbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        <Icon size={22} />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {hint && <p className="mt-1 text-sm text-muted-foreground max-w-sm">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
