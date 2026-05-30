
-- Admin emails whitelist table
CREATE TABLE public.admin_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- Only admins can view the whitelist
CREATE POLICY "Admins can view admin emails"
  ON public.admin_emails FOR SELECT TO authenticated
  USING (
    auth.email() IN (SELECT email FROM public.admin_emails)
  );

-- Insert initial admin email
INSERT INTO public.admin_emails (email) VALUES ('rhis.cky10@gmail.com');

-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT TO authenticated
  USING (
    auth.email() IN (SELECT email FROM public.admin_emails)
  );

-- Allow admins to update all orders (for status changes)
CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE TO authenticated
  USING (
    auth.email() IN (SELECT email FROM public.admin_emails)
  );

-- Allow admins to manage products
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (
    auth.email() IN (SELECT email FROM public.admin_emails)
  );

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE TO authenticated
  USING (
    auth.email() IN (SELECT email FROM public.admin_emails)
  );

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE TO authenticated
  USING (
    auth.email() IN (SELECT email FROM public.admin_emails)
  );

-- Allow admins to view all profiles (for customer list)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    auth.email() IN (SELECT email FROM public.admin_emails)
  );
