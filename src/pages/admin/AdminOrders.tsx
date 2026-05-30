import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  email: string;
  phone: string | null;
  items: any[];
  total_amount: number;
  currency: string;
  payment_status: string;
  payment_reference: string | null;
  created_at: string;
  user_id: string | null;
}

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (filter !== "all") query = query.eq("payment_status", filter);
      const { data } = await query;
      if (data) setOrders(data as unknown as Order[]);
      setLoading(false);
    };
    fetchOrders();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ payment_status: status } as any).eq("id", id);
    if (error) toast({ title: error.message, variant: "destructive" });
    else {
      toast({ title: `Order marked as ${status}` });
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, payment_status: status } : o));
      const { logAdminActivity } = await import("@/lib/adminLog");
      await logAdminActivity("status_change", "order", id, { new_status: status });
    }
  };

  const statusColors: Record<string, string> = {
    paid: "bg-green-500/10 text-green-500",
    pending: "bg-yellow-500/10 text-yellow-500",
    failed: "bg-red-500/10 text-red-500",
    processing: "bg-blue-500/10 text-blue-500",
    shipped: "bg-purple-500/10 text-purple-500",
    delivered: "bg-green-500/10 text-green-600",
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground font-body text-sm mt-1">{orders.length} orders total</p>
        </div>
        <div className="flex gap-2">
          {["all", "pending", "paid", "failed"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-body rounded-sm border transition-colors ${
                filter === f ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-card border border-border rounded-sm">
              <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-xs font-body text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="text-sm font-body text-foreground">{order.email}</span>
                  <span className="font-heading text-sm font-semibold text-foreground">GH¢{Number(order.total_amount).toFixed(2)}</span>
                </div>
                <span className={`text-xs font-body font-medium px-2 py-1 rounded-sm ${statusColors[order.payment_status] || statusColors.pending}`}>
                  {order.payment_status}
                </span>
              </div>

              {expandedOrder === order.id && (
                <div className="border-t border-border p-4 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-body">
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Phone</span>
                      <span className="text-foreground">{order.phone || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Reference</span>
                      <span className="text-foreground text-xs">{order.payment_reference || order.id.slice(0, 12)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Currency</span>
                      <span className="text-foreground">{order.currency}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground text-xs uppercase tracking-wider font-body block mb-2">Items</span>
                    {Array.isArray(order.items) && order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm font-body py-1.5 border-b border-border last:border-0">
                        <span className="text-foreground">{item.name} × {item.quantity}</span>
                        <span className="text-muted-foreground">GH¢{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2 flex-wrap">
                    {["processing", "shipped", "delivered"].map((s) => (
                      <button key={s} onClick={() => updateStatus(order.id, s)}
                        className="px-3 py-1.5 text-xs font-body border border-border rounded-sm hover:bg-secondary transition-colors text-foreground">
                        Mark as {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-20 text-muted-foreground font-body">No orders found</div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
