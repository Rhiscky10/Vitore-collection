import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, ChevronDown } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ProductCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import PromoSection from "@/components/PromoSection";
import { products } from "@/data/products";
import heroImage from "@/assets/hero-lifestyle.jpg";
import brandStory from "@/assets/brand-story-new.jpg";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

// Pull one featured pick from each category to reflect the full lifestyle range
const featuredCategories = ["signature-scents", "beauty-essentials", "everyday-style", "footwear-apparel"] as const;
const featuredProducts = featuredCategories
  .map(cat => products.find(p => p.category === cat))
  .filter((p): p is NonNullable<typeof p> => Boolean(p))
  .slice(0, 4);

const testimonials = [
  { name: "Isabelle R.", text: "Vitoré has become my go-to for everything — the scents, the accessories, even the comfort essentials. It all feels considered.", rating: 5 },
  { name: "James L.", text: "I came for the perfume and stayed for the wardrobe pieces. Quality is consistent across every category.", rating: 5 },
  { name: "Sophia M.", text: "A real lifestyle brand. From my morning routine to my evening look, Vitoré shows up in the best way.", rating: 5 },
];

const faqs = [
  { q: "What kind of brand is Vitoré?", a: "Vitoré is a modern lifestyle brand. We curate signature scents, beauty essentials, everyday style accessories, footwear & apparel, and comfort care — everything you need to live well, look polished, and feel cared for." },
  { q: "What makes Vitoré products unique?", a: "Every product is selected with intention — quality materials, considered design, and a focus on how it actually fits into your daily life. Whether it's a fragrance, a tote, a pair of slippers, or a heat pad, the standard is the same." },
  { q: "Do you only sell to women?", a: "No. While many of our pieces are designed with the modern woman in mind, our scents, footwear, jerseys, and accessories include unisex and men's options too." },
  { q: "What is your return policy?", a: "All sales are final. We will only consider a refund or replacement if there is a clear error on our part — such as the wrong item being sent or a verified product defect." },
  { q: "Do you ship across Ghana?", a: "Yes, we ship across Ghana. Orders typically arrive within 1–5 business days depending on your location, and 7–14 business days for international orders." },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Vitoré lifestyle products collection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 md:px-8 py-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="max-w-2xl">
            <span className="text-xs letter-spacing-luxury uppercase font-body text-accent mb-4 block">Scent · Beauty · Style · Comfort</span>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              A Lifestyle <span className="text-gradient-gold italic font-light">Worth Living</span>
            </h1>
            <p className="text-base md:text-lg text-primary-foreground/70 font-body leading-relaxed mb-10 max-w-lg">
              Signature scents, beauty essentials, everyday style, footwear & apparel, and comfort care — curated lifestyle essentials for the way you live now.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-gold text-accent-foreground px-8 py-4 text-sm letter-spacing-luxury uppercase font-body font-semibold hover:shadow-gold transition-all duration-300">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground px-8 py-4 text-sm letter-spacing-luxury uppercase font-body font-medium hover:bg-primary-foreground/10 transition-all duration-300">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/50">
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* Launch Day Promo (toggle in admin) */}
      <PromoSection />

      {/* Brand Story */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="overflow-hidden rounded-sm">
                <img src={brandStory} alt="Vitoré atelier" className="w-full h-[500px] object-cover" loading="lazy" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <span className="text-xs letter-spacing-luxury uppercase font-body text-accent">Our Heritage</span>
              <h2 className="font-heading text-3xl md:text-4xl font-semibold mt-3 mb-6 text-foreground">More Than a Store — A Lifestyle</h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                Vitoré was born from a love of considered, everyday living. Across scents, beauty, accessories, footwear & apparel, and comfort care, every product is chosen to make the small moments of your day feel a little more intentional.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed mb-8">
                We believe lifestyle luxury should be accessible — that the right pair of slippers, the right scent, or the right tote can quietly change how a day feels. That's the Vitoré promise.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-accent font-body text-sm letter-spacing-wide uppercase font-semibold hover:gap-3 transition-all duration-300">
                Discover Our Story <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeading subtitle="The Collection" title="Featured Picks" description="A taste of the Vitoré world — from signature scents to everyday style, footwear, and beauty essentials." />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/shop" className="inline-flex items-center gap-2 border border-foreground text-foreground px-8 py-4 text-sm letter-spacing-luxury uppercase font-body font-medium hover:bg-foreground hover:text-background transition-all duration-300">
              View Full Collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeading subtitle="Testimonials" title="What Our Clients Say" description="Discover why our clients love Vitoré." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-card p-8 rounded-sm border border-border">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (<Star key={j} size={14} className="fill-accent text-accent" />))}
                </div>
                <p className="text-foreground font-accent text-lg italic leading-relaxed mb-6">"{t.text}"</p>
                <p className="text-sm text-muted-foreground font-body letter-spacing-wide uppercase">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <SectionHeading subtitle="FAQ" title="Frequently Asked Questions" />
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

      {/* Newsletter */}
      <section className="py-20 md:py-28 bg-gradient-luxury">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-2xl">
          <SectionHeading subtitle="Stay Connected" title="Join the Vitoré Family" description="Be the first to discover new products, exclusive offers, and self-care tips." light />
          <NewsletterSignup variant="dark" source="homepage" />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
