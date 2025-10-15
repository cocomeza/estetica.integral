-- Script para verificar y actualizar la contraseña del admin
-- Ejecutar en Supabase SQL Editor

-- Primero, verificar el usuario actual
SELECT id, email, password_hash, role, is_active FROM admin_users WHERE email = 'admin@esteticaintegral.com.ar';

-- Actualizar con un hash correcto para 'admin123'
-- Este hash es generado con bcrypt para la contraseña 'admin123'
UPDATE admin_users 
SET 
  password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  updated_at = NOW()
WHERE email = 'admin@esteticaintegral.com.ar';

-- Verificar que se actualizó correctamente
SELECT id, email, password_hash, role, is_active, updated_at FROM admin_users WHERE email = 'admin@esteticaintegral.com.ar';
