
-- 1. Add super admin flag
ALTER TABLE public.admin_emails
  ADD COLUMN IF NOT EXISTS is_super BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_by_email TEXT;

UPDATE public.admin_emails SET is_super = true WHERE email = 'rhis.cky10@gmail.com';

-- 2. Super admin check function
CREATE OR REPLACE FUNCTION public.is_super_admin(_email text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_emails WHERE email = _email AND is_super = true)
$$;

-- 3. Admin emails: only super admin can manage; all admins can view list
DROP POLICY IF EXISTS "Admins can view admin emails" ON public.admin_emails;
CREATE POLICY "Admins can view admin emails" ON public.admin_emails
  FOR SELECT TO authenticated USING (is_admin(auth.email()));
CREATE POLICY "Super admin can insert admins" ON public.admin_emails
  FOR INSERT TO authenticated WITH CHECK (is_super_admin(auth.email()));
CREATE POLICY "Super admin can update admins" ON public.admin_emails
  FOR UPDATE TO authenticated USING (is_super_admin(auth.email()));
CREATE POLICY "Super admin can delete admins" ON public.admin_emails
  FOR DELETE TO authenticated USING (is_super_admin(auth.email()) AND is_super = false);

-- 4. Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_slug TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true OR is_admin(auth.email()));
CREATE POLICY "Admins can insert categories" ON public.categories
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.email()));
CREATE POLICY "Admins can update categories" ON public.categories
  FOR UPDATE TO authenticated USING (is_admin(auth.email()));
CREATE POLICY "Admins can delete categories" ON public.categories
  FOR DELETE TO authenticated USING (is_admin(auth.email()));

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Activity logs table
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_email ON public.admin_activity_logs(admin_email);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON public.admin_activity_logs(created_at DESC);

GRANT SELECT, INSERT ON public.admin_activity_logs TO authenticated;
GRANT ALL ON public.admin_activity_logs TO service_role;

ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admin views all logs" ON public.admin_activity_logs
  FOR SELECT TO authenticated USING (is_super_admin(auth.email()));
CREATE POLICY "Admins view their own logs" ON public.admin_activity_logs
  FOR SELECT TO authenticated USING (admin_email = auth.email());
CREATE POLICY "Admins insert their own logs" ON public.admin_activity_logs
  FOR INSERT TO authenticated WITH CHECK (
    is_admin(auth.email()) AND admin_email = auth.email()
  );

-- 6. Track product creator
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS created_by_email TEXT;
