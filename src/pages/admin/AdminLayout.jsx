import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Building2, BadgeCheck, Wallet } from "lucide-react";
import { toast } from "sonner";
import AppShell from "@/components/enterprise/AppShell";
import { PageTransition } from "@/components/enterprise";
import { useAuth } from "@/context/AuthContext";
import { useBrand } from "@/context/BrandContext";
import { Outlet } from "react-router-dom";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true, testid: "nav-admin-dashboard" },
  { to: "/admin/partners", icon: Users, label: "Partners", testid: "nav-admin-partners" },
  { to: "/admin/leads", icon: Building2, label: "Leads", testid: "nav-admin-leads" },
  { to: "/admin/clients", icon: BadgeCheck, label: "Clients", testid: "nav-admin-clients" },
  { to: "/admin/payments", icon: Wallet, label: "Payments", testid: "nav-admin-payments" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const { locked } = useBrand();
  const nav = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    nav("/login", { replace: true });
  };

  return (
    <AppShell
      role="admin"
      navItems={navItems}
      showBrandSwitcher={!locked}
      onLogout={handleLogout}
    >
      <PageTransition>
        <Outlet />
      </PageTransition>
    </AppShell>
  );
}
