import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BrandMark from "@/components/BrandMark";
import BrandSwitcher from "@/components/BrandSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useBrand } from "@/context/BrandContext";
import { formatApiError } from "@/lib/api";
import { FadeIn } from "@/components/enterprise";

export default function Login() {
  const { login, user, bootstrapping } = useAuth();
  const { locked } = useBrand();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bootstrapping || !user) return;
    navigate(user.role === "admin" ? "/admin" : "/partner", { replace: true });
  }, [bootstrapping, user, navigate]);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      const u = await login(email.trim().toLowerCase(), password);
      if (remember) localStorage.setItem("pp_remember", email.trim().toLowerCase());
      toast.success(`Welcome back, ${u.name}`);
      navigate(u.role === "admin" ? "/admin" : "/partner", { replace: true });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid" />
        </div>
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <div className="relative p-10">
          <BrandMark size="md" showParent />
        </div>

        <div className="relative px-10 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-medium text-primary-foreground/70 uppercase tracking-wide mb-4">Partner Portal</p>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
              Manage your pipeline with confidence
            </h1>
            <p className="mt-4 text-primary-foreground/80 text-base max-w-md leading-relaxed">
              Track school leads, convert clients, and monitor revenue — all from one enterprise-grade dashboard.
            </p>
          </motion.div>

          {!locked && (
            <div className="mt-10">
              <BrandSwitcher />
            </div>
          )}

          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              { n: "500+", l: "Schools" },
              { n: "98%", l: "Uptime" },
              { n: "₹2Cr+", l: "Tracked" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-white/10 backdrop-blur p-4">
                <p className="text-2xl font-bold">{s.n}</p>
                <p className="text-xs text-primary-foreground/70 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col min-h-screen">
        <div className="p-6 lg:p-8 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="back-home-link">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div className="lg:hidden"><BrandMark size="sm" /></div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
          <FadeIn className="w-full max-w-md">
            <div className="enterprise-card p-8 shadow-elevated">
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Partner sign in</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">Enter your partner credentials to access the portal</p>
              </div>

              <form onSubmit={submit} data-testid="login-form" autoComplete="off" className="space-y-5">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                  <div className="relative mt-1.5">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      data-testid="login-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                      className={`rounded-lg h-11 pl-10 ${errors.email ? "border-danger focus-visible:ring-danger" : ""}`}
                      autoComplete="off"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <button type="button" className="text-xs text-primary hover:underline font-medium">Forgot password?</button>
                  </div>
                  <div className="relative mt-1.5">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      data-testid="login-password-input"
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                      className={`rounded-lg h-11 pl-10 pr-10 ${errors.password ? "border-danger focus-visible:ring-danger" : ""}`}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>

                <motion.button
                  type="submit"
                  disabled={busy}
                  data-testid="login-submit-button"
                  whileHover={{ scale: busy ? 1 : 1.01 }}
                  whileTap={{ scale: busy ? 1 : 0.99 }}
                  className="w-full btn-primary h-11 text-sm font-semibold shadow-md"
                >
                  {busy ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                      Signing in…
                    </span>
                  ) : (
                    <>Sign in <ArrowRight size={16} /></>
                  )}
                </motion.button>
              </form>

              <Link
                to="/admin/login"
                className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg py-2.5"
                data-testid="admin-login-link"
              >
                <Shield size={15} />
                Administrator? Sign in to admin console
              </Link>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              Protected by enterprise-grade security
            </p>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
