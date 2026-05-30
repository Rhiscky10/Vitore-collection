import { useEffect, useState } from "react";
import { Mail, Trash2, Download, Send } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Subscriber {
  id: string;
  email: string;
  status: string;
  source: string | null;
  created_at: string;
}

interface Campaign {
  id: string;
  subject: string;
  body: string;
  type: string;
  created_at: string;
  sent_at: string | null;
  recipient_count: number | null;
}

const AdminNewsletter = () => {
  const { toast } = useToast();
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("announcement");
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const [s, c] = await Promise.all([
      supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
      supabase.from("newsletter_campaigns").select("*").order("created_at", { ascending: false }),
    ]);
    setSubs((s.data || []) as Subscriber[]);
    setCampaigns((c.data || []) as Campaign[]);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const active = subs.filter((s) => s.status === "active");

  const removeSub = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Removed" }); refresh(); }
  };

  const exportCsv = () => {
    const headers = ["Email", "Status", "Source", "Joined"];
    const csv = [headers.join(",")]
      .concat(subs.map((s) => [s.email, s.status, s.source || "", new Date(s.created_at).toISOString()].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const saveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      toast({ title: "Missing fields", description: "Subject and body are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("newsletter_campaigns").insert({
      subject: subject.trim(),
      body: body.trim(),
      type,
      created_by: user?.id,
      recipient_count: active.length,
    });
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Saved", description: `Draft saved for ${active.length} active subscribers.` });
      setSubject(""); setBody(""); refresh();
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Newsletter</h1>
        <p className="text-muted-foreground font-body text-sm mt-1">Manage subscribers, promotions, and announcements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card label="Total Subscribers" value={subs.length} />
        <Card label="Active" value={active.length} />
        <Card label="Campaigns" value={campaigns.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose campaign */}
        <div className="bg-card border border-border rounded-sm p-5">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Send size={16} className="text-accent" /> New Promotion / Announcement
          </h2>
          <form onSubmit={saveCampaign} className="space-y-3">
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full h-10 px-3 rounded-sm border border-input bg-background text-sm font-body">
              <option value="announcement">Announcement</option>
              <option value="promotion">Promotion</option>
              <option value="newsletter">Newsletter</option>
            </select>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full h-10 px-3 rounded-sm border border-input bg-background text-sm font-body" />
            <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message…" rows={8} className="w-full px-3 py-2 rounded-sm border border-input bg-background text-sm font-body" />
            <button type="submit" disabled={saving} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-sm text-sm font-body font-medium hover:bg-primary/90 disabled:opacity-50">
              {saving ? "Saving…" : `Save Campaign (${active.length} recipients)`}
            </button>
          </form>
        </div>

        {/* Subscribers */}
        <div className="bg-card border border-border rounded-sm">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
              <Mail size={16} className="text-accent" /> Subscribers
            </h2>
            <button onClick={exportCsv} className="flex items-center gap-1.5 text-xs font-body text-accent hover:underline">
              <Download size={14} /> Export CSV
            </button>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {loading ? (
              <p className="p-8 text-center text-muted-foreground font-body text-sm">Loading…</p>
            ) : subs.length === 0 ? (
              <p className="p-8 text-center text-muted-foreground font-body text-sm">No subscribers yet</p>
            ) : (
              subs.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-5 py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-body text-foreground">{s.email}</p>
                    <p className="text-xs text-muted-foreground font-body">{s.source || "—"} · {new Date(s.created_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => removeSub(s.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Past campaigns */}
      <div className="mt-6 bg-card border border-border rounded-sm">
        <div className="p-5 border-b border-border">
          <h2 className="font-heading text-lg font-semibold text-foreground">Past Campaigns</h2>
        </div>
        <div className="divide-y divide-border">
          {campaigns.length === 0 && <p className="p-8 text-center text-muted-foreground font-body text-sm">No campaigns yet</p>}
          {campaigns.map((c) => (
            <div key={c.id} className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-body uppercase tracking-wider text-accent">{c.type}</span>
                <span className="text-xs text-muted-foreground font-body">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
              <p className="font-heading text-base font-semibold text-foreground">{c.subject}</p>
              <p className="text-sm text-muted-foreground font-body mt-1 line-clamp-2">{c.body}</p>
              <p className="text-xs text-muted-foreground font-body mt-2">{c.recipient_count ?? 0} recipients</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

const Card = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-card border border-border rounded-sm p-5">
    <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">{label}</span>
    <p className="font-heading text-xl font-bold text-foreground mt-2">{value}</p>
  </div>
);

export default AdminNewsletter;
