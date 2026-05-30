import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { getDiscountedPrice } from "@/lib/pricing";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <section className="pt-28 pb-20 md:pt-36 md:pb-28 min-h-[60vh] flex items-center">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" strokeWidth={1} />
            <h1 className="font-heading text-3xl text-foreground mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground font-body mb-8">Discover our products</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-gold text-accent-foreground px-8 py-4 text-sm letter-spacing-luxury uppercase font-body font-semibold hover:shadow-gold transition-all duration-300 rounded-sm">
              Shop Now <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground font-body mb-10">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>

          <div className="space-y-6">
            {items.map((item) => (
              <motion.div key={`${item.product.id}-${item.selectedSize ?? ""}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex gap-4 md:gap-6 bg-card border border-border rounded-sm p-4">
                <Link to={`/product/${item.product.id}`} className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 overflow-hidden rounded-sm">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`} className="font-heading text-base font-semibold text-foreground hover:text-accent transition-colors">{item.product.name}</Link>
                  <p className="text-xs text-muted-foreground font-body">
                    {item.product.family}
                    {item.selectedSize ? ` · Size: ${item.selectedSize}` : item.product.size ? ` · ${item.product.size}` : ""}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.product.noDiscount ? (
                      <p className="text-sm font-heading font-semibold text-accent">GH¢{item.product.price.toFixed(2)}</p>
                    ) : (
                      <>
                        <p className="text-sm font-heading font-semibold text-accent">GH¢{getDiscountedPrice(item.product.price).toFixed(2)}</p>
                        <p className="text-xs font-body text-muted-foreground line-through">GH¢{item.product.price.toFixed(2)}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeFromCart(item.product.id, item.selectedSize)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button>
                  <div className="flex items-center border border-border rounded-sm">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize)} className="px-2 py-1 text-foreground hover:bg-secondary transition-colors"><Minus size={14} /></button>
                    <span className="px-3 py-1 text-sm font-body text-foreground border-x border-border">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize)} className="px-2 py-1 text-foreground hover:bg-secondary transition-colors"><Plus size={14} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 bg-card border border-border rounded-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-body text-sm text-muted-foreground">Subtotal</span>
              <span className="font-heading text-lg font-semibold text-foreground">GH¢{totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground font-body mb-6">Shipping calculated at checkout</p>
            <Link to="/checkout"
              className="block w-full bg-gradient-gold text-accent-foreground py-4 text-sm letter-spacing-luxury uppercase font-body font-semibold hover:shadow-gold transition-all duration-300 rounded-sm text-center">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
