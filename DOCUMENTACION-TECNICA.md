# 🔧 Documentación Técnica - Sistema de Reservas Estética Integral

**Versión 1.0** | **Desarrollador: [Tu Nombre]** | **Cliente: Lorena Esquivel**

---

## 🏗️ **Arquitectura del Sistema**

### **Stack Tecnológico:**
- **Frontend**: Next.js 15.5.3 + React + TypeScript
- **Styling**: Tailwind CSS con tema personalizado rosa/magenta
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth + RLS (Row Level Security)
- **Deploy**: Vercel
- **PDFs**: jsPDF para confirmaciones

### **Estructura del Proyecto:**
```
estetica.integral/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── admin/             # Panel de administración
│   │   ├── page.tsx           # Página principal
│   │   └── layout.tsx         # Layout global
│   ├── components/            # Componentes reutilizables
│   ├── lib/                   # Utilidades y configuración
│   └── config/                # Configuración de servicios
├── pages/api/                 # API Routes
├── public/                    # Archivos estáticos
├── database/                  # Scripts SQL
└── docs/                      # Documentación
```

---

## 🗄️ **Base de Datos (Supabase)**

### **Tablas Principales:**

#### **`specialists`**
```sql
- id (UUID, PK)
- name (TEXT)
- email (TEXT)
- phone (TEXT)
- title (TEXT)
- is_active (BOOLEAN)
- created_at (TIMESTAMPTZ)
```

#### **`aesthetic_services`**
```sql
- id (UUID, PK)
- name (TEXT)
- description (TEXT)
- duration (INTEGER) -- en minutos
- category (TEXT)
- is_active (BOOLEAN)
- created_at (TIMESTAMPTZ)
```

#### **`patients`**
```sql
- id (UUID, PK)
- name (TEXT)
- email (TEXT)
- phone (TEXT)
- created_at (TIMESTAMPTZ)
```

#### **`appointments`**
```sql
- id (UUID, PK)
- specialist_id (UUID, FK)
- service_id (UUID, FK)
- patient_id (UUID, FK)
- appointment_date (DATE)
- appointment_time (TIME)
- status (TEXT) -- 'scheduled', 'completed', 'cancelled'
- notes (TEXT)
- created_at (TIMESTAMPTZ)
```

#### **`specialist_schedules`**
```sql
- id (UUID, PK)
- specialist_id (UUID, FK)
- day_of_week (INTEGER) -- 0=domingo, 1=lunes, etc.
- start_time (TIME)
- end_time (TIME)
- lunch_start (TIME)
- lunch_end (TIME)
- is_active (BOOLEAN)
```

#### **`specialist_closures`**
```sql
- id (UUID, PK)
- specialist_id (UUID, FK)
- start_date (DATE)
- end_date (DATE)
- reason (TEXT)
- is_active (BOOLEAN)
```

#### **`announcements`**
```sql
- id (UUID, PK)
- title (TEXT)
- message (TEXT)
- type (TEXT) -- 'info', 'warning', 'alert', 'success', 'vacation'
- start_date (DATE)
- end_date (DATE)
- show_on_home (BOOLEAN)
- block_bookings (BOOLEAN)
- is_active (BOOLEAN)
```

#### **`admin_users`**
```sql
- id (UUID, PK)
- user_id (UUID, FK to auth.users)
- email (TEXT)
- created_at (TIMESTAMPTZ)
```

### **Políticas RLS (Row Level Security):**
- **Público**: Solo lectura de datos activos
- **Admin**: Acceso completo via service role
- **Autenticado**: Solo sus propios datos

---

## 🔐 **Sistema de Autenticación**

### **Admin Panel:**
- **Método**: Custom auth con Supabase
- **Middleware**: Verificación en `middleware.ts`
- **Sesión**: Persistente con cookies
- **Protección**: Todas las rutas `/admin/*`

### **Pacientes:**
- **Sin autenticación**: Reservas públicas
- **Validación**: Email y teléfono únicos por cita

---

## 📡 **API Routes**

### **Rutas Públicas:**
- `GET /api/appointments` - Obtener horarios disponibles
- `POST /api/appointments` - Crear reserva
- `GET /api/announcements` - Obtener anuncios activos

### **Rutas Admin:**
- `GET /api/admin/appointments` - Listar citas
- `POST /api/admin/appointments` - Crear cita
- `PUT /api/admin/appointments` - Actualizar cita
- `PATCH /api/admin/appointments` - Cambiar estado
- `DELETE /api/admin/appointments` - Eliminar cita
- `GET /api/admin/patients` - Listar pacientes
- `POST /api/admin/patients` - Crear paciente
- `GET /api/admin/schedules` - Gestionar horarios
- `GET /api/admin/closures` - Gestionar cierres
- `GET /api/admin/announcements` - Gestionar anuncios
- `GET /api/admin/stats` - Estadísticas
- `GET /api/admin/services` - Listar servicios

---

## 🎨 **Sistema de Diseño**

### **Paleta de Colores:**
```css
/* Tema principal */
primary: "#d63384"      /* Rosa/Magenta profundo */
secondary: "#f8d7da"    /* Rosa claro */
accent: "#6c757d"       /* Gris oscuro */
neutral: "#495057"      /* Gris medio */
dark: "#343a40"         /* Gris muy oscuro */
light: "#fdf2f8"        /* Rosa muy claro */

/* Gradientes */
bg-gradient-to-br from-light via-white to-secondary/30
```

