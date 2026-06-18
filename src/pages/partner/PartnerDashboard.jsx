import React, { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Building2, BadgeCheck, IndianRupee, Clock, Award, Target } from "lucide-react";
import api, { inr } from "@/lib/api";
import { useBrand } from "@/context/BrandContext";
import {
  PageHeader, StatCard, ChartCard, Card, EmptyState,
  DashboardSkeleton, StaggerContainer, StaggerItem,
} from "@/components/enterprise";

export default function PartnerDashboard() {
  const { brand, brands } = useBrand();
  const [data, setData] = useState(null);
  const [chart, setChart] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/dashboard/partner"), api.get("/leads")])
      .then(([d, l]) => {
        setData(d.data);
        setRecentLeads(l.data.slice(0, 5));
        const buckets = {};
        l.data.forEach((row) => {
          const m = (row.created_at || "").slice(0, 7);
          if (!m) return;
          buckets[m] = buckets[m] || { month: m, leads: 0, clients: 0 };
          buckets[m].leads += 1;
          if (row.status === "client") buckets[m].clients += 1;
        });
        setChart(Object.values(buckets).sort((a, b) => a.month.localeCompare(b.month)));
      })
      .finally(() => setLoading(false));
  }, []);

  const p = data?.profile;
  const k = data?.kpis || {};
  const conversionRate = k.total_leads ? Math.round((k.total_clients / k.total_leads) * 100) : 0;
  const performanceScore = Math.min(100, conversionRate + (k.total_clients || 0) * 5);

  if (loading && !data) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader
        title={loading ? "Loading…" : `Welcome back, ${p?.name?.split(" ")[0] || "Partner"}`}
        description={p ? `${p.area}, ${p.city} · PIN ${p.pin_code}` : "Your performance overview"}
        testid="partner-dashboard-header"
        breadcrumbs={[{ label: "Partner", to: "/partner" }, { label: "Dashboard" }]}
      />

      <div className="p-6 lg:p-8 space-y-8">
        {p && (
          <Card hover className="grid md:grid-cols-4 gap-6" data-testid="partner-profile-card">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Partner</p>
              <p className="mt-1 text-lg font-semibold">{p.name}</p>
              <p className="text-sm text-muted-foreground">{p.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Vertical</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: brand.accentHex }} />
                <span className="text-lg font-semibold">{brands[p.brand]?.name || p.brand}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Coverage</p>
              <p className="mt-1 text-lg font-semibold">{p.city}</p>
              <p className="text-sm text-muted-foreground">{p.area}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Performance Score</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-3xl font-bold text-primary">{performanceScore}</span>
                <span className="text-sm text-muted-foreground mb-1">/ 100</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${performanceScore}%` }} />
              </div>
            </div>
          </Card>
        )}

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StaggerItem><StatCard label="My leads" value={k.total_leads ?? 0} icon={Building2} loading={loading} testid="kpi-my-leads" /></StaggerItem>
          <StaggerItem><StatCard label="Clients" value={k.total_clients ?? 0} icon={BadgeCheck} loading={loading} testid="kpi-my-clients" /></StaggerItem>
          <StaggerItem><StatCard label="Revenue" value={inr(k.total_revenue || 0)} icon={IndianRupee} loading={loading} testid="kpi-my-revenue" /></StaggerItem>
          <StaggerItem><StatCard label="Pending" value={inr(k.pending_revenue || 0)} icon={Clock} loading={loading} testid="kpi-my-pending" /></StaggerItem>
        </StaggerContainer>

        <div className="grid lg:grid-cols-3 gap-6">
          <ChartCard title="Monthly Activity" description="Leads and conversions over time" className="lg:col-span-2">
            {chart.length === 0 ? (
              <EmptyState title="No leads yet" hint="Add a school lead to get started." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="leads" name="Leads" fill={brand.accentHex} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="clients" name="Clients" fill="#22C55E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <Card>
            <p className="text-sm font-semibold mb-4">Achievements</p>
            <div className="space-y-3">
              {[
                { icon: Target, label: "First Lead", done: (k.total_leads || 0) > 0 },
                { icon: BadgeCheck, label: "First Client", done: (k.total_clients || 0) > 0 },
                { icon: IndianRupee, label: "Revenue Earned", done: (k.total_revenue || 0) > 0 },
                { icon: Award, label: "10+ Leads", done: (k.total_leads || 0) >= 10 },
              ].map((a) => (
                <div key={a.label} className={`flex items-center gap-3 p-3 rounded-lg border ${a.done ? "border-success/30 bg-success/5" : "border-border bg-muted/30"}`}>
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${a.done ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    <a.icon size={16} />
                  </div>
                  <span className={`text-sm font-medium ${a.done ? "text-foreground" : "text-muted-foreground"}`}>{a.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold text-primary mt-1">{conversionRate}%</p>
            </div>
          </Card>
        </div>

        <Card>
          <p className="text-sm font-semibold mb-4">Recent Leads</p>
          {!recentLeads.length ? (
            <EmptyState title="No leads yet" />
          ) : (
            <div className="divide-y divide-border/60">
              {recentLeads.map((l) => (
                <div key={l.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{l.school_name}</p>
                    <p className="text-xs text-muted-foreground">{l.target_title} · {inr(l.deal_value)}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${l.status === "client" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
