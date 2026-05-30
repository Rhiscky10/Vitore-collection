import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PromoSettings {
  id: string;
  is_active: boolean;
  atomizer_offer_active: boolean;
  headline: string;
  subheadline: string;
}

export interface PromoCombo {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  stock: number;
  sort_order: number;
  is_active: boolean;
}

export const usePromo = () => {
  const [settings, setSettings] = useState<PromoSettings | null>(null);
  const [combos, setCombos] = useState<PromoCombo[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [{ data: s }, { data: c }] = await Promise.all([
      supabase.from("launch_promo_settings").select("*").limit(1).maybeSingle(),
      supabase.from("promo_combos").select("*").order("sort_order", { ascending: true }),
    ]);
    setSettings((s as PromoSettings | null) ?? null);
    setCombos((c as PromoCombo[] | null) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { settings, combos, loading, refresh };
};
