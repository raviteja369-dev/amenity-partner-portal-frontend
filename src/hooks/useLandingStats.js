import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";

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

export default function useLandingStats(brandKey) {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!brandKey) return;
    try {
      const { data: res } = await api.get("/stats/landing", { params: { brand: brandKey } });
      setData(res);
      setError(null);
    } catch (err) {
      setError(err);
      setData(EMPTY);
    } finally {
      setLoading(false);
    }
  }, [brandKey]);

  useEffect(() => {
    setLoading(true);
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  return { data, loading, error, refresh: load };
}
