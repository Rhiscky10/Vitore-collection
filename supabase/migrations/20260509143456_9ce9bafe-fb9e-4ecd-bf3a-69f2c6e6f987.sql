UPDATE auth.users
SET encrypted_password = crypt('Nana@2508', gen_salt('bf')),
    updated_at = now()
WHERE email = 'rhis.cky10@gmail.com';