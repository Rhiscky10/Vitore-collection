import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2, Upload } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logAdminActivity } from "@/lib/adminLog";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory: string | null;
  stock: number;
  is_active: boolean;
  image_url: string | null;
  description: string | null;
  sizes: string[] | null;
  customization_fee: number | null;
}

const CATEGORY_OPTIONS: { value: string; label: string; subcategories: { value: string; label: string }[] }[] = [
  {
    value: "signature-scents",
    label: "Signature Scents",
    subcategories: [
      { value: "perfume", label: "Perfumes" },
      { value: "body-splash", label: "Body Splashes" },
    ],
  },
  {
    value: "beauty-essentials",
    label: "Beauty Essentials",
    subcategories: [{ value: "lip-combo", label: "Lip Combos" }],
  },
  {
    value: "everyday-style",
    label: "Everyday Style",
    subcategories: [
      { value: "tote", label: "Tote Bags" },
      { value: "necklace", label: "Necklaces" },
      { value: "headband", label: "Headbands" },
      { value: "scrunchie", label: "Scrunchies" },
      { value: "bow-cap", label: "Bow Caps" },
    ],
  },
  {
    value: "footwear-apparel",
    label: "Footwear & Apparel",
    subcategories: [
      { value: "shoes", label: "Shoes" },
      { value: "slippers", label: "Slippers" },
      { value: "jersey", label: "Jerseys (Customizable)" },
    ],
  },
  {
    value: "comfort-care",
    label: "Comfort Care",
    subcategories: [
      { value: "heat-pad", label: "Menstrual Heat Pads" },
      { value: "wet-wipes", label: "Wet Wipes" },
      { value: "water-bottle", label: "Water Bottles" },
    ],
  },
];

const defaultProduct: Omit<Product, "id"> = {
  name: "", price: 0, category: "signature-scents", subcategory: "perfume",
  stock: 0, is_active: true,
  image_url: "", description: "", sizes: null, customization_fee: null,
};


