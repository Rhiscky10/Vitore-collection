import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logAdminActivity } from "@/lib/adminLog";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_slug: string | null;
  sort_order: number;
  is_active: boolean;
}

const empty: Omit<Category, "id"> = {
  name: "", slug: "", parent_slug: null, sort_order: 0, is_active: true,
};

const AdminCategories = () => {
  const { toast } = useToast();
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Category, "id">>(empty);
  const [saving, setSaving] = useState(false);

  const fetchCats = async () => {
    const { data } = await supabase.from("categories" as any).select("*").order("sort_order");
    if (data) setCats(data as unknown as Category[]);
    setLoading(false);
  };

  useEffect(() => { fetchCats(); }, []);

  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "Name required", variant: "destructive" }); return; }
    const slug = form.slug.trim() || slugify(form.name);
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from("categories" as any).update({ ...form, slug } as any).eq("id", editing);
      if (error) toast({ title: error.message, variant: "destructive" });
      else {
        toast({ title: "Category updated" });
        await logAdminActivity("update", "category", editing, { name: form.name, slug });
        setEditing(null); setForm(empty); fetchCats();
      }
    } else {
      const { data, error } = await supabase.from("categories" as any).insert({ ...form, slug } as any).select().single();
      if (error) toast({ title: error.message, variant: "destructive" });
      else {
        toast({ title: "Category created" });
        await logAdminActivity("create", "category", (data as any)?.id ?? slug, { name: form.name, slug });
        setCreating(false); setForm(empty); fetchCats();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (c: Category) => {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    const { error } = await supabase.from("categories" as any).delete().eq("id", c.id);
    if (error) toast({ title: error.message, variant: "destructive" });
    else {
      toast({ title: "Category deleted" });
      await logAdminActivity("delete", "category", c.id, { name: c.name, slug: c.slug });
      fetchCats();
    }
  };

  const parents = cats.filter((c) => !c.parent_slug);

  const Form = () => (
    <div className="bg-card border border-border rounded-sm p-5 mb-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground" />
        </div>
        <div>
          <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Slug (optional)</label>
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated"
            className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground" />
        </div>
        <div>
          <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Parent category</label>
          <select value={form.parent_slug ?? ""} onChange={(e) => setForm({ ...form, parent_slug: e.target.value || null })}
            className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground">
            <option value="">— Top-level —</option>
            {parents.map((p) => <option key={p.id} value={p.slug}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Sort order</label>
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground" />
        </div>
        <label className="flex items-center gap-2 text-sm font-body text-foreground">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          Active
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-body font-medium rounded-sm hover:opacity-90 disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
        </button>
        <button onClick={() => { setEditing(null); setCreating(false); setForm(empty); }}
          className="px-4 py-2 border border-border text-foreground text-sm font-body rounded-sm hover:bg-secondary">
          <X size={14} className="inline mr-1" /> Cancel
        </button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground font-body text-sm mt-1">Organize your catalog</p>
        </div>
        <button onClick={() => { setCreating(true); setEditing(null); setForm(empty); }}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-body font-medium rounded-sm hover:opacity-90">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {(creating || editing) && <Form />}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Slug</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Parent</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Order</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="p-4 text-sm font-body text-foreground">{c.name}</td>
                  <td className="p-4 text-xs font-mono text-muted-foreground">{c.slug}</td>
                  <td className="p-4 text-sm font-body text-muted-foreground">{c.parent_slug ?? "—"}</td>
                  <td className="p-4 text-sm font-body text-foreground">{c.sort_order}</td>
                  <td className="p-4">
                    <span className={`text-xs font-body px-2 py-1 rounded-sm ${c.is_active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(c.id); setCreating(false); setForm({ name: c.name, slug: c.slug, parent_slug: c.parent_slug, sort_order: c.sort_order, is_active: c.is_active }); }}
                        className="p-1.5 text-muted-foreground hover:text-foreground">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(c)} className="p-1.5 text-muted-foreground hover:text-destructive">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cats.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground font-body">No categories yet. Add your first one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;
