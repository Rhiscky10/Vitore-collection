import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({ title: "Missing email", description: "Please enter your email address.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error("Password reset error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
      toast({ title: "Email sent", description: "Check your inbox for a password reset link." });
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 min-h-[85vh] flex items-center bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-card border border-border rounded-sm shadow-lg p-8 md:p-12"
          >
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Forgot Password</h1>
            <p className="font-body text-sm text-muted-foreground mb-8">
              Enter your email and we'll send you a link to reset your password.
            </p>

            {sent ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-body text-sm text-foreground">
                  We've sent a reset link to <strong>{email}</strong>. Check your inbox and spam folder.
                </p>
                <Link to="/auth" className="inline-block text-sm text-accent hover:underline font-body">
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="rounded-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-sm font-body text-sm font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : "Send Reset Link"}
                </button>
                <div className="text-center">
                  <Link to="/auth" className="text-sm text-accent hover:underline font-body">
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPassword;
