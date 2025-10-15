-- Crear usuario admin en la tabla admin_users
-- Ejecutar este script en Supabase SQL Editor

INSERT INTO admin_users (email, password_hash, role, is_active, created_at, updated_at)
VALUES (
  'admin@esteticaintegral.com.ar',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
  'admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Verificar que se creó correctamente
SELECT * FROM admin_users WHERE email = 'admin@esteticaintegral.com.ar';
