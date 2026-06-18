import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowRightCircle, Check } from "lucide-react";
import api, { formatApiError, inr } from "@/lib/api";
import { PageHeader, DataTable, StatusBadge, Card } from "@/components/enterprise";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const CLASSES = Array.from({ length: 12 }, (_, i) => i + 1);
const emptyForm = { school_name: "", description: "", address: "", target_title: "", deal_value: "", target_classes: [] };

export default function PartnerLeads({ filter = "all" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter === "clients" ? { status: "client" } : {};
      const { data } = await api.get("/leads", { params });
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const filtered = items.filter((l) =>
    !search || l.school_name.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (l) => {
    setEditing(l);
    setForm({
      school_name: l.school_name, description: l.description || "", address: l.address,
      target_title: l.target_title, deal_value: String(l.deal_value),
      target_classes: [...(l.target_classes || [])],
    });
    setOpen(true);
  };

  const toggleClass = (c) => {
    setForm((f) => f.target_classes.includes(c)
      ? { ...f, target_classes: f.target_classes.filter((x) => x !== c) }
      : { ...f, target_classes: [...f.target_classes, c].sort((a, b) => a - b) });
  };

  const save = async (e) => {
    e.preventDefault();
    if (form.target_classes.length === 0) { toast.error("Select at least one Target Class"); return; }
    setSaving(true);
    try {
      const payload = { ...form, deal_value: parseFloat(form.deal_value) };
      if (editing) { await api.put(`/leads/${editing.id}`, payload); toast.success("Lead updated"); }
      else { await api.post("/leads", payload); toast.success("School lead added"); }
      setOpen(false);
      load();
    } catch (err) { toast.error(formatApiError(err)); }
    finally { setSaving(false); }
  };

  const convert = async (l) => {
    try { await api.post(`/leads/${l.id}/convert`); toast.success(`${l.school_name} marked as Client`); load(); setSelected(null); }
    catch (e) { toast.error(formatApiError(e)); }
  };

  const togglePayment = async (l) => {
    const next = l.payment_status === "paid" ? "unpaid" : "paid";
    try { await api.put(`/leads/${l.id}/payment`, { payment_status: next }); toast.success(`Payment marked ${next.toUpperCase()}`); load(); }
    catch (e) { toast.error(formatApiError(e)); }
  };

  const remove = async (l) => {
    if (!window.confirm(`Delete "${l.school_name}"?`)) return;
    try { await api.delete(`/leads/${l.id}`); toast.success("Deleted"); load(); setSelected(null); }
    catch (e) { toast.error(formatApiError(e)); }
  };

  const titles = filter === "clients"
    ? { eyebrow: "Client Management", title: "My Clients", desc: "Converted leads. Mark payment status.", breadcrumb: "Clients" }
    : { eyebrow: "Lead Management", title: "My School Leads", desc: "Add schools, set target classes, and track conversions.", breadcrumb: "Leads" };

  const columns = [
    {
      key: "school",
      header: "School",
      render: (l) => (
        <div>
          <p className="font-medium">{l.school_name}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{l.address}</p>
        </div>
      ),
    },
    { key: "target_title", header: "Target" },
    {
      key: "classes",
      header: "Classes",
      render: (l) => (
        <div className="flex flex-wrap gap-1">
          {(l.target_classes || []).map((c) => (
            <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-mono-tabular">{c}</span>
          ))}
        </div>
      ),
    },
    {
      key: "deal_value",
      header: "Deal",
      className: "text-right",
      render: (l) => <span className="font-mono-tabular text-sm font-medium">{inr(l.deal_value)}</span>,
    },
    {
      key: "status",
      header: "Status",
      className: "text-right",
      render: (l) => (
        <div className="flex items-center justify-end gap-1.5">
          <StatusBadge status={l.status} />
          {l.status === "client" && <StatusBadge status={l.payment_status} />}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-36",
      render: (l) => (
        <div className="flex items-center justify-end gap-1">
          {l.status === "lead" && (
            <button data-testid={`convert-lead-${l.id}`} onClick={(e) => { e.stopPropagation(); convert(l); }} className="btn-secondary h-8 px-2 text-[10px]">
              <ArrowRightCircle size={12} /> Convert
            </button>
          )}
          {l.status === "client" && (
            <button data-testid={`toggle-payment-${l.id}`} onClick={(e) => { e.stopPropagation(); togglePayment(l); }} className={cn("h-8 px-2 text-[10px] rounded-lg font-medium", l.payment_status === "paid" ? "bg-success/10 text-success" : "btn-secondary")}>
              <Check size={12} /> {l.payment_status === "paid" ? "Paid" : "Mark Paid"}
            </button>
          )}
          <button data-testid={`edit-lead-${l.id}`} onClick={(e) => { e.stopPropagation(); openEdit(l); }} className="p-2 rounded-lg hover:bg-muted"><Pencil size={14} /></button>
          <button data-testid={`delete-lead-${l.id}`} onClick={(e) => { e.stopPropagation(); remove(l); }} className="p-2 rounded-lg hover:bg-danger/10 text-danger"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={titles.title}
        description={titles.desc}
        testid={`partner-${filter}-header`}
        breadcrumbs={[{ label: "Partner", to: "/partner" }, { label: titles.breadcrumb }]}
        actions={filter === "all" && (
          <button data-testid="add-lead-button" onClick={openCreate} className="btn-primary">
            <Plus size={16} /> Add School Lead
          </button>
        )}
      />

      <div className="p-6 lg:p-8 space-y-6">
        <DataTable
          columns={columns}
          data={filtered.map((l) => ({ ...l, testid: `mylead-row-${l.id}` }))}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search schools…"
          emptyTitle={filter === "clients" ? "No clients yet" : "No leads yet"}
          emptyHint={filter === "clients" ? "Convert a lead to a client." : "Click Add School Lead to start."}
          onRowClick={setSelected}
        />
      </div>

      <Sheet open={!!selected && !open} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.school_name}</SheetTitle>
                <SheetDescription>{selected.address}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex gap-2">
                  <StatusBadge status={selected.status} />
                  {selected.status === "client" && <StatusBadge status={selected.payment_status} />}
                </div>
                <Card padding="p-4" className="space-y-2">
                  <p className="text-xs text-muted-foreground">Target · {selected.target_title}</p>
                  <p className="text-lg font-bold">{inr(selected.deal_value)}</p>
                  <p className="text-xs text-muted-foreground">Classes: {(selected.target_classes || []).join(", ")}</p>
                </Card>
                {selected.description && (
                  <div className="p-3 rounded-lg bg-muted/40">
                    <p className="text-[10px] uppercase text-muted-foreground font-medium">Notes</p>
                    <p className="text-sm mt-1">{selected.description}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  {selected.status === "lead" && (
                    <button onClick={() => convert(selected)} className="btn-primary flex-1"><ArrowRightCircle size={14} /> Convert</button>
                  )}
                  {selected.status === "client" && (
                    <button onClick={() => togglePayment(selected)} className="btn-primary flex-1"><Check size={14} /> Toggle Payment</button>
                  )}
                  <button onClick={() => { openEdit(selected); setSelected(null); }} className="btn-secondary"><Pencil size={14} /> Edit</button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-xl border-border max-w-2xl" data-testid="lead-form-dialog">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{editing ? "Edit School Lead" : "Add School Lead"}</DialogTitle>
            <DialogDescription>Capture school details and target classes 1–12.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>School Name</Label>
                <Input data-testid="lead-school-name-input" required value={form.school_name} onChange={(e) => setForm({ ...form, school_name: e.target.value })} className="rounded-lg h-10 mt-1.5" />
              </div>
              <div className="col-span-2">
                <Label>Description / Notes</Label>
                <Textarea data-testid="lead-description-input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg mt-1.5" />
              </div>
              <div className="col-span-2">
                <Label>Address</Label>
                <Input data-testid="lead-address-input" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-lg h-10 mt-1.5" />
              </div>
              <div>
                <Label>Target Title</Label>
                <Input data-testid="lead-target-title-input" required value={form.target_title} onChange={(e) => setForm({ ...form, target_title: e.target.value })} className="rounded-lg h-10 mt-1.5" placeholder="e.g. Pilot Program" />
              </div>
              <div>
                <Label>Deal Value (₹)</Label>
                <Input data-testid="lead-deal-value-input" required type="number" min="0" step="1" value={form.deal_value} onChange={(e) => setForm({ ...form, deal_value: e.target.value })} className="rounded-lg h-10 mt-1.5 font-mono-tabular" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Target Classes <span className="text-muted-foreground text-xs">(1–12)</span></Label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setForm((f) => ({ ...f, target_classes: CLASSES }))} data-testid="lead-classes-all" className="text-xs font-medium text-primary hover:underline">All</button>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, target_classes: [] }))} data-testid="lead-classes-clear" className="text-xs font-medium text-muted-foreground hover:underline">Clear</button>
                </div>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                {CLASSES.map((c) => {
                  const active = form.target_classes.includes(c);
                  return (
                    <button
                      type="button"
                      key={c}
                      data-testid={`lead-class-${c}`}
                      onClick={() => toggleClass(c)}
                      className={cn("h-10 rounded-lg border text-sm font-semibold font-mono-tabular transition-all", active ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card border-border hover:bg-muted")}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <button type="button" onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} data-testid="lead-save-button" className="btn-primary">{saving ? "Saving…" : (editing ? "Save changes" : "Add lead")}</button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
