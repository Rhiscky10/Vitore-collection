import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  email: string;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  payment_reference: string | null;
  payment_status: string;
  created_at: string;
}

const statusConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-yellow-500", label: "Pending" },
  paid: { icon: CheckCircle, color: "text-green-500", label: "Paid" },
  failed: { icon: XCircle, color: "text-destructive", label: "Failed" },
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setOrders(data as unknown as Order[]);
      setLoading(false);
    };
    fetchOrders();

    const channel = supabase
      .channel("user-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === "UPDATE") {
          setOrders((prev) => prev.map((o) => (o.id === (payload.new as Order).id ? (payload.new as Order) : o)));
        } else if (payload.eventType === "INSERT") {
          setOrders((prev) => [(payload.new as Order), ...prev]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 min-h-[60vh]">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <Link to="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Profile
          </Link>

          <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Order History</h1>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground font-body">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Package size={48} className="mx-auto text-muted-foreground mb-4" strokeWidth={1} />
              <p className="font-heading text-xl text-foreground mb-2">No orders yet</p>
              <p className="text-muted-foreground font-body mb-6">Start shopping to see your order history here.</p>
              <Link to="/shop" className="inline-block bg-gradient-gold text-accent-foreground px-8 py-3 text-sm letter-spacing-luxury uppercase font-body font-semibold hover:shadow-gold transition-all rounded-sm">
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => {
                const status = statusConfig[order.payment_status] || statusConfig.pending;
                const StatusIcon = status.icon;
                return (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-body">
                          {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-body mt-1">
                          Ref: {order.payment_reference || order.id.slice(0, 8)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-body font-medium ${status.color}`}>
                        <StatusIcon size={14} /> {status.label}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      {(order.items as OrderItem[]).map((item, j) => (
                        <div key={j} className="flex justify-between text-sm font-body">
                          <span className="text-foreground">{item.name} × {item.quantity}</span>
                          <span className="text-muted-foreground">GH¢{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="font-heading text-sm font-semibold text-foreground">Total</span>
                      <span className="font-heading text-sm font-semibold text-accent">GH¢{Number(order.total_amount).toFixed(2)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Orders;
