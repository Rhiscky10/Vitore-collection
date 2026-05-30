import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  products as hardcodedProducts,
  Product,
  ProductCategory,
  ProductSubcategory,
} from "@/data/products";
import placeholder from "@/assets/heatpad-1.jpg";

const mapDbRow = (row: any): Product => ({
  id: row.id,
  name: row.name,
  price: Number(row.price) || 0,
  image: row.image_url || placeholder,
  category: (row.category as ProductCategory) || "signature-scents",
  gender: "unisex",
  subcategory: (row.subcategory as ProductSubcategory) || "perfume",
  family: "",
  description: row.description || "",
  size: Array.isArray(row.sizes) && row.sizes.length ? row.sizes[0] : "",
  rating: 5,
  stock: Number(row.stock) || 0,
  customizationFee: row.customization_fee ? Number(row.customization_fee) : undefined,
  availableSizes: Array.isArray(row.sizes) && row.sizes.length ? row.sizes : undefined,
});

export const useAllProducts = () => {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      setDbProducts((data ?? []).map(mapDbRow));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products: [...dbProducts, ...hardcodedProducts], loading };
};
