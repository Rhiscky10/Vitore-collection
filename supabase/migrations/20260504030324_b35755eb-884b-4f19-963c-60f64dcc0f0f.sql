-- Create private storage bucket for order receipt PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-receipts', 'order-receipts', false)
ON CONFLICT (id) DO NOTHING;

-- Admins can view all receipts
CREATE POLICY "Admins can view all receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'order-receipts'
  AND auth.email() IN (SELECT email FROM public.admin_emails)
);