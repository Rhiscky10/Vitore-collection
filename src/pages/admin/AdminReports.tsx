import { useEffect, useState } from "react";
import { Download, FileSpreadsheet, FileText, TrendingUp, DollarSign, Package } from "lucide-react";
import * as XLSX from "xlsx";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type OrderRow = {
  id: string;
  email: string;
  phone: string | null;
  total_amount: number;
  payment_status: string;
  created_at: string;
  items: any;
};

type FlatRow = {
  order_id: string;
  customer_email: string;
  customer_phone: string;
  product: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  status: string;
  date: string;
};

const RANGES = [
  { key: "week", label: "Last 7 days", days: 7 },
  { key: "month", label: "Last 30 days", days: 30 },
  { key: "quarter", label: "Last 90 days", days: 90 },
  { key: "all", label: "All time", days: 0 },
];

const AdminReports = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<string>("week");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("id,email,phone,total_amount,payment_status,created_at,items")
        .order("created_at", { ascending: false });
      if (error) toast({ title: "Failed to load orders", description: error.message, variant: "destructive" });
      setOrders((data || []) as OrderRow[]);
      setLoading(false);
    })();
  }, [toast]);

  const cutoff = (() => {
    const r = RANGES.find((x) => x.key === range)!;
    if (!r.days) return null;
    const d = new Date();
    d.setDate(d.getDate() - r.days);
    return d;
  })();

  const filtered = orders.filter((o) => !cutoff || new Date(o.created_at) >= cutoff);
  const paid = filtered.filter((o) => o.payment_status === "paid");
  const totalRevenue = paid.reduce((s, o) => s + Number(o.total_amount || 0), 0);

  const flatten = (rows: OrderRow[]): FlatRow[] => {
    const out: FlatRow[] = [];
    rows.forEach((o) => {
      const items = Array.isArray(o.items) ? o.items : [];
      if (items.length === 0) {
        out.push({
          order_id: o.id,
          customer_email: o.email,
          customer_phone: o.phone || "",
          product: "—",
          quantity: 0,
          unit_price: 0,
          line_total: Number(o.total_amount),
          status: o.payment_status,
          date: new Date(o.created_at).toISOString(),
        });
      } else {
        items.forEach((it: any) => {
          const qty = Number(it.quantity || it.qty || 1);
          const price = Number(it.price || it.unit_price || 0);
          out.push({
            order_id: o.id,
            customer_email: o.email,
            customer_phone: o.phone || "",
            product: it.name || it.product_name || it.title || "Unknown",
            quantity: qty,
            unit_price: price,
            line_total: qty * price,
            status: o.payment_status,
            date: new Date(o.created_at).toISOString(),
          });
        });
      }
    });
    return out;
  };

  const bestSellers = (() => {
    const map = new Map<string, { product: string; units: number; revenue: number }>();
    paid.forEach((o) => {
      const items = Array.isArray(o.items) ? o.items : [];
      items.forEach((it: any) => {
        const name = it.name || it.product_name || it.title || "Unknown";
        const qty = Number(it.quantity || it.qty || 1);
        const price = Number(it.price || it.unit_price || 0);
        const cur = map.get(name) || { product: name, units: 0, revenue: 0 };
        cur.units += qty;
        cur.revenue += qty * price;
        map.set(name, cur);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.units - a.units).slice(0, 20);
  })();

  const downloadCSV = () => {
    const rows = flatten(filtered);
    const headers = ["Order ID", "Customer", "Phone", "Product", "Quantity", "Unit Price (GH¢)", "Line Total (GH¢)", "Status", "Date"];
    const csv = [headers.join(",")]
      .concat(
        rows.map((r) =>
          [r.order_id, r.customer_email, r.customer_phone, r.product, r.quantity, r.unit_price, r.line_total, r.status, r.date]
            .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
            .join(",")
        )
      )
      .join("\n");

    const summary = `\n\nSummary\nTotal Orders,${filtered.length}\nPaid Orders,${paid.length}\nTotal Revenue (GH¢),${totalRevenue.toFixed(2)}\n\nBest Sellers\nProduct,Units,Revenue (GH¢)\n${bestSellers
      .map((b) => `"${b.product}",${b.units},${b.revenue.toFixed(2)}`)
      .join("\n")}`;

    const blob = new Blob([csv + summary], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, `vitore-report-${range}-${stamp()}.csv`);
  };

  const downloadExcel = () => {
    const rows = flatten(filtered);
    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.json_to_sheet(
      rows.map((r) => ({
        "Order ID": r.order_id,
        Customer: r.customer_email,
        Phone: r.customer_phone,
        Product: r.product,
        Quantity: r.quantity,
        "Unit Price (GH¢)": r.unit_price,
        "Line Total (GH¢)": r.line_total,
        Status: r.status,
        Date: r.date,
      }))
    );
    XLSX.utils.book_append_sheet(wb, ws1, "Orders");

    const ws2 = XLSX.utils.json_to_sheet([
      { Metric: "Total Orders", Value: filtered.length },
      { Metric: "Paid Orders", Value: paid.length },
      { Metric: "Total Revenue (GH¢)", Value: Number(totalRevenue.toFixed(2)) },
      { Metric: "Range", Value: RANGES.find((r) => r.key === range)?.label },
      { Metric: "Generated", Value: new Date().toISOString() },
    ]);
    XLSX.utils.book_append_sheet(wb, ws2, "Summary");

    const ws3 = XLSX.utils.json_to_sheet(
      bestSellers.map((b) => ({ Product: b.product, Units: b.units, "Revenue (GH¢)": Number(b.revenue.toFixed(2)) }))
    );
    XLSX.utils.book_append_sheet(wb, ws3, "Best Sellers");

    XLSX.writeFile(wb, `vitore-report-${range}-${stamp()}.xlsx`);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Export Reports</h1>
        <p className="text-muted-foreground font-body text-sm mt-1">Download sales, orders, and revenue data</p>
      </div>

      <div className="bg-card border border-border rounded-sm p-5 mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <label className="text-xs font-body uppercase tracking-wider text-muted-foreground">Range:</label>
          <select value={range} onChange={(e) => setRange(e.target.value)} className="h-9 px-3 rounded-sm border border-input bg-background text-sm font-body">
            {RANGES.map((r) => (
              <option key={r.key} value={r.key}>{r.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <Stat icon={DollarSign} color="text-green-500" label="Revenue" value={`GH¢${totalRevenue.toFixed(2)}`} />
          <Stat icon={Package} color="text-blue-500" label="Orders" value={filtered.length} />
          <Stat icon={TrendingUp} color="text-purple-500" label="Paid" value={paid.length} />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={downloadCSV}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-sm text-sm font-body font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            <FileText size={16} /> Download CSV
          </button>
          <button
            onClick={downloadExcel}
            disabled={loading}
            className="flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-sm text-sm font-body font-medium hover:bg-accent/90 disabled:opacity-50"
          >
            <FileSpreadsheet size={16} /> Download Excel
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-sm">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <TrendingUp size={16} className="text-accent" />
          <h2 className="font-heading text-lg font-semibold text-foreground">Best-Selling Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Units Sold</th>
                <th className="text-left p-4 text-xs font-body text-muted-foreground uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {bestSellers.map((b) => (
                <tr key={b.product} className="border-b border-border last:border-0">
                  <td className="p-4 text-sm font-body text-foreground">{b.product}</td>
                  <td className="p-4 text-sm font-body text-foreground">{b.units}</td>
                  <td className="p-4 text-sm font-body font-medium text-foreground">GH¢{b.revenue.toFixed(2)}</td>
                </tr>
              ))}
              {bestSellers.length === 0 && (
                <tr><td colSpan={3} className="p-8 text-center text-muted-foreground font-body">No paid orders in this range</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

const Stat = ({ icon: Icon, color, label, value }: any) => (
  <div className="border border-border rounded-sm p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">{label}</span>
      <Icon size={16} className={color} />
    </div>
    <p className="font-heading text-lg font-bold text-foreground">{value}</p>
  </div>
);

const stamp = () => new Date().toISOString().slice(0, 10);
const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export default AdminReports;
