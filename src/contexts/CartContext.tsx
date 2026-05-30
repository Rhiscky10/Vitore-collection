import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/data/products";
import { getDiscountedPrice } from "@/lib/pricing";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);
const STORAGE_KEY = "vitore_cart_v1";

export const useCart = () => useContext(CartContext);

const sameLine = (a: CartItem, productId: string, size?: string) =>
  a.product.id === productId && (a.selectedSize ?? "") === (size ?? "");

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items]);

  const addToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, product.id, selectedSize));
      if (existing) {
        return prev.map((i) =>
          sameLine(i, product.id, selectedSize)
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
            : i
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock), selectedSize }];
    });
  };

  const removeFromCart = (productId: string, selectedSize?: string) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, productId, selectedSize)));
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) return removeFromCart(productId, selectedSize);
    setItems((prev) =>
      prev.map((i) =>
        sameLine(i, productId, selectedSize)
          ? { ...i, quantity: Math.min(quantity, i.product.stock) }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce(
    (s, i) => s + (i.product.noDiscount ? i.product.price : getDiscountedPrice(i.product.price)) * i.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
