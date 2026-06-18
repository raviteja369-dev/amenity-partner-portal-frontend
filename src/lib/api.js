import axios from "axios";

const PRODUCTION_BACKEND =
  "https://amenity-partner-portal-backend-production.up.railway.app";

function resolveApiBase() {
  // Local dev: same-origin /api (webpack proxy → localhost:5000)
  if (typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)) {
    return "/api";
  }
  if (process.env.NODE_ENV === "development") return "/api";
  const url = (process.env.REACT_APP_BACKEND_URL || PRODUCTION_BACKEND).replace(/\/$/, "");
  return `${url}/api`;
}

export const API = resolveApiBase();

const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("pp_token");
      localStorage.removeItem("pp_user");
    }
    return Promise.reject(err);
  }
);

export default api;

export function formatApiError(err) {
  const detail = err?.response?.data?.detail;
  if (detail == null) return err?.message || "Something went wrong";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e?.msg ? e.msg : JSON.stringify(e))).join(" • ");
  if (detail?.msg) return detail.msg;
  return JSON.stringify(detail);
}

export function inr(n) {
  const v = Number(n || 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

export function inrCompact(n) {
  const v = Number(n || 0);
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(1).replace(/\.0$/, "")}Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(1).replace(/\.0$/, "")}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return inr(v);
}
