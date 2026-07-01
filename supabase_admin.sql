CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

INSERT INTO auth.users (
  instance_id, id, aud, role,
  email, encrypted_password,
  email_confirmed_at, confirmation_sent_at,
  confirmation_token, recovery_token,
  email_change_token_new, email_change,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  is_super_admin, is_sso_user, is_anonymous
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'neosymphony@gmail.com',
  crypt('anamaman123', gen_salt('bf')),
  NOW(), NOW(),
  '', '', '', '',
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(), NOW(),
  FALSE, FALSE, FALSE
);

CREATE TABLE IF NOT EXISTS education (
  id BIGSERIAL PRIMARY KEY,
  degree TEXT DEFAULT '',
  institution TEXT DEFAULT '',
  location TEXT DEFAULT '',
  period TEXT DEFAULT '',
  description TEXT DEFAULT '',
  gpa TEXT DEFAULT '',
  tech_stack TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO auth.identities (
  id, user_id, identity_data, provider,
  provider_id, last_sign_in_at, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'neosymphony@gmail.com'),
  jsonb_build_object(
    'sub', (SELECT id FROM auth.users WHERE email = 'neosymphony@gmail.com'),
    'email', 'neosymphony@gmail.com'
  ),
  'email',
  (SELECT id FROM auth.users WHERE email = 'neosymphony@gmail.com')::text,
  NOW(), NOW(), NOW()
);

ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT '';
