# Centro de Estética Integral - Lorena Esquivel

Sistema de gestión de turnos para centro de estética desarrollado con Next.js, TypeScript y Supabase.

## 🎨 Servicios Disponibles

### Tratamientos Faciales
- **Limpieza Facial** (45 min) - Tratamiento profundo con exfoliación y mascarilla
- **Cosmiatría** (45 min) - Tratamientos especializados anti-edad
- **Lifting Facial** (45 min) - Reafirmación no invasiva del rostro

### Tratamientos Corporales
- **Drenaje Linfático** (45 min) - Estimulación del sistema linfático
- **Sonoterapia** (45 min) - Terapia con ultrasonido
- **Fangoterapia** (45 min) - Tratamiento con barros terapéuticos
- **Tratamientos Corporales** (45 min) - Radiofrecuencia y cavitación

### Depilación
- **Depilación Láser** (20 min) - Eliminación definitiva del vello

### Terapias
- **Podología** (45 min) - Cuidado integral de los pies
- **Reflexología** (45 min) - Estimulación de puntos terapéuticos

## ⏰ Horarios de Atención

### Lunes a Viernes
- **Horario:** 09:00 - 18:00
- **Almuerzo:** 13:00 - 14:00
- **Servicios:** Todos los tratamientos disponibles

### Sábados
- **Horario:** 09:00 - 13:00
- **Servicios:** Solo Depilación Láser

### Domingos
- **Cerrado**

## 🎨 Paleta de Colores

El sistema utiliza una paleta de colores elegante y profesional:

- **Bone:** `#e5cfc2` - Color base suave y cálido
- **Shark:** `#26272b` - Texto principal oscuro
- **Chicago:** `#605a57` - Texto secundario y elementos
- **Tapestry:** `#a6566c` - Color de acento principal

## 🚀 Configuración del Proyecto

### 1. Instalación de Dependencias

```bash
npm install
```

### 2. Configuración de Supabase

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Ejecutar el script SQL en `database/supabase-schema.sql`
3. Configurar las variables de entorno:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 3. Variables de Entorno Adicionales

Para el envío de emails (opcional):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion
```

### 4. Ejecutar el Proyecto

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 📊 Estructura de la Base de Datos

### Tablas Principales

- **`aesthetic_services`** - Catálogo de servicios estéticos
- **`specialists`** - Información del profesional (Lorena Esquivel)
- **`patients`** - Datos de los clientes
- **`appointments`** - Turnos agendados
- **`work_schedules`** - Horarios de trabajo por día
- **`admin_users`** - Usuarios administrativos

### Características

- ✅ Seguridad con Row Level Security (RLS)
- ✅ Triggers automáticos para timestamps
- ✅ Índices optimizados para consultas
- ✅ Funciones SQL para horarios disponibles
- ✅ Políticas de acceso configuradas

## 🔧 Funcionalidades

### Para Clientes
- ✅ Selección de servicios por categoría
- ✅ Información detallada del especialista
- ✅ Calendario interactivo con horarios disponibles
- ✅ Reserva de turnos con validación
- ✅ Confirmación por email
- ✅ Descarga de comprobante PDF

### Para Administradores
- ✅ Panel administrativo completo
- ✅ Gestión de turnos (crear, editar, cancelar)
- ✅ Estadísticas y reportes
- ✅ Gestión de clientes
- ✅ Configuración de horarios

## 🎯 Características Técnicas

- **Frontend:** Next.js 15 con TypeScript
- **Styling:** Tailwind CSS con paleta de colores personalizada
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Formularios:** React Hook Form con validación
- **Fechas:** date-fns con localización en español
- **PDFs:** jsPDF para comprobantes profesionales
- **Sin emails:** Solo descarga de comprobantes PDF

## 📞 Información de Contacto

### Centro de Estética Integral
- **Profesional:** Lorena Esquivel - Esteticista Profesional
- **Matrícula:** Mat. 12345
- **Dirección:** Av. Corrientes 1234, CABA, Argentina
- **Teléfono:** +54 11 1234-5678
- **Email:** lorena@esteticaintegral.com.ar

### Horarios de Atención
- **Lunes a Viernes:** 09:00 - 18:00 (todos los servicios)
- **Sábados:** 09:00 - 13:00 (solo depilación láser)
- **Domingos:** Cerrado

## 📱 Responsive Design

El sistema está optimizado para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🌟 Características Especiales

### Horarios Inteligentes
- Intervalos dinámicos según duración del servicio
- Restricciones por día (sábados solo depilación)
- Validación de horarios de almuerzo

### Validaciones Robustas
- Email válido requerido
- Nombres formateados correctamente
- Teléfonos opcionales con formato
- Prevención de turnos duplicados

### Experiencia de Usuario
- Interfaz intuitiva con colores profesionales
- Feedback visual en tiempo real
- Modales de confirmación elegantes
- Estados de carga informativos

## 🔒 Seguridad

- Autenticación JWT con Supabase
- Row Level Security en todas las tablas
- Validación de datos en frontend y backend
- Sanitización de inputs
- Políticas de acceso granulares

## 📞 Soporte

Para consultas técnicas o personalizaciones adicionales, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ para Centro de Estética Integral - Lorena Esquivel**