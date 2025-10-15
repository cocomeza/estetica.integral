-- PASO 3: Actualizar políticas RLS para permitir reservas públicas
-- Ejecutar este script DESPUÉS de PASO-1 y PASO-2

-- Eliminar políticas restrictivas antiguas
DROP POLICY IF EXISTS "Patients are private" ON patients;
DROP POLICY IF EXISTS "Appointments are private" ON appointments;

-- Nuevas políticas para pacientes (permitir inserción pública)
CREATE POLICY "Anyone can create patients" ON patients 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Service role can read all patients" ON patients 
  FOR SELECT 
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can update patients" ON patients 
  FOR UPDATE 
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete patients" ON patients 
  FOR DELETE 
  USING (auth.role() = 'service_role');

-- Nuevas políticas para citas (permitir inserción pública)
CREATE POLICY "Anyone can create appointments" ON appointments 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Service role can read all appointments" ON appointments 
  FOR SELECT 
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can update appointments" ON appointments 
  FOR UPDATE 
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete appointments" ON appointments 
  FOR DELETE 
  USING (auth.role() = 'service_role');

-- Mensaje de confirmación
SELECT '✅ Políticas RLS actualizadas. Las reservas públicas ahora funcionan.' as mensaje;

