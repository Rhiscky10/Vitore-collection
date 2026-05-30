import { useEffect, useState } from "react";
import { Plus, Trash2, ShieldCheck, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { Navigate } from "react-router-dom";
import { logAdminActivity } from "@/lib/adminLog";

interface AdminRow {
  id: string;
  email: string;
  is_super: boolean;
  created_at: string;
  created_by_email: string | null;
}

const AdminAdmins = () => {
  const { isSuperAdmin, loading } = useAdmin();
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchAdmins = async () => {
    setFetching(true);
    const { data } = await supabase.from("admin_emails").select("*").order("created_at", { ascending: true });
    if (data) setAdmins(data as unknown as AdminRow[]);
    setFetching(false);
  };

  useEffect(() => { if (isSuperAdmin) fetchAdmins(); }, [isSuperAdmin]);

  if (loading) return null;
  if (!isSuperAdmin) return <Navigate to="/admin" replace />;

  const handleAdd = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      toast({ title: "Enter a valid email", variant: "destructive" }); return;
    }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("admin_emails").insert({
      email: trimmed, is_super: false, created_by_email: user?.email ?? null,
    } as any);
    if (error) toast({ title: error.message, variant: "destructive" });
    else {
      toast({ title: "Admin added" });
      await logAdminActivity("create", "admin", trimmed, { email: trimmed });
      setEmail(""); fetchAdmins();
    }
    setSaving(false);
  };

  const handleRemove = async (row: AdminRow) => {
    if (row.is_super) return;
    if (!confirm(`Remove ${row.email} as admin?`)) return;
    const { error } = await supabase.from("admin_emails").delete().eq("id", row.id);
    if (error) toast({ title: error.message, variant: "destructive" });
    else {
      toast({ title: "Admin removed" });
      await logAdminActivity("delete", "admin", row.email, { email: row.email });
      fetchAdmins();
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Admins</h1>
        <p className="text-muted-foreground font-body text-sm mt-1">Manage who can access the admin panel</p>
      </div>

      <div className="bg-card border border-border rounded-sm p-5 mb-6">
        <label className="text-xs font-body text-muted-foreground uppercase tracking-wider block mb-2">Add new admin (email)</label>
        <div className="flex gap-2">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com"
            className="flex-1 px-3 py-2 bg-background border border-border rounded-sm text-sm font-body text-foreground" />
          <button onClick={handleAdd} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-body font-medium rounded-sm hover:opacity-90 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
          </button>
        </div>
        <p className="text-xs text-muted-foreground font-body mt-2">
          The user must already have an account (or sign up) using this email to access the admin.
        </p>
      </div>

      <div className="bg-card border border-border rounded-sm overflow-x-auto">
        {fetching ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Added by</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Added</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0">
                  <td className="p-4 text-sm font-body text-foreground">{a.email}</td>
                  <td className="p-4">
                    {a.is_super ? (
                      <span className="inline-flex items-center gap-1 text-xs font-body bg-accent/10 text-accent px-2 py-1 rounded-sm">
                        <ShieldCheck size={12} /> Super admin
                      </span>
                    ) : (
                      <span className="text-xs font-body text-muted-foreground">Admin</span>
                    )}
                  </td>
                  <td className="p-4 text-sm font-body text-muted-foreground">{a.created_by_email ?? "—"}</td>
                  <td className="p-4 text-sm font-body text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    {!a.is_super && (
                      <button onClick={() => handleRemove(a)} className="p-1.5 text-muted-foreground hover:text-destructive">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAdmins;
