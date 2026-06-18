import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API } from "@/lib/api";

const POLL_MS = 30000;

const EMPTY = {
  kpis: {
    total_partners: 0,
    total_leads: 0,
    total_clients: 0,
    total_revenue: 0,
    pending_revenue: 0,
    conversion_rate: 0,
  },
  monthly: [],
};

function statsApiBase() {
  if (typeof window === "undefined") return API;
  // Deployed site: same-origin /api → Vercel serverless (reads MongoDB directly)
  if (!/^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)) return "/api";
  return API;
}

const publicApi = axios.create();

export default function useLandingStats(brandKey) {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!brandKey) return;
    try {
      publicApi.defaults.baseURL = statsApiBase();
      const { data: res } = await publicApi.get("/stats/landing", { params: { brand: brandKey } });
      setData(res);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [brandKey]);

  useEffect(() => {
    setLoading(true);
    setData(EMPTY);
    setError(null);
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  return { data, loading, error, refresh: load };
}
