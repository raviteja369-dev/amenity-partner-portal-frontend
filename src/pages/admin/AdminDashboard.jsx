import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import {
  Users, Building2, BadgeCheck, IndianRupee, TrendingUp, Target, Activity,
} from "lucide-react";
import api, { inr } from "@/lib/api";
import { useBrand } from "@/context/BrandContext";
import {
  PageHeader, StatCard, ChartCard, SectionTitle, EmptyState,
  DashboardSkeleton, StaggerContainer, StaggerItem, Card,
} from "@/components/enterprise";

const CHART_COLORS = ["#2563EB", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

export default function AdminDashboard() {
  const { brand, brands, brandKey, locked } = useBrand();
  const [data, setData] = useState(null);
  const [filterByActiveBrand, setFilterByActiveBrand] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    const params = (locked || filterByActiveBrand) ? { brand: brandKey } : {};
    api.get("/dashboard/admin", { params })
      .then((r) => setData(r.data))
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterByActiveBrand, brandKey, locked]); // eslint-disable-line react-hooks/exhaustive-deps

  const k = data?.kpis || {};
  const activePartners = useMemo(() => data?.by_partner?.filter((p) => p.leads > 0).length ?? 0, [data]);
  const conversionRate = k.total_leads ? Math.round((k.total_clients / k.total_leads) * 100) : 0;

  const monthlyData = useMemo(() => {
    if (!data?.by_partner?.length) return [];
    return data.by_partner.slice(0, 6).map((p) => ({
      name: p.partner_name.split(" ")[0],
      leads: p.leads,
      clients: p.clients,
      revenue: p.revenue,
    }));
  }, [data]);

  const statusOverview = useMemo(() => {
    const leads = (k.total_leads || 0) - (k.total_clients || 0);
    return [
      { name: "Leads", value: Math.max(leads, 0), color: "#94A3B8" },
      { name: "Clients", value: k.total_clients || 0, color: "#2563EB" },
    ].filter((s) => s.value > 0);
  }, [k]);

  const activities = useMemo(() => {
    if (!data?.by_partner?.length) return [];
    return data.by_partner.slice(0, 5).map((p, i) => ({
      id: p.partner_id,
      text: `${p.partner_name} generated ${p.leads} leads`,
      sub: `${p.clients} converted · ${inr(p.revenue)} revenue`,
      time: `${i + 1}h ago`,
    }));
  }, [data]);

  if (loading && !data) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Monitor partners, leads, conversions, and revenue across your pipeline."
        testid="admin-dashboard-header"
        breadcrumbs={[{ label: "Admin", to: "/admin" }, { label: "Dashboard" }]}
        actions={
          !locked ? (
            <label className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                data-testid="filter-by-brand-toggle"
                checked={filterByActiveBrand}
                onChange={(e) => setFilterByActiveBrand(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-muted-foreground">Filter to {brand.name}</span>
            </label>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm">
              <span className="h-2 w-2 rounded-full" style={{ background: brand.accentHex }} />
              {brand.name} only
            </span>
          )
        }
      />

      <div className="p-6 lg:p-8 space-y-8">
        {error && (
          <Card className="border-danger/30 bg-danger/5 text-sm text-danger">{error}</Card>
        )}

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
          <StaggerItem><StatCard label="Total partners" value={k.total_partners ?? 0} icon={Users} loading={loading} testid="kpi-partners" /></StaggerItem>
          <StaggerItem><StatCard label="Active partners" value={activePartners} icon={Activity} loading={loading} sub="With at least one lead" /></StaggerItem>
          <StaggerItem><StatCard label="Total leads" value={k.total_leads ?? 0} icon={Building2} loading={loading} testid="kpi-leads" /></StaggerItem>
          <StaggerItem><StatCard label="Converted leads" value={k.total_clients ?? 0} icon={BadgeCheck} loading={loading} testid="kpi-clients" /></StaggerItem>
          <StaggerItem><StatCard label="Revenue" value={inr(k.total_revenue || 0)} icon={IndianRupee} loading={loading} testid="kpi-revenue" /></StaggerItem>
          <StaggerItem><StatCard label="Conversion rate" value={`${conversionRate}%`} icon={Target} loading={loading} trend={`${conversionRate}% of leads`} trendUp={conversionRate > 20} /></StaggerItem>
        </StaggerContainer>

        <div className="grid lg:grid-cols-2 gap-6">
          <ChartCard title="Partner Performance" description="Leads vs clients by partner" testid="chart-partner-ranking">
            {!monthlyData.length ? (
              <EmptyState title="No partner activity yet" hint="Add partners and capture leads to see rankings." />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#64748B" }} width={80} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
                  <Bar dataKey="leads" name="Leads" fill="#2563EB" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="clients" name="Clients" fill="#22C55E" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Revenue Analytics" description="Revenue by top partners" testid="chart-revenue">
            {!monthlyData.length ? (
              <EmptyState title="No revenue data" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
                  <Tooltip formatter={(v) => inr(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#2563EB" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <ChartCard title="Leads by Area" description="Geographic distribution" className="lg:col-span-1" testid="chart-leads-by-area">
            {!data?.by_area?.length ? <EmptyState title="No area data" /> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.by_area.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="area" tick={{ fontSize: 10, fill: "#64748B" }} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="leads" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Lead Status" description="Pipeline breakdown" className="lg:col-span-1">
            {!statusOverview.length ? <EmptyState title="No pipeline data" /> : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={statusOverview} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {statusOverview.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="By Vertical" description="Brand distribution" className="lg:col-span-1" testid="chart-by-brand">
            {!data?.by_brand?.length ? <EmptyState title="No brand data" /> : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={data.by_brand} dataKey="leads" nameKey="brand" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {data.by_brand.map((b, i) => (
                      <Cell key={i} fill={brands[b.brand]?.accentHex || CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend formatter={(v) => brands[v]?.name || v} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <SectionTitle>Top Performing Partners</SectionTitle>
            <div className="space-y-3" data-testid="leaderboard-list">
              {!data?.by_partner?.length ? (
                <EmptyState title="No partners yet" />
              ) : (
                data.by_partner.slice(0, 6).map((p, i) => (
                  <div key={p.partner_id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.partner_name}</p>
                      <p className="text-xs text-muted-foreground">{p.city} · {brands[p.brand]?.name || p.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold font-mono-tabular">{p.leads} leads</p>
                      <p className="text-xs text-muted-foreground">{inr(p.revenue)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <SectionTitle right={<TrendingUp size={16} className="text-muted-foreground" />}>Recent Activity</SectionTitle>
            <div className="space-y-3">
              {!activities.length ? (
                <EmptyState title="No recent activity" />
              ) : (
                activities.map((a) => (
                  <div key={a.id} className="flex gap-3 p-3 rounded-lg border border-border/60">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{a.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.sub}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
