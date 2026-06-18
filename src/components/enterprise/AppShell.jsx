import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import BrandSwitcher from "@/components/BrandSwitcher";
import NotificationCenter from "@/components/enterprise/NotificationCenter";
import { useAuth } from "@/context/AuthContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export default function AppShell({
  navItems,
  children,
  role,
  showBrandSwitcher = false,
  onLogout,
}) {
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const closeMobile = () => isMobile && setSidebarOpen(false);

  const sidebarContent = (
    <>
      <div className="flex items-center border-b border-border h-[4.5rem] px-5 shrink-0">
        <BrandMark size="sm" showParent />
      </div>

      {showBrandSwitcher && (
        <div className="px-4 py-4 border-b border-border shrink-0">
          <p className="text-xs font-medium text-muted-foreground mb-2">Active brand</p>
          <BrandSwitcher stacked />
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={closeMobile}
            data-testid={item.testid}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon size={18} strokeWidth={1.75} className="shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border shrink-0">
        <div className="rounded-lg bg-muted/50 px-3 py-3 mb-3">
          <p className="text-sm font-medium text-foreground truncate" data-testid={`${role}-current-user`}>
            {user?.name}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          data-testid={`${role}-logout-button`}
          className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {!isMobile && (
        <aside className="w-72 shrink-0 border-r border-border bg-card flex flex-col sticky top-0 h-screen">
          {sidebarContent}
        </aside>
      )}

      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border z-50 flex flex-col shadow-float"
            >
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute right-3 top-5 p-1.5 rounded-lg hover:bg-muted z-10"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="glass-header sticky top-0 z-30 h-14 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {isMobile && (
              <button type="button" onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-muted shrink-0" aria-label="Open menu">
                <Menu size={20} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <NotificationCenter role={role} />

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:block text-sm font-medium max-w-[140px] truncate">{user?.name}</span>
                <ChevronDown size={14} className="text-muted-foreground hidden sm:block shrink-0" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-border bg-card shadow-float z-50 py-1"
                    >
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setProfileOpen(false); onLogout(); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 min-w-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
