#  Centro de Estética Integral - Lorena Esquivel

## Sistema de Gestión de Turnos Online

---

## 🎯 Descripción

Sistema web completo para gestión de turnos estéticos con panel de administración avanzado. Permite a los clientes reservar turnos online y al administrador gestionar horarios, cierres y vacaciones de forma intuitiva.

---

## ✨ Características Principales

### Para Clientes:
- 🌐 Reserva de turnos online 24/7
- 📱 Interfaz simple y directa
- 🗓️ Selección visual de fecha y hora
- ✅ Confirmación inmediata
- 📄 Descarga de comprobante PDF

### Para Administrador:
- 📊 Panel de administración completo
- 🗓️ Gestión de turnos (crear, editar, cancelar)
- 🕐 Configuración de horarios por día
- 🏖️ Programación de vacaciones y cierres
- 🍽️ Configuración de horarios de almuerzo
- ⚡ Reprogramación rápida de turnos
- 📈 Estadísticas de turnos
- 🔍 Búsqueda y filtros avanzados

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Next.js 15, React 19, TypeScript
- **Estilos:** Tailwind CSS
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** JWT
- **UI Components:** Headless UI, Lucide Icons
- **Fechas:** date-fns
- **Formularios:** React Hook Form
- **Validación:** Zod
- **PDF:** jsPDF
- **Email:** Nodemailer

---

## 📋 Requisitos

- Node.js 18+
- Cuenta en Supabase
- npm o yarn

---

## 🚀 Instalación Rápida

```bash
# 1. Clonar repositorio
git clone <url-del-repo>
cd estetica-integral

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp env-template.txt .env.local
# Editar .env.local con tus credenciales de Supabase

# 4. Ejecutar schema SQL en Supabase
# (Ver DEPLOYMENT.md para instrucciones detalladas)

# 5. Iniciar servidor de desarrollo
npm run dev

# 6. Abrir navegador
# http://localhost:3000
```

---

## 📚 Documentación

- **[INSTRUCCIONES-ADMIN.md](INSTRUCCIONES-ADMIN.md)** - Guía de uso para administradores
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guía técnica de despliegue
- **[CHANGELOG-OCTUBRE-2024.md](CHANGELOG-OCTUBRE-2024.md)** - Historial de cambios

---

## 🔐 Acceso de Prueba

**Panel de Administración:**
- URL: `/admin`
- Email: `admin@esteticaintegral.com.ar`
- Password: `admin123`

⚠️ **Cambiar credenciales en producción**

---

## 📱 Funcionalidades Destacadas

### Sistema de Turnos Inteligente
- ✅ Bloqueo automático de fechas cerradas
- ✅ Exclusión de horarios de almuerzo
- ✅ Validación de disponibilidad en tiempo real
- ✅ Prevención de turnos duplicados

### Gestión de Horarios
- 📅 Configuración por día de la semana
- 🕐 Horarios de inicio y fin personalizables
- 🍽️ Configuración de break/almuerzo
- ✅ Activación/Desactivación de días

### Gestión de Cierres
- 🏖️ Vacaciones
- 🎉 Feriados
- 👤 Cierres personales
- 🔧 Mantenimiento
- ⚠️ Alertas de conflictos con turnos

---

## 🎨 Servicios Disponibles

### Tratamientos Faciales
- Limpieza Facial
- Cosmiatría
- Lifting Facial

### Tratamientos Corporales
- Drenaje Linfático
- Sonoterapia
- Fangoterapia
- Tratamientos Corporales

### Depilación
- Depilación Láser

### Terapias
- Podología
- Reflexología

---

## 📊 Estructura del Proyecto

```
estetica-integral/
├── database/
│   └── supabase-schema.sql      # Schema de base de datos
├── pages/
│   └── api/
│       └── admin/               # API endpoints de admin
│           ├── appointments.ts
│           ├── schedules.ts     # Gestión de horarios
│           └── closures.ts      # Gestión de cierres
├── src/
│   ├── app/
│   │   ├── admin/              # Panel de administración
│   │   │   └── components/
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── ScheduleManager.tsx
│   │   │       └── ClosureManager.tsx
│   │   └── page.tsx            # Página principal
│   ├── components/
│   │   ├── ServiceSelection.tsx
│   │   └── AppointmentBooking.tsx
│   └── lib/
│       ├── supabase.ts         # Cliente de Supabase
│       └── admin-auth.ts       # Autenticación
└── public/
    └── images/                 # Assets estáticos
```

---

## 🗄️ Base de Datos

### Tablas Principales:
- `aesthetic_services` - Servicios estéticos
- `specialists` - Profesionales
- `patients` - Clientes
- `appointments` - Turnos
- `work_schedules` - Horarios de trabajo ⭐ NUEVO
- `closures` - Cierres y vacaciones ⭐ NUEVO
- `admin_users` - Administradores
- `system_settings` - Configuración ⭐ NUEVO

---

## 🔒 Seguridad

- 🛡️ Row Level Security (RLS) en todas las tablas
- 🔐 Autenticación JWT para administradores
- 🔒 Protección de datos de pacientes
- ✅ Validación de inputs
- 🚫 Prevención de SQL injection

---

## 🌐 Despliegue

### Plataformas Recomendadas:
1. **Vercel** (Recomendado) - Deploy automático desde GitHub
2. **Netlify** - Alternativa simple
3. **Servidor propio** - Control total

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para instrucciones detalladas.

---

## 📈 Estado del Proyecto

✅ **Completado al 100%**

- [x] Sistema de reservas online
- [x] Panel de administración
- [x] Gestión de horarios
- [x] Gestión de cierres
- [x] Reprogramación de turnos
- [x] UI simplificada
- [x] Responsive design
- [x] Documentación completa

---

## 🎯 Próximos Pasos

1. 🚀 Desplegar en producción
2. 🔐 Configurar credenciales seguras
3. ✍️ Personalizar información
4. 📅 Configurar horarios iniciales
5. 🎉 ¡Lanzar al público!

---

## 🤝 Soporte

Para soporte técnico:
- **Web:** https://botoncreativo.onrender.com
- **Documentación:** Ver archivos MD en el proyecto

---

## 📄 Licencia

Proyecto desarrollado para uso exclusivo de **Centro de Estética Integral - Lorena Esquivel**

---

## 👨‍💻 Desarrollo

**Desarrollado por:** Botón Creativo
**Cliente:** Lorena Esquivel
**Año:** 2025
**Versión:** 1.0.0

---

##  ¡Listo para usar!

El sistema está completamente funcional y listo para recibir reservas. Documentación completa incluida para administración y mantenimiento.

**¡Éxito con tu negocio! **

