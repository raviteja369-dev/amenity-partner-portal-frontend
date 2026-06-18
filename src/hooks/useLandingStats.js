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

// Public stats — no auth header so stale tokens cannot break the landing page.
const publicApi = axios.create({ baseURL: API });

export default function useLandingStats(brandKey) {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!brandKey) return;
    try {
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
};
