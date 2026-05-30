import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { useToast } from "@/hooks/use-toast";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/rhis.cky10@gmail.com";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), message: form.message.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast({ title: "Failed to send message. Please try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeading subtitle="Get in Touch" title="Contact Us" description="We'd love to hear from you. Whether it's a question about a product, an order, or a special request, our team is here to help." />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="space-y-6">
              <div>
                <label className="text-xs letter-spacing-luxury uppercase font-body text-muted-foreground mb-2 block">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                  placeholder="Your full name" maxLength={100} />
              </div>
              <div>
                <label className="text-xs letter-spacing-luxury uppercase font-body text-muted-foreground mb-2 block">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                  placeholder="your@email.com" maxLength={255} />
              </div>
              <div>
                <label className="text-xs letter-spacing-luxury uppercase font-body text-muted-foreground mb-2 block">Message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5}
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="How can we help you?" maxLength={1000} />
              </div>
              <button type="submit" disabled={sending}
                className="inline-flex items-center gap-2 bg-gradient-gold text-accent-foreground px-8 py-4 text-sm letter-spacing-luxury uppercase font-body font-semibold hover:shadow-gold transition-all duration-300 disabled:opacity-50 rounded-sm">
                {sending ? "Sending..." : "Send Message"} <Send size={14} />
              </button>
              <p className="text-xs text-muted-foreground font-body">
                Messages go directly to our team. To update the receiving email, change the Formspree endpoint in the code.
              </p>
            </motion.form>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"><Mail size={20} className="text-accent" strokeWidth={1.5} /></div>
                <div>
                  <h4 className="font-heading text-base font-semibold text-foreground mb-1">Email</h4>
                  <p className="text-sm text-muted-foreground font-body">vitorecollection74@gmail.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"><Phone size={20} className="text-accent" strokeWidth={1.5} /></div>
                <div>
                  <h4 className="font-heading text-base font-semibold text-foreground mb-1">Phone</h4>
                  <p className="text-sm text-muted-foreground font-body">+233 20 636 3325</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"><MapPin size={20} className="text-accent" strokeWidth={1.5} /></div>
                <div>
                  <h4 className="font-heading text-base font-semibold text-foreground mb-1">Visit Us</h4>
                  <p className="text-sm text-muted-foreground font-body">Accra, Ghana</p>
                </div>
              </div>
              <div className="w-full h-64 bg-card border border-border rounded-sm overflow-hidden">
                <iframe title="Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127066.4!2d-0.25!3d5.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sAccra%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
