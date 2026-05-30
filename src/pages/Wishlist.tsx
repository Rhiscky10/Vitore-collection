import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";

const Wishlist = () => {
  const { items } = useWishlist();

  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 min-h-[60vh]">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
          <p className="text-sm text-muted-foreground font-body mb-10">{items.length} item{items.length !== 1 ? "s" : ""}</p>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={48} className="mx-auto text-muted-foreground mb-4" strokeWidth={1} />
              <p className="font-heading text-xl text-foreground mb-2">Your wishlist is empty</p>
              <p className="text-muted-foreground font-body mb-8">Save your favorite items to revisit later</p>
              <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-gold text-accent-foreground px-8 py-4 text-sm letter-spacing-luxury uppercase font-body font-semibold hover:shadow-gold transition-all duration-300 rounded-sm">
                Browse Products <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {items.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Wishlist;
