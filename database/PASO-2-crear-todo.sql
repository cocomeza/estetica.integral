-- Schema para Centro de Estética Integral - Lorena Esquivel
-- Base de datos optimizada para servicios estéticos

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de servicios estéticos
CREATE TABLE aesthetic_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL DEFAULT 45, -- duración en minutos
  category VARCHAR(20) NOT NULL CHECK (category IN ('facial', 'corporal', 'depilacion', 'terapeutico', 'estetico')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de especialistas (en este caso, solo Lorena)
CREATE TABLE specialists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  bio TEXT,
  years_experience INTEGER DEFAULT 0,
  profile_image VARCHAR(500),
  title VARCHAR(100) DEFAULT 'Esteticista Profesional',
  license VARCHAR(50), -- Matrícula profesional
  address TEXT, -- Dirección del centro
  specialties UUID[], -- Array de IDs de servicios que ofrece
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pacientes/clientes
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  notes TEXT, -- observaciones del profesional
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de turnos/citas
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specialist_id UUID NOT NULL REFERENCES specialists(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES aesthetic_services(id) ON DELETE RESTRICT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration INTEGER NOT NULL, -- duración del servicio en minutos
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Evitar turnos duplicados en el mismo horario
  UNIQUE(specialist_id, appointment_date, appointment_time)
);

-- Tabla de horarios de trabajo
CREATE TABLE work_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specialist_id UUID NOT NULL REFERENCES specialists(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Domingo, 6=Sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  lunch_start TIME, -- hora de inicio de almuerzo
  lunch_end TIME, -- hora de fin de almuerzo
  allowed_services UUID[], -- servicios permitidos en este día (NULL = todos)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Un horario por día por especialista
  UNIQUE(specialist_id, day_of_week)
);

-- Tabla de cierres y vacaciones
CREATE TABLE closures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  specialist_id UUID NOT NULL REFERENCES specialists(id) ON DELETE CASCADE,
  closure_type VARCHAR(20) NOT NULL CHECK (closure_type IN ('vacation', 'holiday', 'personal', 'maintenance')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Validar que la fecha de fin sea posterior o igual a la de inicio
  CHECK (end_date >= start_date)
);

-- Tabla de configuración del sistema
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de administradores
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_specialist ON appointments(specialist_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_datetime ON appointments(appointment_date, appointment_time);
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_services_category ON aesthetic_services(category);
CREATE INDEX idx_services_active ON aesthetic_services(is_active);
CREATE INDEX idx_closures_dates ON closures(start_date, end_date);
CREATE INDEX idx_closures_specialist ON closures(specialist_id);
CREATE INDEX idx_closures_active ON closures(is_active);
CREATE INDEX idx_work_schedules_specialist ON work_schedules(specialist_id);

-- Triggers para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_aesthetic_services_updated_at BEFORE UPDATE ON aesthetic_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_specialists_updated_at BEFORE UPDATE ON specialists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_schedules_updated_at BEFORE UPDATE ON work_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_closures_updated_at BEFORE UPDATE ON closures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar servicios estéticos por defecto
INSERT INTO aesthetic_services (name, description, duration, category) VALUES
('Drenaje Linfático', 'Técnica de masaje suave que estimula el sistema linfático para eliminar toxinas, reducir la retención de líquidos y mejorar la circulación. Ideal para combatir la celulitis y mejorar el contorno corporal.', 45, 'corporal'),
('Limpieza Facial', 'Tratamiento profundo que incluye limpieza, exfoliación, extracción de puntos negros, mascarilla purificante y humectación. Deja la piel renovada, suave y con aspecto saludable.', 45, 'facial'),
('Depilación Láser', 'Eliminación definitiva del vello no deseado mediante tecnología láser de última generación. Tratamiento seguro, efectivo y duradero para rostro y cuerpo.', 20, 'depilacion'),
('Podología', 'Cuidado integral de los pies incluyendo corte de uñas, tratamiento de callosidades, durezas y uñas encarnadas. Mejora la salud y estética de tus pies.', 45, 'terapeutico'),
('Sonoterapia', 'Terapia con ultrasonido que utiliza ondas sonoras para mejorar la circulación, reducir inflamación y acelerar la regeneración celular. Efectiva para celulitis y flacidez.', 45, 'corporal'),
('Cosmiatría', 'Tratamientos faciales especializados para mejorar la textura, luminosidad y juventud de la piel. Incluye peelings, mesoterapia y tratamientos anti-edad personalizados.', 45, 'facial'),
('Fangoterapia', 'Aplicación de barros terapéuticos ricos en minerales que desintoxican, nutren y revitalizan la piel. Ideal para problemas circulatorios y relajación muscular.', 45, 'corporal'),
('Reflexología', 'Técnica terapéutica que estimula puntos específicos en los pies para promover el equilibrio y bienestar general del cuerpo. Alivia tensiones y mejora la circulación.', 45, 'terapeutico'),
('Tratamientos Corporales', 'Variedad de tratamientos para moldear, tonificar y mejorar el aspecto de la piel corporal. Incluye radiofrecuencia, cavitación y tratamientos reductivos.', 45, 'corporal'),
('Lifting Facial', 'Tratamiento no invasivo que tensiona y reafirma la piel del rostro mediante técnicas avanzadas como radiofrecuencia y masajes especializados. Resultados visibles inmediatos.', 45, 'estetico');

-- Insertar especialista (Lorena Esquivel)
INSERT INTO specialists (name, email, phone, bio, years_experience, title, license, address, specialties) VALUES
('Lorena Esquivel', 'lorena@esteticaintegral.com.ar', '+54 11 1234-5678', 'Especialista en tratamientos estéticos integrales con años de experiencia en el cuidado de la piel y bienestar corporal. Certificada en las últimas técnicas de estética y medicina estética.', 10, 'Esteticista Profesional', 'Mat. 12345', 'Av. Corrientes 1234, CABA, Argentina', ARRAY(SELECT id FROM aesthetic_services));

-- Insertar horarios de trabajo
-- Lunes a Viernes (1-5): Horario completo
INSERT INTO work_schedules (specialist_id, day_of_week, start_time, end_time, lunch_start, lunch_end)
SELECT s.id, generate_series(1, 5), '09:00'::time, '18:00'::time, '13:00'::time, '14:00'::time
FROM specialists s WHERE s.name = 'Lorena Esquivel';

-- Sábado (6): Solo depilación de 9:00 a 13:00
INSERT INTO work_schedules (specialist_id, day_of_week, start_time, end_time, allowed_services)
SELECT s.id, 6, '09:00'::time, '13:00'::time, ARRAY(SELECT aes.id FROM aesthetic_services aes WHERE aes.name = 'Depilación Láser')
FROM specialists s WHERE s.name = 'Lorena Esquivel';

-- Crear usuario administrador por defecto (password: admin123)
-- Nota: Cambiar esta contraseña en producción
INSERT INTO admin_users (email, password_hash, full_name, role) VALUES
('admin@esteticaintegral.com.ar', '$2b$10$rOzWKdFJaKfKmIxkUcA.VO8eHi3r/cEGVUgPgUZUf0nKqKYv4zSA.', 'Administrador', 'super_admin');

-- Políticas de seguridad RLS (Row Level Security)
ALTER TABLE aesthetic_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE closures ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para servicios estéticos (lectura pública, escritura solo admin)
CREATE POLICY "Services are viewable by everyone" ON aesthetic_services FOR SELECT USING (true);
CREATE POLICY "Services are editable by admins only" ON aesthetic_services FOR ALL USING (auth.role() = 'service_role');

-- Políticas para especialistas (lectura pública de activos, escritura solo admin)
CREATE POLICY "Active specialists are viewable by everyone" ON specialists FOR SELECT USING (is_active = true);
CREATE POLICY "Specialists are editable by admins only" ON specialists FOR ALL USING (auth.role() = 'service_role');

-- Políticas para horarios (lectura pública de activos, escritura solo admin)
CREATE POLICY "Active schedules are viewable by everyone" ON work_schedules FOR SELECT USING (is_active = true);
CREATE POLICY "Schedules are editable by admins only" ON work_schedules FOR ALL USING (auth.role() = 'service_role');

-- Políticas para pacientes (permitir creación pública, gestión solo admin)
CREATE POLICY "Anyone can create patients" ON patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can read all patients" ON patients FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Service role can update patients" ON patients FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete patients" ON patients FOR DELETE USING (auth.role() = 'service_role');

-- Políticas para citas (permitir creación pública, gestión solo admin)
CREATE POLICY "Anyone can create appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can read all appointments" ON appointments FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Service role can update appointments" ON appointments FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete appointments" ON appointments FOR DELETE USING (auth.role() = 'service_role');

-- Políticas para administradores (solo acceso de service role)
CREATE POLICY "Admin users are private" ON admin_users FOR ALL USING (auth.role() = 'service_role');

-- Políticas para cierres (lectura pública de activos, escritura solo admin)
CREATE POLICY "Active closures are viewable by everyone" ON closures FOR SELECT USING (is_active = true);
CREATE POLICY "Closures are editable by admins only" ON closures FOR ALL USING (auth.role() = 'service_role');

-- Políticas para configuración del sistema (lectura pública, escritura solo admin)
CREATE POLICY "System settings are viewable by everyone" ON system_settings FOR SELECT USING (true);
CREATE POLICY "System settings are editable by admins only" ON system_settings FOR ALL USING (auth.role() = 'service_role');

-- Crear vistas útiles
CREATE VIEW active_services AS
SELECT * FROM aesthetic_services WHERE is_active = true ORDER BY category, name;

CREATE VIEW available_times AS
SELECT 
  ws.specialist_id,
  ws.day_of_week,
  generate_series(
    EXTRACT(EPOCH FROM ws.start_time)::integer,
    EXTRACT(EPOCH FROM ws.end_time)::integer - 1800, -- -30 minutos para el último slot
    1800 -- intervalos de 30 minutos
  ) / 3600.0 AS hour_decimal
FROM work_schedules ws
WHERE ws.is_active = true;

-- Comentarios para documentación
COMMENT ON TABLE aesthetic_services IS 'Catálogo de servicios estéticos disponibles';
COMMENT ON TABLE specialists IS 'Profesionales que brindan los servicios (en este caso, solo Lorena)';
COMMENT ON TABLE patients IS 'Clientes del centro de estética';
COMMENT ON TABLE appointments IS 'Turnos agendados con servicios específicos';
COMMENT ON TABLE work_schedules IS 'Horarios de trabajo por día de la semana';
COMMENT ON TABLE admin_users IS 'Usuarios con acceso administrativo al sistema';
COMMENT ON TABLE closures IS 'Periodos de cierre por vacaciones, feriados u otras razones';
COMMENT ON TABLE system_settings IS 'Configuración general del sistema';

COMMENT ON COLUMN appointments.duration IS 'Duración en minutos del servicio (copiado del servicio al crear el turno)';
COMMENT ON COLUMN work_schedules.allowed_services IS 'Array de UUIDs de servicios permitidos en este día (NULL = todos los servicios)';
COMMENT ON COLUMN closures.closure_type IS 'Tipo de cierre: vacation (vacaciones), holiday (feriado), personal (personal), maintenance (mantenimiento)';

-- Funciones útiles

-- Función para verificar si una fecha está cerrada
CREATE OR REPLACE FUNCTION is_date_closed(
  p_specialist_id UUID,
  p_date DATE
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM closures
    WHERE specialist_id = p_specialist_id
      AND p_date BETWEEN start_date AND end_date
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql;

-- Función mejorada para obtener slots disponibles
CREATE OR REPLACE FUNCTION get_available_slots(
  p_specialist_id UUID,
  p_date DATE,
  p_service_id UUID
)
RETURNS TABLE(time_slot TIME) AS $$
DECLARE
  service_duration INTEGER;
  day_of_week INTEGER;
  is_closed BOOLEAN;
BEGIN
  -- Verificar si la fecha está cerrada
  is_closed := is_date_closed(p_specialist_id, p_date);
  
  -- Si está cerrado, no devolver slots
  IF is_closed THEN
    RETURN;
  END IF;
  
  -- Obtener duración del servicio
  SELECT duration INTO service_duration FROM aesthetic_services WHERE id = p_service_id;
  
  -- Obtener día de la semana (0=domingo, 6=sábado)
  day_of_week := EXTRACT(DOW FROM p_date);
  
  RETURN QUERY
  WITH time_slots AS (
    SELECT 
      (ws.start_time + (generate_series(0, 
        EXTRACT(EPOCH FROM (ws.end_time - ws.start_time))::integer / 1800 - 1
      ) * INTERVAL '30 minutes'))::TIME as slot_time,
      ws.lunch_start,
      ws.lunch_end
    FROM work_schedules ws
    WHERE ws.specialist_id = p_specialist_id
      AND ws.day_of_week = day_of_week
      AND ws.is_active = true
      AND (ws.allowed_services IS NULL OR p_service_id::text = ANY(ws.allowed_services))
  )
  SELECT ts.slot_time
  FROM time_slots ts
  WHERE 
    -- Excluir horario de almuerzo si existe
    (ts.lunch_start IS NULL OR ts.lunch_end IS NULL OR 
     NOT (ts.slot_time >= ts.lunch_start AND ts.slot_time < ts.lunch_end))
    -- Excluir slots ya ocupados
    AND NOT EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.specialist_id = p_specialist_id
        AND a.appointment_date = p_date
        AND a.appointment_time = ts.slot_time
        AND a.status != 'cancelled'
    )
  ORDER BY ts.slot_time;
END;
$$ LANGUAGE plpgsql;
