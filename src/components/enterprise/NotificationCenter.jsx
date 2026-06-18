import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Building2, BadgeCheck, Wallet, Users, CheckCheck } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

const TYPE_META = {
  lead: { icon: Building2, color: "bg-primary/10 text-primary" },
  conversion: { icon: BadgeCheck, color: "bg-success/10 text-success" },
  payment: { icon: Wallet, color: "bg-warning/10 text-warning" },
  partner: { icon: Users, color: "bg-violet-500/10 text-violet-600" },
};

export default function NotificationCenter({ role }) {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications(role);

  const handleOpen = () => {
    setOpen((v) => !v);
  };

  const handleClick = (n) => {
    markRead(n.id);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        data-testid="notification-bell"
        className={cn(
          "relative p-2 rounded-lg transition-colors",
          open ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-float z-50 overflow-hidden"
              data-testid="notification-panel"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div>
                  <p className="text-sm font-semibold text-foreground">Notifications</p>
                  {unreadCount > 0 && (
                    <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    data-testid="mark-all-read"
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[360px] overflow-y-auto">
                {loading ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">Loading…</div>
                ) : notifications.length === 0 ? (
                  <div className="py-10 px-4 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Bell size={18} />
                    </div>
                    <p className="text-sm font-medium text-foreground">No notifications</p>
                    <p className="text-xs text-muted-foreground mt-1">You&apos;re all caught up.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-border/60">
                    {notifications.map((n) => {
                      const meta = TYPE_META[n.type] || TYPE_META.lead;
                      const Icon = meta.icon;
                      return (
                        <li key={n.id}>
                          <Link
                            to={n.href}
                            onClick={() => handleClick(n)}
                            data-testid={`notification-${n.id}`}
                            className={cn(
                              "flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
                              !n.read && "bg-primary/[0.03]"
                            )}
                          >
                            <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", meta.color)}>
                              <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={cn("text-sm", !n.read ? "font-semibold text-foreground" : "font-medium text-foreground")}>
                                  {n.title}
                                </p>
                                {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary mt-1.5" />}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
