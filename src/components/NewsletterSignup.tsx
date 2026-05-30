import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  variant?: "light" | "dark";
  source?: string;
}

const NewsletterSignup = ({ variant = "dark", source = "footer" }: Props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^\S+@\S+\.\S+$/.test(trimmed)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: trimmed, source });

    if (error) {
      const isDup = error.code === "23505" || error.message?.toLowerCase().includes("duplicate");
      toast({
        title: isDup ? "Already subscribed" : "Subscription failed",
        description: isDup ? "This email is already on our list." : error.message,
        variant: isDup ? "default" : "destructive",
      });
    } else {
      toast({ title: "Subscribed!", description: "Thank you for joining the Vitoré family." });
      setEmail("");
    }
    setLoading(false);
  };

  const isLight = variant === "light";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className={`flex-1 px-5 py-4 font-body text-sm focus:outline-none focus:border-accent rounded-sm border ${
          isLight
            ? "bg-background border-border text-foreground placeholder:text-muted-foreground"
            : "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
        }`}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-gradient-gold text-accent-foreground px-8 py-4 text-sm letter-spacing-luxury uppercase font-body font-semibold hover:shadow-gold transition-all duration-300 rounded-sm whitespace-nowrap disabled:opacity-60"
      >
        {loading ? "..." : "Subscribe"}
      </button>
    </form>
  );
};

export default NewsletterSignup;
