import { useCallback, useEffect, useMemo, useState } from "react";
import api, { inr } from "@/lib/api";

const READ_KEY = "pp_notif_read";

function loadReadIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(READ_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveReadIds(ids) {
  localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
}

function timeAgo(iso) {
  if (!iso) return "Recently";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function buildNotifications(leads, partners, role) {
  const items = [];
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

  if (role === "admin" && partners?.length) {
    partners.slice(0, 3).forEach((p) => {
      if (!p.created_at || new Date(p.created_at).getTime() < weekAgo) return;
      items.push({
        id: `partner-${p.id}`,
        type: "partner",
        title: "New partner added",
        message: `${p.name} joined from ${p.city}`,
        time: timeAgo(p.created_at),
        href: "/admin/partners",
        sortAt: new Date(p.created_at).getTime(),
      });
    });
  }

  leads.forEach((l) => {
    const created = l.created_at ? new Date(l.created_at).getTime() : 0;
    const converted = l.converted_at ? new Date(l.converted_at).getTime() : 0;

    if (l.status === "client" && l.payment_status === "unpaid") {
      items.push({
        id: `unpaid-${l.id}`,
        type: "payment",
        title: "Payment pending",
        message: `${l.school_name} · ${inr(l.deal_value)} awaiting payment`,
        time: timeAgo(l.converted_at || l.created_at),
        href: role === "admin" ? "/admin/payments" : "/partner/clients",
        sortAt: converted || created,
      });
    }

    if (l.status === "client" && l.converted_at && converted > weekAgo) {
      items.push({
        id: `converted-${l.id}`,
        type: "conversion",
        title: "Lead converted",
        message: `${l.school_name} is now a client`,
        time: timeAgo(l.converted_at),
        href: role === "admin" ? "/admin/clients" : "/partner/clients",
        sortAt: converted,
      });
    }

    if (l.status === "lead" && created > weekAgo) {
      items.push({
        id: `lead-${l.id}`,
        type: "lead",
        title: role === "admin" ? "New lead" : "New school lead",
        message: role === "admin"
          ? `${l.school_name} · ${l.partner_name || "Partner"}`
          : `${l.school_name} · ${inr(l.deal_value)}`,
        time: timeAgo(l.created_at),
        href: role === "admin" ? "/admin/leads" : "/partner/leads",
        sortAt: created,
      });
    }
  });

  return items
    .sort((a, b) => b.sortAt - a.sortAt)
    .slice(0, 12);
}

export function useNotifications(role) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState(loadReadIds);

  const fetchNotifications = useCallback(async () => {
    if (!role) return;
    setLoading(true);
    try {
      const requests = [api.get("/leads")];
      if (role === "admin") requests.push(api.get("/partners"));
      const results = await Promise.all(requests);
      const leads = results[0].data;
      const partners = role === "admin" ? results[1]?.data : [];
      setNotifications(buildNotifications(leads, partners, role));
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const enriched = useMemo(
    () => notifications.map((n) => ({ ...n, read: readIds.has(n.id) })),
    [notifications, readIds]
  );

  const unreadCount = enriched.filter((n) => !n.read).length;

  const markRead = useCallback((id) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      notifications.forEach((n) => next.add(n.id));
      saveReadIds(next);
      return next;
    });
  }, [notifications]);

  return {
    notifications: enriched,
    unreadCount,
    loading,
    markRead,
    markAllRead,
    refresh: fetchNotifications,
  };
}
