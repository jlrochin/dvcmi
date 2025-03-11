-- Paso 1: Crear el usuario en auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Este ID será generado automáticamente
  '00000000-0000-0000-0000-000000000000', -- Este ID será el de tu instancia
  'admin@hospital.com',
  crypt('Admin123!', gen_salt('bf')), -- La contraseña será: Admin123!
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
);

-- Paso 2: Obtener el ID generado para el usuario
DO $$
DECLARE
  auth_user_id uuid;
BEGIN
  -- Obtener el ID del usuario recién creado
  SELECT id INTO auth_user_id FROM auth.users WHERE email = 'admin@hospital.com';
  
  -- Insertar en la tabla users personalizada
  INSERT INTO public.users (
    id,
    email,
    username,
    name,
    role
  ) VALUES (
    auth_user_id,
    'admin@hospital.com',
    'admin',
    'Administrador Principal',
    'Administrador'
  );
END $$;

