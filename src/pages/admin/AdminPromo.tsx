import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, Upload, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePromo, PromoCombo } from "@/hooks/usePromo";

const blankCombo: Omit<PromoCombo, "id"> = {
  name: "",
  description: "",
  image_url: "",
  price: 150,
  stock: 10,
  sort_order: 0,
  is_active: true,
};

const AdminPromo = () => {
  const { toast } = useToast();
  const { settings, combos, refresh, loading } = usePromo();
  const [savingSettings, setSavingSettings] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<PromoCombo, "id">>(blankCombo);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Local mirror of settings for editing
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [atomizerActive, setAtomizerActive] = useState(false);

  useEffect(() => {
    if (settings) {
      setHeadline(settings.headline);
      setSubheadline(settings.subheadline);
      setIsActive(settings.is_active);
      setAtomizerActive(settings.atomizer_offer_active);
    }
  }, [settings]);

  const saveSettings = async (override?: Partial<{ is_active: boolean; atomizer_offer_active: boolean }>) => {
    if (!settings) return;
    setSavingSettings(true);
    const { error } = await supabase
      .from("launch_promo_settings")
      .update({
        headline,
        subheadline,
        is_active: override?.is_active ?? isActive,
        atomizer_offer_active: override?.atomizer_offer_active ?? atomizerActive,
      })
      .eq("id", settings.id);
    if (error) toast({ title: error.message, variant: "destructive" });
    else toast({ title: "Promo settings saved" });
    setSavingSettings(false);
    refresh();
  };

  const togglePromo = async () => {
    const next = !isActive;
    setIsActive(next);
    await saveSettings({ is_active: next });
  };

  const toggleAtomizer = async () => {
    const next = !atomizerActive;
    setAtomizerActive(next);
    await saveSettings({ atomizer_offer_active: next });
  };

  const startEdit = (c: PromoCombo) => {
    setEditingId(c.id);
    setCreating(false);
    setForm({
      name: c.name,
      description: c.description || "",
      image_url: c.image_url || "",
      price: Number(c.price),
      stock: c.stock,
      sort_order: c.sort_order,
      is_active: c.is_active,
    });
  };

  const saveCombo = async () => {
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    const payload = {
      name: form.name,
      description: form.description || null,
      image_url: form.image_url || null,
      price: Number(form.price),
      stock: Number(form.stock),
      sort_order: Number(form.sort_order),
      is_active: form.is_active,
    };
    const { error } = editingId
      ? await supabase.from("promo_combos").update(payload).eq("id", editingId)
      : await supabase.from("promo_combos").insert([payload]);
    if (error) toast({ title: error.message, variant: "destructive" });
    else {
      toast({ title: editingId ? "Combo updated" : "Combo created" });
      setCreating(false);
      setEditingId(null);
      setForm(blankCombo);
      refresh();
    }
  };

  const deleteCombo = async (id: string) => {
    if (!confirm("Delete this combo?")) return;
    const { error } = await supabase.from("promo_combos").delete().eq("id", id);
    if (error) toast({ title: error.message, variant: "destructive" });
    else {
      toast({ title: "Combo deleted" });
      refresh();
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Launch Day Promo</h1>
        <p className="text-muted-foreground font-body text-sm mt-1">
          June 1st launch — combos at GH¢150 and the free atomizer offer.
        </p>
      </div>

      {loading || !settings ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-accent" />
        </div>
      ) : (
        <>
          {/* Master toggles */}
          <div className="bg-card border border-border rounded-sm p-5 mb-6 space-y-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-heading text-base font-semibold text-foreground">Promo status</h2>
                <p className="text-xs text-muted-foreground font-body">Shows the combo section on the homepage.</p>
              </div>
              <button
                onClick={togglePromo}
                disabled={savingSettings}
                className={`px-5 py-2 rounded-sm text-sm font-body font-medium transition-colors ${
                  isActive
                    ? "bg-destructive text-destructive-foreground hover:opacity-90"
                    : "bg-accent text-accent-foreground hover:opacity-90"
                }`}
              >
                {isActive ? "Close promo" : "Open promo"}
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap border-t border-border pt-5">
              <div>
                <h2 className="font-heading text-base font-semibold text-foreground">Free atomizer offer</h2>
                <p className="text-xs text-muted-foreground font-body">Buy 2 perfumes → free atomizer.</p>
              </div>
              <button
                onClick={toggleAtomizer}
                disabled={savingSettings}
                className={`px-5 py-2 rounded-sm text-sm font-body font-medium transition-colors ${
                  atomizerActive
                    ? "bg-destructive text-destructive-foreground hover:opacity-90"
                    : "bg-accent text-accent-foreground hover:opacity-90"
                }`}
              >
                {atomizerActive ? "Disable offer" : "Enable offer"}
              </button>
            </div>

            <div className="border-t border-border pt-5 grid gap-4">
              <div>
                <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">
                  Headline
                </label>
                <input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">
                  Sub-headline
                </label>
                <textarea
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground resize-none"
                />
              </div>
              <div>
                <button
                  onClick={() => saveSettings()}
                  disabled={savingSettings}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground text-sm font-body rounded-sm hover:bg-secondary disabled:opacity-50"
                >
                  {savingSettings ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save text
                </button>
              </div>
            </div>
          </div>

          {/* Combos */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold text-foreground">Combos</h2>
            <button
              onClick={() => {
                setCreating(true);
                setEditingId(null);
                setForm(blankCombo);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-body font-medium rounded-sm hover:opacity-90"
            >
              <Plus size={16} /> Add combo
            </button>
          </div>

          {(creating || editingId) && (
            <div className="bg-card border border-border rounded-sm p-5 mb-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Price (GH¢)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Sort order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Image</label>
                <div className="flex items-center gap-3">
                  {form.image_url && (
                    <img src={form.image_url} alt="" className="w-16 h-16 object-cover rounded-sm border border-border" />
                  )}
                  <label className="flex items-center gap-2 px-3 py-2 border border-border rounded-sm text-sm font-body text-foreground hover:bg-secondary cursor-pointer">
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {uploading ? "Uploading..." : form.image_url ? "Replace image" : "Upload image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(true);
                        const ext = file.name.split(".").pop();
                        const path = `combo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
                        const { error: upErr } = await supabase.storage
                          .from("product-images")
                          .upload(path, file, { upsert: false });
                        if (upErr) {
                          toast({ title: upErr.message, variant: "destructive" });
                          setUploading(false);
                          return;
                        }
                        const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
                        setForm((f) => ({ ...f, image_url: pub.publicUrl }));
                        setUploading(false);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {form.image_url && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image_url: "" })}
                      className="text-xs font-body text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded border-border"
                />
                <label className="text-sm font-body text-foreground">Active</label>
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button
                  onClick={saveCombo}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-body font-medium rounded-sm hover:opacity-90"
                >
                  <Save size={14} /> Save
                </button>
                <button
                  onClick={() => {
                    setCreating(false);
                    setEditingId(null);
                    setForm(blankCombo);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground text-sm font-body rounded-sm hover:bg-secondary"
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Combo</th>
                  <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Stock</th>
                  <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {combos.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {c.image_url && (
                          <img src={c.image_url} alt={c.name} className="w-10 h-10 object-cover rounded-sm" />
                        )}
                        <span className="text-sm font-body font-medium text-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-body text-foreground">GH¢{Number(c.price).toFixed(2)}</td>
                    <td className="p-4 text-sm font-body text-foreground">{c.stock}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-body px-2 py-1 rounded-sm ${
                          c.is_active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {c.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(c)}
                          className="text-xs font-body text-accent hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCombo(c.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {combos.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground font-body">
                      No combos yet. Add your first launch combo above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminPromo;
