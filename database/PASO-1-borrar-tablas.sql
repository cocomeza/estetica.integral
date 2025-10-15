-- PASO 1: Borrar solo las tablas que existen
-- Ejecutar este script primero en Supabase SQL Editor

-- Borrar tablas en el orden correcto (de dependientes a principales)
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS work_schedules CASCADE;
DROP TABLE IF EXISTS closures CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS specialists CASCADE;
DROP TABLE IF EXISTS aesthetic_services CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Mensaje de confirmación
SELECT 'Base de datos limpia. Ahora ejecutá PASO-2-crear-todo.sql' as mensaje;

