
-- Recreate admin user rhis.cky10@gmail.com with password Nana@2508
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated', 'authenticated',
    'rhis.cky10@gmail.com',
    crypt('Nana@2508', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Admin"}'::jsonb,
    now(), now(), '', '', '', ''
  );

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(), new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', 'rhis.cky10@gmail.com', 'email_verified', true),
    'email', new_user_id::text, now(), now(), now()
  );
END $$;

-- Ensure admin_emails entry exists
INSERT INTO public.admin_emails (email)
VALUES ('rhis.cky10@gmail.com')
ON CONFLICT DO NOTHING;
