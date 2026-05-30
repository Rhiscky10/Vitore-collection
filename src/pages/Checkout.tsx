import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, CheckCircle, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getDiscountedPrice } from "@/lib/pricing";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const ref = searchParams.get("reference") || searchParams.get("trxref");
    if (ref) verifyPayment(ref);
  }, [searchParams]);

  const verifyPayment = async (reference: string) => {
    setVerifying(true);
    try {
      const res = await supabase.functions.invoke("paystack-verify", { body: { reference } });
      if (res.error) throw new Error(res.error.message || "Verification failed");
      const data = res.data as { status?: string } | null;
      if (data?.status === "paid") {
        setPaymentSuccess(true);
        clearCart();
        toast({ title: "Payment successful! 🎉" });
      } else if (data?.status === "cancelled" || data?.status === "failed") {
        toast({ title: "Payment was not completed", variant: "destructive" });
      } else {
        toast({ title: "Payment is still pending. Check Orders shortly." });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not verify payment";
      toast({ title: msg, variant: "destructive" });
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <Layout>
        <section className="pt-28 pb-20 md:pt-36 md:pb-28 min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin text-accent mx-auto mb-4" />
            <p className="font-heading text-xl text-foreground">Verifying your payment...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (paymentSuccess) {
    return (
      <Layout>
        <section className="pt-28 pb-20 md:pt-36 md:pb-28 min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <CheckCircle size={56} className="text-green-500 mx-auto mb-6" />
            <h1 className="font-heading text-3xl font-bold text-foreground mb-3">Order Confirmed!</h1>
            <p className="text-muted-foreground font-body mb-8">Thank you for your purchase. You can view your order in your order history.</p>
            <div className="flex flex-col gap-3">
              <Link to="/orders" className="bg-gradient-gold text-accent-foreground py-3 px-8 text-sm letter-spacing-luxury uppercase font-body font-semibold hover:shadow-gold transition-all rounded-sm text-center">
                View Orders
              </Link>
              <Link to="/shop" className="border border-border text-foreground py-3 px-8 text-sm letter-spacing-luxury uppercase font-body font-medium hover:bg-secondary transition-colors rounded-sm text-center">
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <section className="pt-28 pb-20 md:pt-36 md:pb-28 min-h-[60vh] flex items-center">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h1 className="font-heading text-3xl text-foreground mb-4">No items to checkout</h1>
            <Link to="/shop" className="text-accent hover:underline font-body">Continue Shopping</Link>
          </div>
        </section>
      </Layout>
    );
  }

  const handleCheckout = async () => {
    if (!email.trim()) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return;
    }
    if (!deliveryLocation.trim()) {
      toast({ title: "Please enter your delivery location", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((i) => ({ id: i.product.id, name: i.product.name, quantity: i.quantity, price: getDiscountedPrice(i.product.price), size: i.selectedSize ?? null }));
      const grandTotal = totalPrice;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{
          user_id: user?.id || null,
          email,
          phone: phone || null,
          delivery_location: deliveryLocation,
          items: orderItems,
          total_amount: grandTotal,
          currency: "GHS",
          payment_status: "pending",
        }] as any)
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);

      const invokeRes = await supabase.functions.invoke("paystack-checkout", {
        body: {
          orderId: (order as any).id,
          channels: ["card", "mobile_money", "bank_transfer"],
          callback_url: `${window.location.origin}/checkout`,
        },
      });

      if (invokeRes.error) throw new Error(invokeRes.error.message || "Could not start payment");
      const data = invokeRes.data as { authorization_url?: string; reference?: string } | null;
      if (!data?.authorization_url) throw new Error("Could not initiate payment");
      window.location.href = data.authorization_url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Checkout failed";
      toast({ title: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Cart
          </Link>

          <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Checkout</h1>

          {/* Order Summary */}
          <div className="bg-card border border-border rounded-sm p-6 mb-8">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Order Summary</h2>
            {items.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize ?? ""}`} className="flex justify-between text-sm font-body py-2 border-b border-border last:border-0">
                <span className="text-foreground">
                  {item.product.name}{item.selectedSize ? ` (Size ${item.selectedSize})` : ""} × {item.quantity}
                </span>
                <span className="text-foreground">GH¢{(getDiscountedPrice(item.product.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between mt-4 pt-4 border-t border-border">
              <span className="font-heading font-semibold text-foreground">Total (7% discount applied)</span>
              <span className="font-heading text-lg font-semibold text-accent">GH¢{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-card border border-border rounded-sm p-6 mb-8">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Contact &amp; Delivery</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs letter-spacing-luxury uppercase font-body text-muted-foreground mb-2 block">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                  placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-xs letter-spacing-luxury uppercase font-body text-muted-foreground mb-2 block">Phone Number (optional)</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                  placeholder="0XX XXX XXXX" />
              </div>
            <div>
                <label className="text-xs letter-spacing-luxury uppercase font-body text-muted-foreground mb-2 block">Delivery Location</label>
                <textarea value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded-sm font-body text-sm text-foreground focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="House number, street, neighborhood, city, region, landmark..." />
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-card border border-border rounded-sm p-6 mb-8">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">What Happens Next</h2>
            <ol className="list-decimal list-inside space-y-3 font-body text-sm text-muted-foreground">
              <li className="pl-2">
                <span className="text-foreground font-medium">You will receive payment instructions via phone or inbox shortly after placing your order (Authorise Payment).</span>
              </li>
              <li className="pl-2">
                <span className="text-foreground font-medium">Confirm Your Payment</span> – Complete your payment, then send a screenshot of the confirmation to <span className="text-accent">0206363325</span> or <span className="text-accent">vitorecollection74@gmail.com</span>. You'll receive an acknowledgment via email or SMS once received.
              </li>
              <li className="pl-2">
                <span className="text-foreground font-medium">Relax While We Handle the Rest</span> – Your order will be processed and shipped within 1–3 business days after payment confirmation.
              </li>
            </ol>
          </div>

          {/* Payment notice */}
          <div className="bg-card border border-border rounded-sm p-6 mb-8 flex items-start gap-3">
            <ShieldCheck size={20} className="text-accent shrink-0 mt-0.5" />
            <div>
              <h2 className="font-heading text-base font-semibold text-foreground mb-1">Secure Payment via Paystack</h2>
              <p className="text-xs text-muted-foreground font-body">
                You'll be redirected to Paystack's secure page where you can choose Card, Mobile Money (MTN, Telecel, AirtelTigo) or Bank Transfer and enter your details to complete payment.
              </p>
            </div>
          </div>

          <button onClick={handleCheckout} disabled={loading}
            className="w-full bg-gradient-gold text-accent-foreground py-4 text-sm letter-spacing-luxury uppercase font-body font-semibold hover:shadow-gold transition-all duration-300 disabled:opacity-50 rounded-sm flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Redirecting...</> : `Pay GH¢${totalPrice.toFixed(2)}`}
          </button>

          <p className="text-center text-xs text-muted-foreground font-body mt-4">
            Secured by Paystack. Your payment information is encrypted and secure.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
