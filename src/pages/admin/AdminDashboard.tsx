import { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Package, Users, Mail, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: any[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0, recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [sendingTest, setSendingTest] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSendTestEmail = async () => {
    setSendingTest(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-test-email", {
        body: { recipient: user?.email },
      });
      if (error) throw new Error(error.message);
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({
        title: "Test emails sent ✓",
        description: `Customer copy → ${(data as any)?.sent_to_customer}. Admin copies → ${((data as any)?.sent_to_admins || []).join(", ")}.`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to send test email";
      toast({ title: "Test email failed", description: msg, variant: "destructive" });
    } finally {
      setSendingTest(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      const [ordersRes, productsRes, profilesRes] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("id", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }),
      ]);

      const orders = ordersRes.data || [];
      const paidOrders = orders.filter((o: any) => o.payment_status === "paid");
      const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0);

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: productsRes.count || 0,
        totalCustomers: profilesRes.count || 0,
        recentOrders: orders.slice(0, 10),
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Revenue", value: `GH¢${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-green-500" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-blue-500" },
    { label: "Products", value: stats.totalProducts, icon: Package, color: "text-purple-500" },
    { label: "Customers", value: stats.totalCustomers, icon: Users, color: "text-orange-500" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground font-body text-sm mt-1">Overview of your store performance</p>
        </div>
        <button
          onClick={handleSendTestEmail}
          disabled={sendingTest}
          className="inline-flex items-center gap-2 bg-gradient-gold text-accent-foreground px-5 py-2.5 text-xs letter-spacing-luxury uppercase font-body font-semibold hover:shadow-gold transition-all rounded-sm disabled:opacity-50"
        >
          {sendingTest ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
          {sendingTest ? "Sending..." : "Send Test Order Email"}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">{card.label}</span>
              <card.icon size={18} className={card.color} />
            </div>
            <p className="font-heading text-xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-sm">
        <div className="p-5 border-b border-border">
          <h2 className="font-heading text-lg font-semibold text-foreground">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Items</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Total</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="p-4 text-sm font-body text-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </td>
                  <td className="p-4 text-sm font-body text-foreground">{order.email}</td>
                  <td className="p-4 text-sm font-body text-muted-foreground">
                    {Array.isArray(order.items) ? order.items.length : 0} items
                  </td>
                  <td className="p-4 text-sm font-body font-medium text-foreground">GH¢{Number(order.total_amount).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`text-xs font-body font-medium px-2 py-1 rounded-sm ${
                      order.payment_status === "paid" ? "bg-green-500/10 text-green-500" :
                      order.payment_status === "failed" ? "bg-red-500/10 text-red-500" :
                      "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground font-body">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
