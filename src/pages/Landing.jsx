import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Building2, Wallet, BarChart3, CheckCircle2, Star,
  Shield, Zap, Users, TrendingUp, ChevronRight,
} from "lucide-react";
import BrandMark from "@/components/BrandMark";
import BrandSwitcher from "@/components/BrandSwitcher";
import { useBrand } from "@/context/BrandContext";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/enterprise";

const STATS = [
  { value: "500+", label: "Partner Schools" },
  { value: "₹2Cr+", label: "Revenue Tracked" },
  { value: "98%", label: "Partner Satisfaction" },
  { value: "3", label: "Brand Verticals" },
];

const FEATURES = [
  { icon: BarChart3, title: "Real-time Analytics", body: "Track leads, conversions, and revenue with live dashboards and interactive charts." },
  { icon: Building2, title: "Lead Management", body: "Capture school details, target classes, and deal values in under 60 seconds." },
  { icon: CheckCircle2, title: "Client Conversion", body: "Convert leads to clients with one click and track the full pipeline." },
  { icon: Wallet, title: "Payment Ledger", body: "Mark payments paid or unpaid and monitor earnings in INR automatically." },
  { icon: Shield, title: "Enterprise Security", body: "Role-based access, secure authentication, and encrypted data storage." },
  { icon: Zap, title: "Lightning Fast", body: "Built for speed with instant updates and a responsive mobile-first design." },
];

const TESTIMONIALS = [
  { quote: "This portal transformed how we manage our school partnerships. Everything is in one place.", name: "Aarav Mehta", role: "Eduosa Partner, Mumbai" },
  { quote: "The conversion tracking alone saved us hours every week. Highly recommended for field teams.", name: "Priya Sharma", role: "C-Forgia Partner, Bengaluru" },
  { quote: "Clean, fast, and professional. Our partners love the dashboard experience.", name: "Rahul Iyer", role: "Facilo Partner, Pune" },
];

export default function Landing() {
  const { brand, brands, parent, locked, setBrand } = useBrand();
  const visibleBrands = locked ? [brand] : Object.values(brands);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandMark size="sm" showParent />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#why" className="hover:text-foreground transition-colors">Why Us</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
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
                {brand.tagline} Track every school lead, conversion, and rupee — without spreadsheets or guesswork.
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
                      {["Leads", "Clients", "Revenue", "Pending"].map((l, i) => (
                        <div key={l} className="rounded-xl bg-white/80 backdrop-blur p-4 shadow-sm">
                          <p className="text-[10px] text-muted-foreground uppercase">{l}</p>
                          <p className="text-xl font-bold mt-1">{["24", "8", "₹4.2L", "₹1.1L"][i]}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl bg-white/80 backdrop-blur p-4 shadow-sm">
                      <div className="flex items-end gap-1 h-16">
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
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
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <StaggerItem key={s.label} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-primary">{s.value}</p>
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
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Everything you need to grow</h2>
            <p className="mt-4 text-muted-foreground">Built for partners in the field — manage your entire pipeline from one powerful platform.</p>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
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

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <p className="text-sm font-medium text-primary uppercase tracking-wide mb-3">Testimonials</p>
            <h2 className="text-3xl font-bold tracking-tight">Trusted by partners nationwide</h2>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <StaggerItem key={t.name}>
                <div className="enterprise-card p-6 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-warning text-warning" />)}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
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
