import { motion } from "framer-motion";
import { Sparkles, Gift } from "lucide-react";
import { usePromo } from "@/hooks/usePromo";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/data/products";

const PromoSection = () => {
  const { settings, combos } = usePromo();
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!settings?.is_active) return null;

  const activeCombos = combos.filter((c) => c.is_active);

  const handleAdd = (combo: typeof combos[number]) => {
    if (combo.stock <= 0) {
      toast({ title: "Sold out", description: "This combo is no longer available.", variant: "destructive" });
      return;
    }
    const synthetic: Product = {
      id: `combo-${combo.id}`,
      name: combo.name,
      price: Number(combo.price),
      image: combo.image_url || "",
      category: "signature-scents",
      gender: "unisex",
      subcategory: "perfume",
      family: "Launch Combo",
      description: combo.description || "",
      size: "Combo",
      rating: 5,
      stock: combo.stock,
      noDiscount: true,
    };
    addToCart(synthetic, 1);
    toast({ title: "Added to cart", description: `${combo.name} — GH¢${Number(combo.price).toFixed(2)}` });
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-luxury">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-xs letter-spacing-luxury uppercase font-body text-accent mb-4">
            <Sparkles size={14} /> Limited · Launch Day
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-primary-foreground mb-4">
            {settings.headline}
          </h2>
          <p className="text-primary-foreground/80 font-body max-w-2xl mx-auto leading-relaxed">
            {settings.subheadline}
          </p>
          {settings.atomizer_offer_active && (
            <div className="mt-6 inline-flex items-center gap-2 bg-accent/15 border border-accent/40 text-accent px-5 py-2.5 rounded-sm text-sm font-body">
              <Gift size={16} /> Buy any 2 perfumes — get a FREE atomizer
            </div>
          )}
        </motion.div>

        {activeCombos.length === 0 ? (
          <p className="text-center text-primary-foreground/60 font-body">Combos coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCombos.map((combo, i) => (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card border border-border rounded-sm overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] bg-secondary overflow-hidden">
                  {combo.image_url ? (
                    <img src={combo.image_url} alt={combo.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground font-body text-sm">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{combo.name}</h3>
                  {combo.description && (
                    <p className="text-sm text-muted-foreground font-body mb-4 flex-1">{combo.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="font-heading text-xl font-bold text-accent">GH¢{Number(combo.price).toFixed(2)}</p>
                      <p className="text-xs font-body text-muted-foreground">
                        {combo.stock > 0 ? `Only ${combo.stock} left` : "Sold out"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAdd(combo)}
                      disabled={combo.stock <= 0}
                      className="bg-gradient-gold text-accent-foreground px-4 py-2 text-xs letter-spacing-luxury uppercase font-body font-semibold rounded-sm hover:shadow-gold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PromoSection;
