import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Ghost } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-charcoal text-primary-foreground">
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-heading text-2xl font-bold tracking-wider text-primary-foreground">Vitoré</span>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-relaxed mb-6 font-body">
              A modern lifestyle brand — curating signature scents, beauty essentials, everyday style, footwear & apparel, and comfort care for confident living.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/50 hover:text-accent transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="https://snapchat.com/t/XRW6QHYk" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/50 hover:text-accent transition-colors" aria-label="Snapchat"><Ghost size={20} /></a>
              <a href="https://wa.me/233206363325" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/50 hover:text-accent transition-colors" aria-label="WhatsApp"><MessageCircle size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm letter-spacing-luxury uppercase mb-6 text-accent">Explore</h4>
            <ul className="space-y-3">
              {[{ to: "/shop", label: "Collection" }, { to: "/about", label: "Our Story" }, { to: "/contact", label: "Contact" }, { to: "/faq", label: "FAQ" }].map((link) => (
                <li key={link.to}><Link to={link.to} className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm letter-spacing-luxury uppercase mb-6 text-accent">Policies</h4>
            <ul className="space-y-3">
              {[{ to: "/privacy", label: "Privacy Policy" }, { to: "/terms", label: "Terms of Service" }, { to: "/returns", label: "Returns & Refunds" }, { to: "/shipping", label: "Shipping Info" }].map((link) => (
                <li key={link.to}><Link to={link.to} className="text-sm text-primary-foreground/60 hover:text-accent transition-colors font-body">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm letter-spacing-luxury uppercase mb-6 text-accent">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60 font-body">
              <li>vitorecollection74@gmail.com</li>
              <li>Accra, Ghana</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-16 pt-8 text-center">
          <p className="text-xs text-primary-foreground/40 font-body letter-spacing-wide">
            © {new Date().getFullYear()} Vitoré. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
