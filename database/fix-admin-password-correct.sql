-- Actualizar contraseña del admin con el hash correcto
-- Ejecutar en Supabase SQL Editor

UPDATE admin_users 
SET 
  password_hash = '$2b$10$unUvCP0nm9mEyhS7PhAIf.wxshzfrXEdfEMgjtfZbXMm.8Q4lQYaW',
  updated_at = NOW()
WHERE email = 'admin@esteticaintegral.com.ar';

-- Verificar que se actualizó correctamente
SELECT id, email, password_hash, role, is_active, updated_at FROM admin_users WHERE email = 'admin@esteticaintegral.com.ar';
