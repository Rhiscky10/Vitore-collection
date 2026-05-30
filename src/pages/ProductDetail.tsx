import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, ShoppingBag, Heart, Star } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAllProducts } from "@/hooks/useAllProducts";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import { getDiscountedPrice, DISCOUNT_LABEL } from "@/lib/pricing";

const ProductDetail = () => {
  const { id } = useParams();
  const { products } = useAllProducts();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();

  if (!product) {
    return (
      <Layout>
        <div className="pt-36 pb-20 text-center">
          <h1 className="font-heading text-3xl text-foreground mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-accent hover:underline font-body">Back to Shop</Link>
        </div>
      </Layout>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const related = products.filter((p) => p.id !== product.id && p.category === product.category && p.subcategory === product.subcategory).slice(0, 3);

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast({ title: "Out of stock", variant: "destructive" });
      return;
    }
    if (product.availableSizes && product.availableSizes.length > 0 && !selectedSize) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    addToCart(product, quantity, selectedSize);
    toast({
      title: `${product.name} added to cart`,
      description: selectedSize ? `Size: ${selectedSize} · Qty: ${quantity}` : `Quantity: ${quantity}`,
    });
  };

  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container mx-auto px-4 md:px-8">
          <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Collection
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="aspect-square overflow-hidden rounded-sm bg-card">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex flex-col justify-center">
              <span className="text-xs letter-spacing-luxury uppercase font-body text-accent mb-2">{product.subcategory.replace("-", " ")} · {product.family}</span>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground font-body">{product.rating}</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <p className="text-2xl font-heading font-semibold text-accent">GH¢{getDiscountedPrice(product.price).toFixed(2)}</p>
                <p className="text-base font-body text-muted-foreground line-through">GH¢{product.price.toFixed(2)}</p>
                <span className="text-[10px] letter-spacing-wide uppercase font-body font-semibold bg-accent text-accent-foreground px-2 py-1 rounded-sm">{DISCOUNT_LABEL}</span>
              </div>

              <p className="text-muted-foreground font-body leading-relaxed mb-6">{product.description}</p>

              {/* Fragrance Notes (only for scents) */}
              {product.notes && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {(["top", "middle", "base"] as const).map((note) => (
                    <div key={note} className="bg-card border border-border rounded-sm p-3">
                      <span className="text-[10px] letter-spacing-luxury uppercase font-body text-muted-foreground block mb-1">{note} Notes</span>
                      <p className="text-xs font-body text-foreground">{product.notes![note].join(", ")}</p>
                    </div>
                  ))}
                </div>
              )}

              {product.availableSizes && product.availableSizes.length > 0 ? (
                <div className="mb-4">
                  <p className="text-xs letter-spacing-luxury uppercase font-body text-muted-foreground mb-2">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[3rem] px-3 py-2 text-sm font-body border rounded-sm transition-all ${
                          selectedSize === s
                            ? "bg-foreground text-background border-foreground"
                            : "bg-transparent text-foreground border-border hover:border-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : product.size ? (
                <p className="text-sm font-body text-muted-foreground mb-2">Size: {product.size}</p>
              ) : null}
              <p className={`text-sm font-body mb-6 ${product.stock > 5 ? "text-green-600" : product.stock > 0 ? "text-amber-600" : "text-destructive"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center border border-border rounded-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"><Minus size={16} /></button>
                  <span className="px-4 py-2 font-body text-sm text-foreground border-x border-border min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"><Plus size={16} /></button>
                </div>
                <button onClick={handleAddToCart} disabled={product.stock <= 0}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-gold text-accent-foreground py-3 text-sm letter-spacing-luxury uppercase font-body font-semibold hover:shadow-gold transition-all duration-300 disabled:opacity-50 rounded-sm">
                  <ShoppingBag size={16} /> Add to Cart
                </button>
                <button onClick={() => { toggleWishlist(product); toast({ title: wishlisted ? "Removed from wishlist" : "Added to wishlist" }); }}
                  className={`w-12 h-12 border rounded-sm flex items-center justify-center transition-colors ${
                    wishlisted ? "border-accent text-accent" : "border-border text-foreground hover:text-accent hover:border-accent"
                  }`} aria-label="Toggle wishlist">
                  <Heart size={18} strokeWidth={1.5} className={wishlisted ? "fill-current" : ""} />
                </button>
              </div>
            </motion.div>
          </div>

          <ProductReviews productId={product.id} />

          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
                {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
