import { ReactNode, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, LogOut, ArrowLeft, Mail, Sparkles, FolderTree, ShieldCheck, Activity } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/contexts/AuthContext";

const baseNav = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/products", icon: Package, label: "Products" },
  { path: "/admin/categories", icon: FolderTree, label: "Categories" },
  { path: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { path: "/admin/customers", icon: Users, label: "Customers" },
  { path: "/admin/reports", icon: BarChart3, label: "Reports" },
  { path: "/admin/newsletter", icon: Mail, label: "Newsletter" },
  { path: "/admin/promo", icon: Sparkles, label: "Launch Promo" },
];
const superNav = [
  { path: "/admin/admins", icon: ShieldCheck, label: "Admins" },
  { path: "/admin/logs", icon: Activity, label: "Activity Logs" },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { isAdmin, isSuperAdmin, loading, user } = useAdmin();
  const navItems = isSuperAdmin ? [...baseNav, ...superNav] : baseNav;
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth", { replace: true, state: { from: location.pathname } });
    } else if (!isAdmin) {
      navigate("/", { replace: true });
    }
  }, [isAdmin, loading, user, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0 hidden md:flex">
        <div className="p-6 border-b border-border">
          <h1 className="font-heading text-lg font-bold text-foreground">Vitoré Admin</h1>
          <p className="text-xs text-muted-foreground font-body mt-1">Management Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-body transition-colors ${
                  active
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border space-y-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} /> Back to Store
          </Link>
          <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2.5 text-sm font-body text-muted-foreground hover:text-destructive transition-colors w-full">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-lg font-bold text-foreground">Vitoré Admin</h1>
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
          </Link>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-body whitespace-nowrap transition-colors ${
                  active ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground"
                }`}
              >
                <item.icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 pt-28 md:pt-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
