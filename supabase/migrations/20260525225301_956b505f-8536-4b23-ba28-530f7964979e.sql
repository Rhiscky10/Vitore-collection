
-- Settings (single-row pattern)
CREATE TABLE public.launch_promo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active boolean NOT NULL DEFAULT false,
  atomizer_offer_active boolean NOT NULL DEFAULT false,
  headline text NOT NULL DEFAULT 'Launch Day · June 1st',
  subheadline text NOT NULL DEFAULT 'Grab a combo for GH¢150 — only 10 in stock per combo. Buy any 2 perfumes and get a FREE atomizer.',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.launch_promo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view promo settings"
  ON public.launch_promo_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert promo settings"
  ON public.launch_promo_settings FOR INSERT TO authenticated
  WITH CHECK (is_admin(auth.email()));

CREATE POLICY "Admins can update promo settings"
  ON public.launch_promo_settings FOR UPDATE TO authenticated
  USING (is_admin(auth.email()));

CREATE POLICY "Admins can delete promo settings"
  ON public.launch_promo_settings FOR DELETE TO authenticated
  USING (is_admin(auth.email()));

-- Seed one row
INSERT INTO public.launch_promo_settings (is_active, atomizer_offer_active) VALUES (false, false);

-- Combos
CREATE TABLE public.promo_combos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  price numeric NOT NULL DEFAULT 150,
  stock integer NOT NULL DEFAULT 10,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.promo_combos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view promo combos"
  ON public.promo_combos FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert promo combos"
  ON public.promo_combos FOR INSERT TO authenticated
  WITH CHECK (is_admin(auth.email()));

CREATE POLICY "Admins can update promo combos"
  ON public.promo_combos FOR UPDATE TO authenticated
  USING (is_admin(auth.email()));

CREATE POLICY "Admins can delete promo combos"
  ON public.promo_combos FOR DELETE TO authenticated
  USING (is_admin(auth.email()));

CREATE TRIGGER trg_promo_settings_updated
  BEFORE UPDATE ON public.launch_promo_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_promo_combos_updated
  BEFORE UPDATE ON public.promo_combos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
