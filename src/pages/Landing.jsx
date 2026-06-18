import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Building2, Wallet, BarChart3, CheckCircle2,
  Shield, Zap, Users, TrendingUp, ChevronRight, BookOpen, Megaphone,
  Target, LineChart, Cpu, Workflow, Wrench, Layers,
} from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { useBrand } from "@/context/BrandContext";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/enterprise";
import useLandingStats from "@/hooks/useLandingStats";
import { inrCompact } from "@/lib/api";

const BRAND_CAPABILITIES = {
  eduosa: {
    subtitle: "Built for Edu Tech partners — manage school pipelines, product demos, and revenue in one place.",
    items: [
      { icon: BarChart3, title: "Real-time Analytics", body: "Track school leads, conversions, and Edu Tech revenue with live dashboards and interactive charts." },
      { icon: Building2, title: "School Lead Management", body: "Capture school details, target classes, and deal values in under 60 seconds." },
      { icon: BookOpen, title: "Product Catalog", body: "Present Edu Tech offerings to schools and map the right solutions to each institution." },
      { icon: CheckCircle2, title: "Client Conversion", body: "Convert school leads to active clients with one click and track the full pipeline." },
      { icon: Wallet, title: "Payment Ledger", body: "Mark payments paid or unpaid and monitor Edu Tech earnings in INR automatically." },
      { icon: Shield, title: "Enterprise Security", body: "Role-based access, secure authentication, and encrypted data storage." },
    ],
  },
  "c-forgia": {
    subtitle: "Built for CRM and digital marketing partners — run campaigns, nurture leads, and close B2B deals faster.",
    items: [
      { icon: Target, title: "CRM Pipeline", body: "Manage consultative B2B school partnerships from first contact to signed contract." },
      { icon: Megaphone, title: "Campaign Tracking", body: "Monitor digital marketing campaigns, outreach performance, and lead source attribution." },
      { icon: LineChart, title: "Conversion Analytics", body: "Measure funnel performance with live dashboards for leads, clients, and marketing ROI." },
      { icon: Users, title: "Lead Nurturing", body: "Capture prospect details, follow-up stages, and deal values across your sales pipeline." },
      { icon: Wallet, title: "Payment Ledger", body: "Track commissions and client payments in INR with a clear paid vs pending view." },
      { icon: Zap, title: "Lightning Fast", body: "Built for field teams with instant updates and a responsive mobile-first design." },
    ],
  },
  facilo: {
    subtitle: "Built for custom product engineering partners — scope projects, track delivery, and manage automation deals.",
    items: [
      { icon: Wrench, title: "Project Pipeline", body: "Track custom engineering engagements from discovery through delivery and handoff." },
      { icon: Cpu, title: "Automation Tracking", body: "Monitor automation deployments, milestones, and technical rollout status in one view." },
      { icon: Layers, title: "Requirements Capture", body: "Document product specs, scope, and deal values for every engineering opportunity." },
      { icon: Workflow, title: "Delivery Workflow", body: "Convert qualified leads to active clients and follow progress through each stage." },
      { icon: Wallet, title: "Payment Ledger", body: "Mark milestone payments paid or unpaid and monitor engineering revenue in INR." },
      { icon: Shield, title: "Enterprise Security", body: "Role-based access, secure authentication, and encrypted project data." },
    ],
  },
};

