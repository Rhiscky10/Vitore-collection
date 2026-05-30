import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { getDiscountedPrice, DISCOUNT_LABEL } from "@/lib/pricing";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) {
      toast({ title: "Out of stock", variant: "destructive" });
      return;
    }
    addToCart(product);
    toast({ title: `${product.name} added to cart` });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast({ title: wishlisted ? "Removed from wishlist" : "Added to wishlist" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden bg-card rounded-sm mb-3">
          <div className="aspect-[3/4] overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
          </div>
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-500 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button onClick={handleToggleWishlist}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                wishlisted ? "bg-accent text-accent-foreground" : "bg-background/90 text-foreground hover:bg-accent hover:text-accent-foreground"
              }`} aria-label="Toggle wishlist">
              <Heart size={16} strokeWidth={1.5} className={wishlisted ? "fill-current" : ""} />
            </button>
            <button onClick={handleAddToCart} className="w-9 h-9 rounded-full bg-background/90 flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Add to cart">
              <ShoppingBag size={16} strokeWidth={1.5} />
            </button>
          </div>
          <span className="absolute top-2 left-2 flex flex-col gap-1 items-start">
            <span className="text-[9px] letter-spacing-luxury uppercase font-body font-medium bg-background/90 px-2 py-0.5 rounded-sm text-foreground">
              {product.subcategory.replace("-", " ")}
            </span>
            <span className="text-[9px] letter-spacing-wide uppercase font-body font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-sm">
              {DISCOUNT_LABEL}
            </span>
          </span>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-2 right-2 text-[9px] letter-spacing-wide uppercase font-body font-medium bg-amber-500/90 px-2 py-0.5 rounded-sm text-white">
              Only {product.stock} left
            </span>
          )}
          {product.stock <= 0 && (
            <span className="absolute top-2 right-2 text-[9px] letter-spacing-wide uppercase font-body font-medium bg-destructive/90 px-2 py-0.5 rounded-sm text-white">
              Sold Out
            </span>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={10} className={i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"} />
            ))}
          </div>
          <h3 className="font-heading text-sm font-semibold text-foreground">{product.name}</h3>
          <p className="text-[10px] text-muted-foreground font-body letter-spacing-wide uppercase">{product.family} · {product.size}</p>
          <div className="flex items-center gap-2">
            <p className="font-heading text-sm text-accent font-semibold">GH¢{getDiscountedPrice(product.price).toFixed(2)}</p>
            <p className="font-body text-xs text-muted-foreground line-through">GH¢{product.price.toFixed(2)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
