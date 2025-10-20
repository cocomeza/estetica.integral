-- Script para corregir horarios de sábados
-- CORRECCIÓN: Sábados permiten TODOS los servicios, no solo depilación

-- Primero eliminar la configuración incorrecta de sábado
DELETE FROM work_schedules 
WHERE day_of_week = 6;

-- Insertar configuración correcta para sábado
-- Sábado (6): TODOS los servicios de 9:00 a 13:00 (sin almuerzo)
INSERT INTO work_schedules (specialist_id, day_of_week, start_time, end_time, allowed_services)
SELECT s.id, 6, '09:00'::time, '13:00'::time, NULL  -- NULL = TODOS los servicios permitidos
FROM specialists s WHERE s.name = 'Lorena Esquivel';

-- Verificar la configuración
SELECT 
  day_of_week,
  start_time,
  end_time,
  lunch_start,
  lunch_end,
  CASE 
    WHEN allowed_services IS NULL THEN 'Todos los servicios'
    ELSE 'Servicios restringidos'
  END as servicios_permitidos
FROM work_schedules
WHERE specialist_id = (SELECT id FROM specialists WHERE name = 'Lorena Esquivel')
ORDER BY day_of_week;

