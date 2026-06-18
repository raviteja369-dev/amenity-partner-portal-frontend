import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight, ArrowLeft, Mail, Lock, Eye, EyeOff,
  Shield, Users, BarChart3, Wallet,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";

const features = [
  { icon: Users, label: "Partner management" },
  { icon: BarChart3, label: "Pipeline analytics" },
  { icon: Wallet, label: "Payment oversight" },
];

export default function AdminLogin() {
  const { login, logout, user, bootstrapping } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bootstrapping) return;
    if (user?.role === "admin") navigate("/admin", { replace: true });
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
      if (u.role !== "admin") {
        await logout();
        toast.error("Access denied. Admin credentials required.");
        return;
      }
      toast.success(`Welcome, ${u.name}`);
      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex flex-col lg:flex-row">
      {/* Admin hero — dark, distinct from partner login */}
      <div className="relative flex-1 flex flex-col justify-between p-8 lg:p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(99,102,241,0.25)_0%,_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(59,130,246,0.12)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors" data-testid="admin-back-home">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>

        <div className="relative my-10 lg:my-0 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 mb-6">
            <Shield size={14} />
            Administrative access only
          </div>
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
            Admin Console
          </h1>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            Secure portal for Amenity Forge administrators. Manage partners, monitor leads, and oversee payments across all verticals.
          </p>

          <ul className="mt-10 space-y-4">
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-slate-300">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  <Icon size={18} className="text-indigo-400" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-600 hidden lg:block">
          Amenity Forge Partner Portal · Admin
        </p>
      </div>

      {/* Login card */}
      <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 flex items-center justify-center p-6 lg:p-10 bg-[#111827] border-t lg:border-t-0 lg:border-l border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900/50 mb-8">
            <Shield size={28} className="text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white">Sign in as admin</h2>
          <p className="mt-2 text-sm text-slate-400">
            Use your administrator email and password
          </p>

          <form onSubmit={submit} data-testid="admin-login-form" autoComplete="off" className="mt-8 space-y-5">
            <div>
              <Label htmlFor="admin-email" className="text-sm font-medium text-slate-300">Admin email</Label>
              <div className="relative mt-1.5">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <Input
                  id="admin-email"
                  data-testid="admin-login-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                  className={`rounded-lg h-11 pl-10 bg-[#1F2937] border-white/10 text-white placeholder:text-slate-500 ${errors.email ? "border-red-500" : ""}`}
                  placeholder="admin@company.com"
                  autoComplete="off"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="admin-password" className="text-sm font-medium text-slate-300">Password</Label>
              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <Input
                  id="admin-password"
                  data-testid="admin-login-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                  className={`rounded-lg h-11 pl-10 pr-10 bg-[#1F2937] border-white/10 text-white placeholder:text-slate-500 ${errors.password ? "border-red-500" : ""}`}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={busy}
              data-testid="admin-login-submit"
              whileHover={{ scale: busy ? 1 : 1.01 }}
              whileTap={{ scale: busy ? 1 : 0.99 }}
              className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {busy ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Verifying…
                </>
              ) : (
                <>Access admin dashboard <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Partner account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
