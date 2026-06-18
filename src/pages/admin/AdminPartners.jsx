import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import api, { formatApiError, inr } from "@/lib/api";
import { useBrand } from "@/context/BrandContext";
import {
  PageHeader, DataTable, exportToCsv, StatCard, Card, StatusBadge,
} from "@/components/enterprise";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const emptyForm = { name: "", email: "", password: "", phone: "", city: "", area: "", pin_code: "", brand: "eduosa" };
const PAGE_SIZE = 10;

export default function AdminPartners() {
  const { brands, brandKey, locked } = useBrand();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ brand: "all", city: "", area: "", search: "" });
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (locked) params.brand = brandKey;
      else if (filters.brand !== "all") params.brand = filters.brand;
      if (filters.city) params.city = filters.city;
      if (filters.area) params.area = filters.area;
      if (filters.search) params.search = filters.search;
      const { data } = await api.get("/partners", { params });
      setItems(data);
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setLoading(false);
    }
  }, [filters, locked, brandKey]);

  useEffect(() => { load(); setPage(1); }, [load]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  const columns = [
    {
      key: "name",
      header: "Partner",
      render: (p) => (
        <div>
          <p className="font-medium text-foreground">{p.name}</p>
          <p className="text-xs text-muted-foreground">{p.email}</p>
        </div>
      ),
      csvValue: (p) => p.name,
    },
    {
      key: "brand",
      header: "Brand",
      render: (p) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
          <span className="h-2 w-2 rounded-full" style={{ background: brands[p.brand]?.accentHex }} />
          {brands[p.brand]?.name || p.brand}
        </span>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (p) => <span className="text-sm">{p.city} · {p.area}</span>,
      csvValue: (p) => `${p.city}, ${p.area}`,
    },
    {
      key: "stats",
      header: "Leads / Clients",
      className: "text-right",
      render: (p) => <span className="font-mono-tabular text-sm">{p.leads_count} / {p.clients_count}</span>,
    },
    {
      key: "revenue",
      header: "Revenue",
      className: "text-right",
      render: (p) => <span className="font-mono-tabular text-sm font-medium">{inr(p.total_revenue || 0)}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-28",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={(e) => { e.stopPropagation(); setViewing(p); }} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" aria-label="View">
            <Eye size={15} />
          </button>
          <button type="button" data-testid={`edit-partner-${p.id}`} onClick={(e) => { e.stopPropagation(); openEdit(p); }} className="p-2 rounded-lg hover:bg-muted" aria-label="Edit">
            <Pencil size={15} />
          </button>
          <button type="button" data-testid={`delete-partner-${p.id}`} onClick={(e) => { e.stopPropagation(); remove(p); }} className="p-2 rounded-lg hover:bg-danger/10 text-danger" aria-label="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm, brand: brandKey }); setOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, email: p.email, password: "", phone: p.phone || "", city: p.city, area: p.area, pin_code: p.pin_code, brand: p.brand });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/partners/${editing.id}`, { name: form.name, phone: form.phone, city: form.city, area: form.area, pin_code: form.pin_code, brand: form.brand });
        toast.success("Partner updated");
      } else {
        await api.post("/partners", form);
        toast.success("Partner added");
      }
      setOpen(false);
      load();
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete partner "${p.name}" and all their leads?`)) return;
    try {
      await api.delete(`/partners/${p.id}`);
      toast.success("Partner deleted");
      load();
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };

  const totalLeads = items.reduce((s, p) => s + (p.leads_count || 0), 0);
  const totalRevenue = items.reduce((s, p) => s + (p.total_revenue || 0), 0);

  return (
    <div>
      <PageHeader
        title="Partners"
        description="Manage partner accounts, locations, and performance."
        testid="partners-page-header"
        breadcrumbs={[{ label: "Admin", to: "/admin" }, { label: "Partners" }]}
        actions={
          <button data-testid="add-partner-button" onClick={openCreate} className="btn-primary">
            <Plus size={16} /> Add Partner
          </button>
        }
      />

      <div className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total partners" value={items.length} loading={loading} />
          <StatCard label="Total leads" value={totalLeads} loading={loading} />
          <StatCard label="Total revenue" value={inr(totalRevenue)} loading={loading} />
          <StatCard label="Avg leads per partner" value={items.length ? Math.round(totalLeads / items.length) : 0} loading={loading} />
        </div>

        <Card padding="p-4">
          <div className={`grid grid-cols-1 ${locked ? "md:grid-cols-3" : "md:grid-cols-4"} gap-4`}>
            {!locked && (
              <div>
                <Label className="text-xs text-muted-foreground">Brand</Label>
                <Select value={filters.brand} onValueChange={(v) => setFilters({ ...filters, brand: v })}>
                  <SelectTrigger className="mt-1.5 rounded-lg h-10" data-testid="filter-brand-select"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All verticals</SelectItem>
                    {Object.values(brands).map((b) => <SelectItem key={b.key} value={b.key}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label className="text-xs text-muted-foreground">City</Label>
              <Input data-testid="filter-city-input" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} placeholder="e.g. Mumbai" className="mt-1.5 rounded-lg h-10" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Area</Label>
              <Input data-testid="filter-area-input" value={filters.area} onChange={(e) => setFilters({ ...filters, area: e.target.value })} placeholder="Local area" className="mt-1.5 rounded-lg h-10" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Search</Label>
              <Input data-testid="filter-search-input" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Partner name" className="mt-1.5 rounded-lg h-10" />
            </div>
          </div>
        </Card>

        <DataTable
          columns={columns}
          data={paginated.map((p) => ({ ...p, testid: `partner-row-${p.id}` }))}
          loading={loading}
          emptyTitle="No partners yet"
          emptyHint="Click Add Partner to onboard your first partner."
          onExport={() => exportToCsv("partners.csv", columns.filter((c) => c.key !== "actions"), items)}
          pagination={{ page, pageSize: PAGE_SIZE, total: items.length, onPageChange: setPage }}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-xl border-border max-w-xl" data-testid="partner-form-dialog">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{editing ? "Edit Partner" : "Add Partner"}</DialogTitle>
            <DialogDescription>Onboard a partner with location and credentials.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="grid grid-cols-2 gap-4 mt-2">
            <div className="col-span-2">
              <Label>Full Name</Label>
              <Input data-testid="partner-name-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg h-10 mt-1.5" />
            </div>
            <div>
              <Label>Email</Label>
              <Input data-testid="partner-email-input" required type="email" disabled={!!editing} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg h-10 mt-1.5" />
            </div>
            <div>
              <Label>Password {editing && <span className="text-muted-foreground text-xs">(unchanged)</span>}</Label>
              <Input data-testid="partner-password-input" type="password" disabled={!!editing} required={!editing} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-lg h-10 mt-1.5" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input data-testid="partner-phone-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-lg h-10 mt-1.5" />
            </div>
            {!locked && (
              <div>
                <Label>Brand</Label>
                <Select value={form.brand} onValueChange={(v) => setForm({ ...form, brand: v })}>
                  <SelectTrigger className="rounded-lg h-10 mt-1.5" data-testid="partner-brand-select"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.values(brands).map((b) => <SelectItem key={b.key} value={b.key}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>City</Label>
              <Input data-testid="partner-city-input" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-lg h-10 mt-1.5" />
            </div>
            <div>
              <Label>Local Area</Label>
              <Input data-testid="partner-area-input" required value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="rounded-lg h-10 mt-1.5" />
            </div>
            <div className="col-span-2">
              <Label>PIN code</Label>
              <Input data-testid="partner-pin-input" required value={form.pin_code} onChange={(e) => setForm({ ...form, pin_code: e.target.value })} className="rounded-lg h-10 mt-1.5 font-mono-tabular" />
            </div>
            <DialogFooter className="col-span-2 mt-2 gap-2">
              <button type="button" onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} data-testid="partner-save-button" className="btn-primary">{saving ? "Saving…" : (editing ? "Save changes" : "Add partner")}</button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={!!viewing} onOpenChange={() => setViewing(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {viewing && (
            <>
              <SheetHeader>
                <SheetTitle>{viewing.name}</SheetTitle>
                <SheetDescription>{viewing.email}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Brand</p>
                  <p className="text-sm font-medium mt-1">{brands[viewing.brand]?.name || viewing.brand}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium mt-1">{viewing.city}, {viewing.area}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">PIN {viewing.pin_code}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-border text-center">
                    <p className="text-lg font-bold">{viewing.leads_count}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Leads</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border text-center">
                    <p className="text-lg font-bold">{viewing.clients_count}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Clients</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border text-center">
                    <p className="text-lg font-bold text-sm">{inr(viewing.total_revenue || 0)}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Revenue</p>
                  </div>
                </div>
                <StatusBadge status="active" />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
