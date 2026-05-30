import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Navigate } from "react-router-dom";

interface LogRow {
  id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  created_at: string;
}

const AdminLogs = () => {
  const { isSuperAdmin, loading } = useAdmin();
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [fetching, setFetching] = useState(true);
  const [emailFilter, setEmailFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (!isSuperAdmin) return;
    const fetchLogs = async () => {
      setFetching(true);
      let q = supabase.from("admin_activity_logs").select("*").order("created_at", { ascending: false }).limit(500);
      if (emailFilter.trim()) q = q.ilike("admin_email", `%${emailFilter.trim()}%`);
      if (typeFilter !== "all") q = q.eq("entity_type", typeFilter);
      const { data } = await q;
      if (data) setLogs(data as unknown as LogRow[]);
      setFetching(false);
    };
    fetchLogs();
  }, [isSuperAdmin, emailFilter, typeFilter]);

  if (loading) return null;
  if (!isSuperAdmin) return <Navigate to="/admin" replace />;

  const actionColors: Record<string, string> = {
    create: "bg-green-500/10 text-green-500",
    update: "bg-blue-500/10 text-blue-500",
    delete: "bg-red-500/10 text-red-500",
    status_change: "bg-yellow-500/10 text-yellow-500",
    login: "bg-purple-500/10 text-purple-500",
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Activity Logs</h1>
        <p className="text-muted-foreground font-body text-sm mt-1">Track what every admin does</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} placeholder="Filter by email..."
          className="px-3 py-2 bg-card border border-border rounded-sm text-sm font-body text-foreground" />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-sm text-sm font-body text-foreground">
          <option value="all">All types</option>
          <option value="product">Products</option>
          <option value="category">Categories</option>
          <option value="order">Orders</option>
          <option value="admin">Admins</option>
          <option value="auth">Logins</option>
        </select>
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
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">When</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Admin</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Action</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-0">
                  <td className="p-4 text-xs font-body text-muted-foreground whitespace-nowrap">
                    {new Date(l.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 text-sm font-body text-foreground">{l.admin_email}</td>
                  <td className="p-4">
                    <span className={`text-xs font-body px-2 py-1 rounded-sm ${actionColors[l.action] || "bg-secondary text-muted-foreground"}`}>
                      {l.action}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-body text-muted-foreground capitalize">{l.entity_type}</td>
                  <td className="p-4 text-xs font-body text-muted-foreground max-w-md truncate">
                    {l.details ? JSON.stringify(l.details) : (l.entity_id ?? "—")}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground font-body">No activity yet</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLogs;
