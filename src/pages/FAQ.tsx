import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How long does shipping take?", a: "Delivery depends on your location: 1 business day for Accra, 1–2 days for Greater Accra, 2–3 days for other regions in Ghana, and 7–14 days for international orders." },
  { q: "Can I return or exchange a product?", a: "All sales are final. Refunds or exchanges are only possible if Vitoré made a clear mistake, like sending the wrong item or a verified product defect." },
  { q: "What payment methods do you accept?", a: "We accept Mobile Money, Bank Transfers, and Cash payments within Ghana. Payment on Delivery is not available." },
  { q: "What does Vitoré sell?", a: "Vitoré is a lifestyle brand. Our collection spans Signature Scents, Beauty Essentials, Everyday Style accessories, Footwear & Apparel (including customizable jerseys), and Comfort Care essentials like heat pads, wet wipes, and water bottles." },
  { q: "Are your products safe for daily use?", a: "Yes. All our fragrances, beauty, apparel, and personal care items are selected for everyday use. For those with allergies or sensitive skin, we recommend checking ingredients and testing new products carefully." },
  { q: "Can I track my order?", a: "Yes! Once your order has departed with the dispatch rider, you will be notified by text or WhatsApp. Do have your phone by you at all times, as delivery is ongoing." },
  { q: "How do I get in touch if I have a question or issue?", a: "Reach us at support@vitore.com or via our hotline at +233 (Vitoré hotline). We respond promptly and are happy to help." },
];

const FAQ = () => {
  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <SectionHeading subtitle="Help Center" title="Frequently Asked Questions" description="Find answers to common questions about our products, shipping, and services." />
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-sm px-6">
                <AccordionTrigger className="font-heading text-base font-medium text-foreground hover:text-accent py-5">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-body leading-relaxed pb-5">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
