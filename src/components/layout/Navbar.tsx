import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Heart, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/95 backdrop-blur-md shadow-luxury py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <span className="font-heading text-2xl md:text-3xl font-bold tracking-wider text-foreground">Vitoré</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}
              className={`text-sm letter-spacing-luxury uppercase font-body font-medium transition-colors duration-300 hover:text-accent ${location.pathname === link.to ? "text-accent" : "text-foreground"}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-5">
          <Link to="/wishlist" className="relative text-foreground hover:text-accent transition-colors" aria-label="Wishlist">
            <Heart size={20} strokeWidth={1.5} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">{wishlistItems.length}</span>
            )}
          </Link>
          <Link to="/cart" className="relative text-foreground hover:text-accent transition-colors" aria-label="Cart">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">{totalItems}</span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="text-foreground hover:text-accent transition-colors" aria-label="Profile"><User size={20} strokeWidth={1.5} /></Link>
              <button onClick={async () => { await signOut(); navigate("/"); }} className="text-foreground hover:text-accent transition-colors" aria-label="Sign out"><LogOut size={20} strokeWidth={1.5} /></button>
            </>
          ) : (
            <Link to="/auth" className="text-foreground hover:text-accent transition-colors" aria-label="Sign in"><User size={20} strokeWidth={1.5} /></Link>
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground hover:text-accent transition-colors" aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
            className="md:hidden bg-background/98 backdrop-blur-md border-t border-border">
            <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}
                  className={`text-lg letter-spacing-wide uppercase font-body font-medium transition-colors ${location.pathname === link.to ? "text-accent" : "text-foreground"}`}>
                  {link.label}
                </Link>
              ))}
              <Link to="/wishlist" className="text-lg letter-spacing-wide uppercase font-body font-medium text-foreground">Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}</Link>
              <Link to="/cart" className="text-lg letter-spacing-wide uppercase font-body font-medium text-foreground">Cart {totalItems > 0 && `(${totalItems})`}</Link>
              {user ? (
                <>
                  <Link to="/profile" className="text-lg letter-spacing-wide uppercase font-body font-medium text-foreground">Profile</Link>
                  <button onClick={async () => { await signOut(); navigate("/"); }} className="text-lg letter-spacing-wide uppercase font-body font-medium text-foreground text-left">Sign Out</button>
                </>
              ) : (
                <Link to="/auth" className="text-lg letter-spacing-wide uppercase font-body font-medium text-foreground">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
