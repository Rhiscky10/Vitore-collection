import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

interface Customer {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  orderCount: number;
  totalSpent: number;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      const [profilesRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("user_id, total_amount, payment_status"),
      ]);

      const profiles = profilesRes.data || [];
      const orders = ordersRes.data || [];

      const customerData: Customer[] = profiles.map((p: any) => {
        const userOrders = orders.filter((o: any) => o.user_id === p.user_id && o.payment_status === "paid");
        return {
          user_id: p.user_id,
          full_name: p.full_name,
          avatar_url: p.avatar_url,
          created_at: p.created_at,
          orderCount: userOrders.length,
          totalSpent: userOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0),
        };
      });

      setCustomers(customerData);
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground font-body text-sm mt-1">{customers.length} registered customers</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Customer</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Joined</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Orders</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.user_id} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {c.avatar_url ? (
                        <img src={c.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                          <Users size={14} className="text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-sm font-body font-medium text-foreground">{c.full_name || "Anonymous"}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-body text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="p-4 text-sm font-body text-foreground">{c.orderCount}</td>
                  <td className="p-4 text-sm font-body font-medium text-foreground">GH¢{c.totalSpent.toFixed(2)}</td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground font-body">No customers yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCustomers;
