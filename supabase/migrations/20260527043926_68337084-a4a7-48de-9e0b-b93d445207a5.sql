
-- 1. Remove overly permissive product policies
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;

-- 2. Restrict contact_submissions SELECT to admins only
DROP POLICY IF EXISTS "Only authenticated users can view submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (public.is_admin(auth.email()));

-- 3. Remove orders from realtime publication (prevents broadcasting all order data)
ALTER PUBLICATION supabase_realtime DROP TABLE public.orders;

-- 4. Storage policies for order-receipts bucket (users manage their own folder)
CREATE POLICY "Users can upload their own order receipts"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'order-receipts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own order receipts"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'order-receipts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own order receipts"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'order-receipts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own order receipts"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'order-receipts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Revoke EXECUTE on trigger-only SECURITY DEFINER functions from public roles
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
