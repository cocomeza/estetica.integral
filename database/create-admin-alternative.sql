-- Crear usuario admin alternativo para testing
-- Ejecutar en Supabase SQL Editor

-- Eliminar usuario existente si hay problemas
-- DELETE FROM admin_users WHERE email = 'admin@esteticaintegral.com.ar';

-- Crear usuario nuevo con hash conocido
INSERT INTO admin_users (email, password_hash, full_name, role, is_active, created_at, updated_at)
VALUES (
  'admin@esteticaintegral.com.ar',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
  'Administrador Principal',
  'super_admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Verificar
SELECT * FROM admin_users WHERE email = 'admin@esteticaintegral.com.ar';