const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Product, "id">>(defaultProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data as unknown as Product[]);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setSaving(true);
    const { data, error } = await supabase.from("products").insert([{
      name: form.name, price: form.price, category: form.category,
      subcategory: form.subcategory,
      stock: form.stock, is_active: form.is_active,
      image_url: form.image_url || null, description: form.description || null,
      sizes: form.sizes,
      customization_fee: form.customization_fee,
    }]).select().single();
    if (error) { toast({ title: error.message, variant: "destructive" }); }
    else {
      toast({ title: "Product created" });
      await logAdminActivity("create", "product", (data as any)?.id ?? null, { name: form.name, price: form.price });
      setCreating(false); setForm(defaultProduct); fetchProducts();
    }
    setSaving(false);
  };

  const handleUpdate = async (id: string) => {
    setSaving(true);
    const { error } = await supabase.from("products").update({
      name: form.name, price: form.price, category: form.category,
      subcategory: form.subcategory,
      stock: form.stock, is_active: form.is_active,
      image_url: form.image_url || null, description: form.description || null,
      sizes: form.sizes,
      customization_fee: form.customization_fee,
    }).eq("id", id);
    if (error) { toast({ title: error.message, variant: "destructive" }); }
    else {
      toast({ title: "Product updated" });
      await logAdminActivity("update", "product", id, { name: form.name });
      setEditing(null); fetchProducts();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const target = products.find((p) => p.id === id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast({ title: error.message, variant: "destructive" }); }
    else {
      toast({ title: "Product deleted" });
      await logAdminActivity("delete", "product", id, { name: target?.name });
      fetchProducts();
    }
  };

  const startEdit = (p: Product) => {
    setEditing(p.id);
    setCreating(false);
    setForm({
      name: p.name, price: p.price, category: p.category, subcategory: p.subcategory,
      stock: p.stock, is_active: p.is_active, image_url: p.image_url,
      description: p.description, sizes: p.sizes, customization_fee: p.customization_fee,
    });
  };

  const currentCat = CATEGORY_OPTIONS.find((c) => c.value === form.category) ?? CATEGORY_OPTIONS[0];
  const showCustomization = form.subcategory === "jersey";
  const showSizes = form.subcategory === "shoes" || form.subcategory === "slippers" || form.subcategory === "jersey";



  const ProductForm = ({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) => (
    <div className="bg-card border border-border rounded-sm p-5 mb-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground" />
        </div>
        <div>
          <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Price (GH¢)</label>
          <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground" />
        </div>
        <div>
          <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Category</label>
          <select value={form.category} onChange={(e) => {
              const next = CATEGORY_OPTIONS.find((c) => c.value === e.target.value);
              setForm({ ...form, category: e.target.value, subcategory: next?.subcategories[0]?.value ?? null });
            }}
            className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground">
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Subcategory</label>
          <select value={form.subcategory ?? ""} onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground">
            {currentCat.subcategories.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Stock</label>
          <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground" />
        </div>
        {showCustomization && (
          <div>
            <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Customization Fee (GH¢)</label>
            <input type="number" step="0.01" value={form.customization_fee ?? 0}
              onChange={(e) => setForm({ ...form, customization_fee: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground"
              placeholder="e.g. 50 for name/number printing" />
          </div>
        )}
        {showSizes && (
          <div className="md:col-span-2">
            <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">
              Available Sizes (comma-separated)
            </label>
            <input
              value={(form.sizes ?? []).join(", ")}
              onChange={(e) => {
                const arr = e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                setForm({ ...form, sizes: arr.length ? arr : null });
              }}
              className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground"
              placeholder={
                form.subcategory === "jersey"
                  ? "e.g. S, M, L, XL, XXL"
                  : "e.g. 38, 39, 40, 41, 42, 43"
              }
            />
            <p className="text-xs text-muted-foreground font-body mt-1">
              Customers will pick one of these sizes before adding to cart.
            </p>
          </div>
        )}
        <div className="md:col-span-2">
          <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Product Image</label>
          <div className="flex items-center gap-3">
            {form.image_url && (
              <img src={form.image_url} alt="" className="w-16 h-16 object-cover rounded-sm border border-border" />
            )}
            <label className="flex items-center gap-2 px-3 py-2 border border-border rounded-sm text-sm font-body text-foreground hover:bg-secondary cursor-pointer">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? "Uploading..." : form.image_url ? "Replace image" : "Upload image"}
              <input type="file" accept="image/*" className="hidden" disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  const ext = file.name.split(".").pop();
                  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
                  const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
                  if (upErr) { toast({ title: upErr.message, variant: "destructive" }); setUploading(false); return; }
                  const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
                  setForm((f) => ({ ...f, image_url: pub.publicUrl }));
                  setUploading(false);
                  e.target.value = "";
                }} />
            </label>
            {form.image_url && (
              <button type="button" onClick={() => setForm({ ...form, image_url: "" })}
                className="text-xs font-body text-destructive hover:underline">Remove</button>
            )}
          </div>
          <input value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className="w-full mt-2 px-3 py-2 bg-background border border-border rounded-sm text-xs font-body text-muted-foreground"
            placeholder="Or paste image URL..." />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-1">Description</label>
          <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3} className="w-full px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground resize-none" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            className="rounded border-border" />
          <label className="text-sm font-body text-foreground">Active (visible in shop)</label>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button onClick={onSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-body font-medium rounded-sm hover:opacity-90 disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-border text-foreground text-sm font-body rounded-sm hover:bg-secondary">
          <X size={14} className="inline mr-1" /> Cancel
        </button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground font-body text-sm mt-1">Manage your product catalog</p>
        </div>
        <button onClick={() => { setCreating(true); setEditing(null); setForm(defaultProduct); }}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-body font-medium rounded-sm hover:opacity-90">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {creating && <ProductForm onSave={handleCreate} onCancel={() => setCreating(false)} />}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  {editing === p.id ? (
                    <td colSpan={6} className="p-4">
                      <ProductForm onSave={() => handleUpdate(p.id)} onCancel={() => setEditing(null)} />
                    </td>
                  ) : (
                    <>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {p.image_url && (
                            <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded-sm" />
                          )}
                          <span className="text-sm font-body font-medium text-foreground">{p.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-body text-muted-foreground">{p.category}</td>
                      <td className="p-4 text-sm font-body text-foreground">GH¢{Number(p.price).toFixed(2)}</td>
                      <td className="p-4 text-sm font-body text-foreground">{p.stock}</td>
                      <td className="p-4">
                        <span className={`text-xs font-body px-2 py-1 rounded-sm ${p.is_active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                          {p.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(p)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground font-body">No products in database yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
