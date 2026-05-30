
-- Security definer helper to check admin without recursion
CREATE OR REPLACE FUNCTION public.is_admin(_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_emails WHERE email = _email)
$$;

-- admin_emails: drop recursive policy, add non-recursive
DROP POLICY IF EXISTS "Admins can view admin emails" ON public.admin_emails;
CREATE POLICY "Admins can view admin emails"
ON public.admin_emails
FOR SELECT
TO authenticated
USING (public.is_admin(auth.email()));

-- orders policies
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can update all orders"
ON public.orders FOR UPDATE TO authenticated
USING (public.is_admin(auth.email()));
CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT TO authenticated
USING (public.is_admin(auth.email()));

-- products policies
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE TO authenticated
USING (public.is_admin(auth.email()));
CREATE POLICY "Admins can insert products"
ON public.products FOR INSERT TO authenticated
WITH CHECK (public.is_admin(auth.email()));
CREATE POLICY "Admins can update products"
ON public.products FOR UPDATE TO authenticated
USING (public.is_admin(auth.email()));

-- profiles policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.is_admin(auth.email()));

-- Add delivery_location to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_location text;
