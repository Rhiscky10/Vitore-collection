import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import brandStory from "@/assets/brand-story-new.jpg";
import { Gem, Leaf, Globe, Heart } from "lucide-react";

const values = [
  { icon: Gem, title: "Excellence", description: "We accept nothing less than perfection in every product we create." },
  { icon: Leaf, title: "Sustainability", description: "Ethical sourcing and eco-conscious practices guide every decision." },
  { icon: Globe, title: "Heritage", description: "Rooted in Ghanaian creativity, inspired by the world." },
  { icon: Heart, title: "Passion", description: "Every product is born from genuine love for beauty and self-care." },
];

const About = () => {
  return (
    <Layout>
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeading subtitle="Our Story" title="The World of Vitoré" description="A brand built on elegance, self-expression, and the pursuit of everyday luxury." />
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="overflow-hidden rounded-sm">
              <img src={brandStory} alt="Vitoré lifestyle brand workspace" className="w-full h-[500px] object-cover" loading="lazy" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h3 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-6">Born from a Vision</h3>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                Vitoré is a modern lifestyle brand built on a simple belief: the things you wear, carry, and care for every day should make you feel confident, beautiful, and at ease. We curate a thoughtful world of products that move with you from morning routines to nights out, from quiet self-care moments to bold self-expression.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                Our collection spans five worlds — <strong className="text-foreground">Signature Scents</strong> for the way you want to be remembered, <strong className="text-foreground">Beauty Essentials</strong> for everyday polish, <strong className="text-foreground">Everyday Style</strong> accessories that finish a look, <strong className="text-foreground">Footwear & Apparel</strong> built for comfort and personality, and <strong className="text-foreground">Comfort Care</strong> essentials that look after your wellbeing.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed">
                Every Vitoré product is chosen and designed with intention — because lifestyle is more than what you buy, it's how you live.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gradient-luxury">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="text-xs letter-spacing-luxury uppercase font-body text-accent mb-4 block">Our Mission</span>
            <p className="font-heading text-2xl md:text-3xl font-light text-primary-foreground leading-relaxed italic mb-16">
              "To empower confident, modern living — bringing scent, beauty, style, comfort, and care together as one accessible everyday luxury."
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
            <span className="text-xs letter-spacing-luxury uppercase font-body text-accent mb-4 block">Our Vision</span>
            <p className="font-heading text-2xl md:text-3xl font-light text-primary-foreground leading-relaxed italic">
              "To be Ghana's most loved lifestyle brand, where quality meets beauty and every product tells a story."
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeading subtitle="What We Stand For" title="Our Core Values" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} className="text-center p-8">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5">
                  <v.icon size={24} className="text-accent" strokeWidth={1.5} />
                </div>
                <h4 className="font-heading text-lg font-semibold text-foreground mb-3">{v.title}</h4>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="text-xs letter-spacing-luxury uppercase font-body text-accent mb-4 block">From the Founder</span>
            <p className="font-accent text-xl md:text-2xl text-foreground leading-relaxed italic mb-8">
              "Vitoré is more than a brand — it's a lifestyle. Every product we offer, from a signature scent to the shoes on your feet, is a reminder that everyday living deserves beauty, comfort, and confidence."
            </p>
            <p className="text-sm text-muted-foreground font-body letter-spacing-wide uppercase">— Founder, Vitoré</p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
