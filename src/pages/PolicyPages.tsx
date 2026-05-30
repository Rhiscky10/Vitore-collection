import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";

const PolicyPage = ({ subtitle, title, children }: { subtitle: string; title: string; children: React.ReactNode }) => (
  <Layout>
    <section className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <SectionHeading subtitle={subtitle} title={title} />
        <div className="prose prose-sm max-w-none font-body text-muted-foreground leading-relaxed space-y-6">{children}</div>
      </div>
    </section>
  </Layout>
);

export const PrivacyPolicy = () => (
  <PolicyPage subtitle="Legal" title="Privacy Policy">
    <p><strong className="text-foreground">Last Updated:</strong> February 27, 2026</p>
    <p className="text-lg font-medium text-foreground">Your Trust Matters.</p>
    <p>At Vitoré, we sell lifestyle products — scents, beauty, accessories, footwear & apparel, and comfort care essentials — not data empires. This policy explains what information we collect, how we use it, and your rights, in plain, simple language.</p>

    <h3 className="font-heading text-foreground text-lg font-semibold mt-8">1. What We Collect</h3>
    <p><strong className="text-foreground">Order Details:</strong> Your name, shipping address, phone number, and email so we can fulfill and track your orders.</p>
    <p><strong className="text-foreground">Payment Information:</strong> We do not store your card details. Payments are securely processed by trusted payment providers.</p>
    <p><strong className="text-foreground">Browsing Data:</strong> Basic info such as device type, browser, and IP address to ensure our website works smoothly on your phone or laptop.</p>

    <h3 className="font-heading text-foreground text-lg font-semibold mt-8">2. How We Use It</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li>To process, pack, and deliver your orders.</li>
      <li>To respond to your messages or inquiries.</li>
      <li>To improve our website and shopping experience.</li>
    </ul>

    <h3 className="font-heading text-foreground text-lg font-semibold mt-8">Contact Us</h3>
    <p>If you have questions about this Privacy Policy, please contact us at support@vitore.com.</p>
  </PolicyPage>
);

export const TermsOfService = () => (
  <PolicyPage subtitle="Legal" title="Terms of Service">
    <p><strong className="text-foreground">Effective:</strong> March 2, 2026</p>
    <p>Welcome to Vitoré. These Terms of Service ("Terms") are a legally binding agreement between you ("you" or "customer") and Vitoré ("we," "us," or "our") governing your access to our website, purchases, and related services. By visiting, registering, or buying from Vitoré, you agree to these terms in full.</p>

    <h3 className="font-heading text-foreground text-lg font-semibold mt-8">1. Overview</h3>
    <p>These Terms apply to Vitoré's website, products, and services across all of our categories — Signature Scents, Beauty Essentials, Everyday Style, Footwear & Apparel, and Comfort Care. Any separate, written agreement between you and Vitoré (for collaborations, wholesale, or bespoke services) will override any conflicting provision in these Terms.</p>

    <h3 className="font-heading text-foreground text-lg font-semibold mt-8">2. Acceptance & Binding Agreement</h3>
    <p>By browsing, registering, ordering, or otherwise using our website or services, you acknowledge that you have read, understood, and agree to be bound by these Terms.</p>
  </PolicyPage>
);

export const ReturnPolicy = () => (
  <PolicyPage subtitle="Policies" title="Return & Refund Policy">
    <p className="text-lg font-medium text-foreground">About Returns and Getting Your Money Back.</p>
    <p>Thank you for shopping with Vitoré. Before completing your purchase, please take a moment to understand our policy on returns and refunds.</p>

    <h3 className="font-heading text-foreground text-lg font-semibold mt-8">All Sales Are Final</h3>
    <p>Because our lifestyle products — scents, beauty, accessories, footwear & apparel, and comfort care essentials — are carefully selected and prepared for you, all sales are final. We cannot accept returns or exchanges once your order leaves us.</p>
    <p>This ensures that every item arrives in perfect condition and maintains the quality we promise. By purchasing from Vitoré, you agree to these terms.</p>

    <h3 className="font-heading text-foreground text-lg font-semibold mt-8">Exceptions</h3>
    <p>We will only consider a refund or replacement if there is a clear error on our part, such as:</p>
    <ol className="list-decimal pl-5 space-y-2">
      <li>Sending the wrong item.</li>
      <li>A verified defect caused during handling or packing.</li>
    </ol>
    <p>Before you buy, please double-check your order details before completing your purchase. If you have any questions, reach out to us — we're happy to help.</p>

    <h3 className="font-heading text-foreground text-lg font-semibold mt-8">If a Refund Is Approved</h3>
    <p>If Vitoré confirms that a refund is due due to our error:</p>
    <ul className="list-disc pl-5 space-y-2">
      <li>We will notify you once your request has been reviewed and approved.</li>
      <li>Approved refunds will be processed to your original payment method within 10 business days.</li>
      <li>Depending on your bank or payment provider, it may take a few extra days for the refund to appear in your account.</li>
    </ul>

    <h3 className="font-heading text-foreground text-lg font-semibold mt-8">Still Haven't Seen Your Refund?</h3>
    <p>If you do not see your refund within 15 business days of approval, please contact us at: <strong className="text-foreground">support@vitore.com</strong></p>
    <p>We will be sure to look into it.</p>
  </PolicyPage>
);

export const ShippingInfo = () => (
  <PolicyPage subtitle="Policies" title="Shipping Information">
    <p className="text-lg font-medium text-foreground">Fast, reliable delivery for your Vitoré products.</p>

    <h3 className="font-heading text-foreground text-lg font-semibold mt-8">Delivery Times</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong className="text-foreground">Accra & Tema:</strong> 1–2 business days</li>
      <li><strong className="text-foreground">Greater Accra Region:</strong> 2–3 business days</li>
      <li><strong className="text-foreground">Other Regions in Ghana:</strong> 3–5 business days</li>
      <li><strong className="text-foreground">International Orders:</strong> 7–14 business days</li>
    </ul>
    <p>We pack every order carefully — from scents and beauty to footwear, apparel, and comfort essentials — so it arrives safely and on time. Delivery times may vary slightly depending on location, customs, or unforeseen events.</p>

    <h3 className="font-heading text-foreground text-lg font-semibold mt-8">📦 Packaging</h3>
    <p>All Vitoré products are carefully packed to arrive in perfect condition, whatever the category.</p>

    <h3 className="font-heading text-foreground text-lg font-semibold mt-8">🏠 Delivery</h3>
    <p>We bring your order right to your doorstep. Please make sure someone is available to receive it.</p>

    <h3 className="font-heading text-foreground text-lg font-semibold mt-8">💳 Payment</h3>
    <p>We accept Cash, Mobile Money, and Bank Payments. Unfortunately, we do not accept Payment on Delivery.</p>
  </PolicyPage>
);
