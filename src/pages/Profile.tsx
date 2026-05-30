import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, LogOut, Calendar, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("full_name, avatar_url").eq("user_id", user.id).single()
        .then(({ data }) => { if (data) setProfile(data); });
    }
  }, [user]);

  if (loading || !user) return null;

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 min-h-[70vh]">
        <div className="container mx-auto px-4 md:px-8 max-w-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="bg-card border border-border rounded-sm p-8 text-center"
          >
            <Avatar className="w-20 h-20 mx-auto mb-4">
              {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={displayName} />}
              <AvatarFallback className="bg-accent text-accent-foreground font-heading text-xl">{initials}</AvatarFallback>
            </Avatar>

            <h1 className="font-heading text-2xl font-bold text-foreground mb-1">{displayName}</h1>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
              <Mail size={14} />
              <span className="text-sm font-body">{user.email}</span>
            </div>

            <div className="border-t border-border pt-6 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <User size={16} className="text-accent" />
                <div>
                  <span className="text-xs text-muted-foreground font-body block">Full Name</span>
                  <span className="text-sm font-body text-foreground">{displayName}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-accent" />
                <div>
                  <span className="text-xs text-muted-foreground font-body block">Email</span>
                  <span className="text-sm font-body text-foreground">{user.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-accent" />
                <div>
                  <span className="text-xs text-muted-foreground font-body block">Member Since</span>
                  <span className="text-sm font-body text-foreground">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <Link to="/orders"
              className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-gradient-gold text-accent-foreground py-3 text-sm letter-spacing-luxury uppercase font-body font-semibold hover:shadow-gold transition-all rounded-sm"
            >
              <Package size={16} /> Order History
            </Link>

            <button
              onClick={async () => { await signOut(); navigate("/"); }}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 border border-border text-foreground py-3 text-sm letter-spacing-luxury uppercase font-body font-medium hover:bg-secondary transition-colors rounded-sm"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
