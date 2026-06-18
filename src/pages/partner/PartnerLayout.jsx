import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import AppShell from "@/components/enterprise/AppShell";
import { PageTransition } from "@/components/enterprise";
import { useAuth } from "@/context/AuthContext";
import { useBrand } from "@/context/BrandContext";

const items = [
  { to: "/partner", icon: LayoutDashboard, label: "Dashboard", end: true, testid: "nav-partner-dashboard" },
  { to: "/partner/leads", icon: Building2, label: "My Leads", testid: "nav-partner-leads" },
  { to: "/partner/clients", icon: BadgeCheck, label: "My Clients", testid: "nav-partner-clients" },
];

export default function PartnerLayout() {
  const { user, logout } = useAuth();
  const { setBrand } = useBrand();
  const nav = useNavigate();

  useEffect(() => {
    if (user?.brand) setBrand(user.brand);
  }, [user?.brand, setBrand]);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    nav("/partner/login", { replace: true });
  };

  return (
    <AppShell role="partner" navItems={items} onLogout={handleLogout}>
      <PageTransition>
        <Outlet />
      </PageTransition>
    </AppShell>
  );
}