### **Componentes Reutilizables:**
- **AppointmentBooking**: Flujo de reserva
- **ServiceSelection**: Selección de servicios
- **SpecialistInfo**: Info de especialistas
- **AnnouncementBanner**: Banner de anuncios
- **AdminDashboard**: Panel principal
- **ScheduleManager**: Gestión de horarios
- **ClosureManager**: Gestión de cierres
- **AnnouncementManager**: Gestión de anuncios

---

## 🚀 **Deploy y Configuración**

### **Variables de Entorno:**
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXTAUTH_SECRET=tu_nextauth_secret
```

### **Vercel Deploy:**
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node Version**: 18.x

### **Dominio Personalizado:**
- Configurar en Vercel Dashboard
- DNS: CNAME hacia `cname.vercel-dns.com`

---

## 🔧 **Mantenimiento**

### **Backup de Base de Datos:**
```bash
# Exportar datos (Supabase CLI)
supabase db dump --file backup.sql

# Restaurar datos
supabase db reset --file backup.sql
```

### **Logs y Monitoreo:**
- **Vercel**: Logs en dashboard
- **Supabase**: Logs en dashboard
- **Errores**: Capturados en `try/catch`

### **Actualizaciones:**
```bash
# Actualizar dependencias
npm update

# Verificar vulnerabilidades
npm audit

# Actualizar Supabase CLI
npm install -g supabase@latest
```

---

## 🐛 **Debugging y Troubleshooting**

### **Problemas Comunes:**

#### **Error: "Cannot read properties of undefined"**
- **Causa**: Arrays no inicializados
- **Solución**: Verificar null checks en componentes

#### **Error: "Row Level Security policy"**
- **Causa**: Políticas RLS incorrectas
- **Solución**: Verificar políticas en Supabase

#### **Error: "Invalid date format"**
- **Causa**: Formato de fecha incorrecto
- **Solución**: Usar `date-fns` para formateo

#### **Error: "Service role key required"**
- **Causa**: Variable de entorno faltante
- **Solución**: Verificar `.env.local`

### **Herramientas de Debug:**
```javascript
// Debug de fechas
import { debugDateIssues } from '../lib/debug-dates-browser'

// Debug de Supabase
console.log('Supabase config:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

---

## 📊 **Métricas y Analytics**

### **Métricas Importantes:**
- **Reservas por día/semana/mes**
- **Tasa de cancelación**
- **Servicios más populares**
- **Horarios más solicitados**
- **Uso del panel admin**

### **Monitoreo:**
- **Vercel Analytics**: Tráfico web
- **Supabase Dashboard**: Uso de DB
- **Custom Events**: Eventos específicos

---

## 🔒 **Seguridad**

### **Medidas Implementadas:**
- **HTTPS**: Forzado en producción
- **RLS**: Protección a nivel de fila
- **Input Validation**: Sanitización de datos
- **Rate Limiting**: Vercel automático
- **CORS**: Configurado correctamente

### **Buenas Prácticas:**
- **Service Role**: Solo en server-side
- **Anon Key**: Solo en client-side
- **Sensitive Data**: Nunca en client-side
- **Passwords**: Hash seguro en Supabase

---

## 📈 **Escalabilidad**

### **Optimizaciones Actuales:**
- **Pagination**: En listados grandes
- **Caching**: Vercel edge caching
- **Lazy Loading**: Componentes bajo demanda
- **Image Optimization**: Next.js automático

### **Futuras Mejoras:**
- **CDN**: Para assets estáticos
- **Database Indexing**: Optimizar consultas
- **Background Jobs**: Para tareas pesadas
- **Microservices**: Separar funcionalidades

---

## 🆘 **Soporte y Contacto**

### **Para la Cliente (Lorena):**
- **Manual de Usuario**: `MANUAL-USUARIO-ESTETICA-INTEGRAL.md`
- **Email de Soporte**: [email-del-desarrollador]
- **Respuesta**: Máximo 24 horas

### **Para el Desarrollador:**
- **Documentación**: Este archivo
- **Código**: Comentado y documentado
- **Git**: Historial completo de cambios
- **Issues**: Seguimiento en GitHub

---

## 📝 **Changelog**

### **Versión 1.0 (Diciembre 2024)**
- ✅ Sistema completo de reservas
- ✅ Panel de administración
- ✅ Gestión de horarios y cierres
- ✅ Sistema de anuncios
- ✅ Confirmaciones PDF
- ✅ Filtros inteligentes
- ✅ Tema rosa/magenta personalizado
- ✅ Información de Villa Ramallo

### **Próximas Versiones:**
- 📧 **Email automático**: Confirmaciones por email
- 📱 **App móvil**: Aplicación nativa
- 💳 **Pagos**: Integración con MercadoPago
- 📊 **Reportes**: Exportación a Excel
- 🔔 **Notificaciones**: SMS y WhatsApp

---

*Esta documentación técnica debe mantenerse actualizada con cada cambio en el sistema.*

**Desarrollado con ❤️ para Estética Integral - Villa Ramallo**
