export type ProductCategory =
  | "signature-scents"
  | "beauty-essentials"
  | "everyday-style"
  | "footwear-apparel"
  | "comfort-care";

export type ProductGender = "men" | "women" | "unisex";

export type ProductSubcategory =
  // Signature Scents
  | "perfume" | "body-splash"
  // Beauty Essentials
  | "lip-combo"
  // Everyday Style (accessories)
  | "tote" | "necklace" | "headband" | "scrunchie" | "bow-cap"
  // Footwear & Apparel
  | "shoes" | "slippers" | "jersey"
  // Comfort Care
  | "heat-pad" | "wet-wipes" | "water-bottle";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
  gender: ProductGender;
  subcategory: ProductSubcategory;
  family: string;
  description: string;
  notes?: { top: string[]; middle: string[]; base: string[] };
  size: string;
  rating: number;
  stock: number;
  /** When true, pricing skips the automatic 7% discount (used for promo combos). */
  noDiscount?: boolean;
  /** Optional add-on cost for personalization (e.g. jersey name/number printing). */
  customizationFee?: number;
  /** Optional list of selectable sizes (footwear, slippers, jerseys, etc.). */
  availableSizes?: string[];
}

export const categoryLabels: Record<ProductCategory, string> = {
  "signature-scents": "Vitoré Signature Scents",
  "beauty-essentials": "Vitoré Beauty Essentials",
  "everyday-style": "Vitoré Everyday Style",
  "footwear-apparel": "Vitoré Footwear & Apparel",
  "comfort-care": "Vitoré Comfort Care",
};

export const subcategoryLabels: Record<ProductSubcategory, string> = {
  "perfume": "Perfumes",
  "body-splash": "Body Splashes",
  "lip-combo": "Lip Combos",
  "tote": "Tote Bags",
  "necklace": "Necklaces",
  "headband": "Headbands",
  "scrunchie": "Scrunchies",
  "bow-cap": "Bow Caps",
  "shoes": "Shoes",
  "slippers": "Slippers",
  "jersey": "Jerseys (Customizable)",
  "heat-pad": "Menstrual Heat Pads",
  "wet-wipes": "Wet Wipes",
  "water-bottle": "Water Bottles",
};