export default function Landing() {
  const { brand, brands, parent, locked, setBrand } = useBrand();
  const visibleBrands = locked ? [brand] : Object.values(brands);
  const capabilities = BRAND_CAPABILITIES[brand.key] || BRAND_CAPABILITIES.eduosa;
  const { data: stats, loading: statsLoading } = useLandingStats(brand.key);
  const k = stats.kpis;

  const heroMetrics = useMemo(() => ([
    { label: "Leads", value: statsLoading ? "…" : String(k.total_leads) },
    { label: "Clients", value: statsLoading ? "…" : String(k.total_clients) },
    { label: "Revenue", value: statsLoading ? "…" : inrCompact(k.total_revenue) },
    { label: "Pending", value: statsLoading ? "…" : inrCompact(k.pending_revenue) },
  ]), [k, statsLoading]);

  const bottomStats = useMemo(() => ([
    { value: statsLoading ? "…" : String(k.total_partners), label: "Active Partners" },
    { value: statsLoading ? "…" : inrCompact(k.total_revenue), label: "Revenue Tracked" },
    { value: statsLoading ? "…" : `${k.conversion_rate}%`, label: "Conversion Rate" },
    { value: statsLoading ? "…" : String(k.total_leads), label: "Total Leads" },
  ]), [k, statsLoading]);

  const chartBars = useMemo(() => {
    const points = stats.monthly?.length
      ? stats.monthly.map((m) => m.leads)
      : [0, 0, 0, 0, 0, 0, 0];
    const max = Math.max(...points, 1);
    return points.map((n) => Math.round((n / max) * 100));
  }, [stats.monthly]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandMark size="sm" showParent />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#why" className="hover:text-foreground transition-colors">Why Us</a>
          </nav>
          <Link to="/login" data-testid="nav-login-link" className="btn-primary h-9 text-sm">
            Sign in <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {!locked && (
        <section className="border-b border-border/60 bg-card/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Choose your vertical</p>
            <div className="flex flex-wrap gap-2" data-testid="vertical-top-selector">
              {Object.values(brands).map((b) => (
                <button
                  key={b.key}
                  onClick={() => setBrand(b.key)}
                  data-testid={`vertical-top-${b.key}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    b.key === brand.key ? "bg-primary text-primary-foreground shadow-sm" : "border border-border hover:bg-muted"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: b.accentHex }} />
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="brand-pill mb-6" data-testid="hero-pill">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {parent.name} · {brand.name}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                The partner platform for{" "}
                <span className="text-primary">{brand.name}</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
                {brand.tagline}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login" data-testid="hero-cta-login" className="btn-primary h-12 px-6 text-base shadow-md">
                  Get Started <ArrowRight size={18} />
                </Link>
                <a href="#features" className="btn-secondary h-12 px-6 text-base">What&apos;s inside</a>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="relative">
                <div className="rounded-2xl border border-border/60 bg-card shadow-float overflow-hidden aspect-[4/3]">
                  <div className="gradient-mesh h-full p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Live Dashboard</span>
                      <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {heroMetrics.map((m) => (
                        <div key={m.label} className="rounded-xl bg-white/80 backdrop-blur p-4 shadow-sm">
                          <p className="text-[10px] text-muted-foreground uppercase">{m.label}</p>
                          <p className="text-xl font-bold mt-1 font-mono-tabular">{m.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl bg-white/80 backdrop-blur p-4 shadow-sm">
                      <div className="flex items-end gap-1 h-16">
                        {chartBars.map((h, i) => (
                          <motion.div
                            key={`${brand.key}-${i}`}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(h, 8)}%` }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                            className="flex-1 rounded-sm bg-primary/80"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/60 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <StaggerContainer key={brand.key} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {bottomStats.map((s) => (
              <StaggerItem key={s.label} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-primary font-mono-tabular">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-wide mb-3">Capabilities</p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Everything you need for {brand.name}
            </h2>
            <p className="mt-4 text-muted-foreground">{capabilities.subtitle}</p>
          </FadeIn>
          <StaggerContainer key={brand.key} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.items.map((f) => (
              <StaggerItem key={f.title}>
                <div className="enterprise-card-hover p-6 h-full">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <f.icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Why choose us */}
      <section id="why" className="py-20 lg:py-28 bg-card border-y border-border/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <p className="text-sm font-medium text-primary uppercase tracking-wide mb-3">Why Choose Us</p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Built for the field, not finance teams</h2>
            <ul className="mt-8 space-y-4">
              {[
                { icon: Users, text: "Personal dashboard with leads, clients, and pending revenue" },
                { icon: TrendingUp, text: "Real-time analytics and performance tracking" },
                { icon: CheckCircle2, text: "One-click lead to client conversion workflow" },
                { icon: Wallet, text: "Complete payment ledger with INR tracking" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon size={16} />
                  </div>
                  <span className="text-sm text-foreground leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
            <Link to="/login" data-testid="partners-cta-login" className="btn-primary mt-8 h-12 px-6">
              Partner sign in <ChevronRight size={16} />
            </Link>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-border bg-background p-8 shadow-elevated">
              <div className="space-y-6">
                {["Lead captured", "Converted to client", "Payment received"].map((step, i) => (
                  <div key={step} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-sm font-medium whitespace-nowrap">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-mesh">
        <FadeIn className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Ready to transform your pipeline?</h2>
          <p className="mt-4 text-muted-foreground text-lg">Join hundreds of partners already using the platform.</p>
          <Link to="/login" className="btn-primary mt-8 h-12 px-8 text-base inline-flex shadow-md">
            Start now <ArrowRight size={18} />
          </Link>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 grid md:grid-cols-3 gap-8">
          <div>
            <p className="text-xl font-bold">{parent.name}</p>
            <p className="mt-3 text-sm text-background/70 max-w-sm">{parent.description}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-background/50 uppercase tracking-wide mb-3">{locked ? "Vertical" : "Verticals"}</p>
            <ul className="space-y-2 text-sm">
              {visibleBrands.map((b) => (
                <li key={b.key} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: b.accentHex }} />
                  {b.label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-background/50 uppercase tracking-wide mb-3">Portal</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:underline">Partner sign in</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 text-xs text-background/50 flex justify-between">
            <span>© {new Date().getFullYear()} {parent.name}</span>
            <span>Partner Portal v2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
