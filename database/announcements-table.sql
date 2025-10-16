-- Tabla de anuncios públicos para el sitio web
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'alert', 'success', 'vacation')),
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  show_on_home BOOLEAN DEFAULT true,
  block_bookings BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_announcements_active ON public.announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_dates ON public.announcements(start_date, end_date);

-- RLS policies para announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer anuncios activos
CREATE POLICY "Announcements are viewable by everyone" 
  ON public.announcements FOR SELECT 
  USING (is_active = true);

-- Política: Solo admins pueden insertar (se maneja por service role)
CREATE POLICY "Admins can insert announcements" 
  ON public.announcements FOR INSERT 
  WITH CHECK (false); -- Solo via service role

-- Política: Solo admins pueden actualizar (se maneja por service role)
CREATE POLICY "Admins can update announcements" 
  ON public.announcements FOR UPDATE 
  USING (false); -- Solo via service role

-- Política: Solo admins pueden eliminar (se maneja por service role)
CREATE POLICY "Admins can delete announcements" 
  ON public.announcements FOR DELETE 
  USING (false); -- Solo via service role

-- Comentarios
COMMENT ON TABLE public.announcements IS 'Anuncios públicos que se muestran en el sitio web';
COMMENT ON COLUMN public.announcements.type IS 'Tipo de anuncio: info, warning, alert, success, vacation';
COMMENT ON COLUMN public.announcements.block_bookings IS 'Si es true, bloquea la posibilidad de hacer reservas';

