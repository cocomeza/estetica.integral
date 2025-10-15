-- Script para BORRAR COMPLETAMENTE la base de datos existente
-- ⚠️ ADVERTENCIA: Esto eliminará TODOS los datos
-- Solo usar en desarrollo o con backup previo

-- Desactivar RLS temporalmente
ALTER TABLE IF EXISTS aesthetic_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS specialists DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS work_schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS closures DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS system_settings DISABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Services are viewable by everyone" ON aesthetic_services;
DROP POLICY IF EXISTS "Services are editable by admins only" ON aesthetic_services;
DROP POLICY IF EXISTS "Active specialists are viewable by everyone" ON specialists;
DROP POLICY IF EXISTS "Specialists are editable by admins only" ON specialists;
DROP POLICY IF EXISTS "Active schedules are viewable by everyone" ON work_schedules;
DROP POLICY IF EXISTS "Schedules are editable by admins only" ON work_schedules;
DROP POLICY IF EXISTS "Patients are private" ON patients;
DROP POLICY IF EXISTS "Appointments are private" ON appointments;
DROP POLICY IF EXISTS "Admin users are private" ON admin_users;
DROP POLICY IF EXISTS "Active closures are viewable by everyone" ON closures;
DROP POLICY IF EXISTS "Closures are editable by admins only" ON closures;
DROP POLICY IF EXISTS "System settings are viewable by everyone" ON system_settings;
DROP POLICY IF EXISTS "System settings are editable by admins only" ON system_settings;

-- Eliminar vistas
DROP VIEW IF EXISTS active_services;
DROP VIEW IF EXISTS available_times;

-- Eliminar funciones
DROP FUNCTION IF EXISTS get_available_slots(UUID, DATE, UUID);
DROP FUNCTION IF EXISTS is_date_closed(UUID, DATE);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Eliminar índices
DROP INDEX IF EXISTS idx_appointments_date;
DROP INDEX IF EXISTS idx_appointments_specialist;
DROP INDEX IF EXISTS idx_appointments_status;
DROP INDEX IF EXISTS idx_appointments_datetime;
DROP INDEX IF EXISTS idx_patients_email;
DROP INDEX IF EXISTS idx_services_category;
DROP INDEX IF EXISTS idx_services_active;
DROP INDEX IF EXISTS idx_closures_dates;
DROP INDEX IF EXISTS idx_closures_specialist;
DROP INDEX IF EXISTS idx_closures_active;
DROP INDEX IF EXISTS idx_work_schedules_specialist;

-- Eliminar tablas (en orden inverso a las dependencias)
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS work_schedules CASCADE;
DROP TABLE IF EXISTS closures CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS specialists CASCADE;
DROP TABLE IF EXISTS aesthetic_services CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '✅ Base de datos completamente eliminada. Ahora ejecutá supabase-schema.sql';
END $$;

