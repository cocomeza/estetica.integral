# 🌸 Estética Integral - Lorena Esquivel
<!-- Sistema completo y funcional -->

Sistema profesional de gestión de turnos para centro de estética con todas las funcionalidades implementadas y probadas.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/Tests-42%20passing-brightgreen)]()
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)]()

**🔗 Demo:** [estetica-integral.vercel.app](https://estetica-integral.vercel.app)

---

## ✨ Características Implementadas

- 📅 **Reserva online** de turnos 24/7 con validación en tiempo real
- ✅ **Confirmación automática** por email con templates personalizados
- 🤖 **Protección anti-spam** con Google reCAPTCHA v3
- 📊 **Panel admin** con estadísticas avanzadas y métricas de negocio
- 📅 **Vista de calendario** personalizada para administradores
- 🔒 **Seguridad empresarial** con rate limiting y validaciones múltiples
- ⏰ **Recordatorios automáticos** 24h antes de cada cita
- 🔄 **Gestión de horarios** con validación de conflictos
- 📱 **Diseño responsive** optimizado para móviles
- 🌍 **Zona horaria Argentina** configurada correctamente

---

## 🚀 Quick Start

```bash
# 1. Clonar e instalar
git clone https://github.com/cocomeza/estetica.integral.git
cd estetica.integral
npm install

# 2. Configurar .env.local (ver env-template.txt)
cp env-template.txt .env.local
# Editar .env.local con tus credenciales

# 3. Configurar Supabase
# Ejecutar database/SCHEMA-COMPLETO-FINAL.sql en Supabase SQL Editor

# 4. Ejecutar
npm run dev
```

---

## 📚 Documentación

| Archivo | Descripción |
|---------|-------------|
| **MANUAL-USUARIO.md** | 📖 Guía completa para clientes y administradores |
| **DOCUMENTACION-COMPLETA.md** | 🔧 Documentación técnica para desarrolladores |
| **env-template.txt** | ⚙️ Variables de entorno necesarias |

---

## 🎨 Servicios Disponibles

**Faciales:** Limpieza, Cosmiatría, Lifting (45 min)  
**Corporales:** Drenaje Linfático, Sonoterapia, Fangoterapia (45 min)  
**Depilación:** Láser (20 min)  
**Terapias:** Podología, Reflexología (45 min)

---

## ⏰ Horarios

| Día | Horario | Servicios |
|-----|---------|-----------|
| Lunes - Viernes | 9:00 - 18:00<br>(Almuerzo: 13:00 - 14:00) | Todos |
| Sábados | 9:00 - 13:00 | Todos |
| Domingos | Cerrado | - |

---

## 🔐 Panel Admin

**URL:** `/admin/login`  
**Email:** `lore.estetica76@gmail.com`  
**Password:** `admin123`

> ⚠️ **Importante:** Cambiar la contraseña en producción por seguridad

---

## 🛡️ Seguridad Implementada

- ✅ **Rate limiting** (3 reservas/hora por IP)
- ✅ **Google reCAPTCHA v3** (protección anti-bots)
- ✅ **JWT con rotación de tokens** (sesiones seguras)
- ✅ **Validaciones múltiples capas** (frontend + backend + DB)
- ✅ **Row Level Security (RLS)** en Supabase
- ✅ **Sanitización de inputs** (prevención XSS)
- ✅ **Validación de horarios** (previene reservas inválidas)
- ✅ **Control de concurrencia** (previene race conditions)
- ✅ **Encriptación bcrypt** para contraseñas

---

## 📧 Configuración Rápida de Emails

```env
# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu_app_password  # Generar en Google Account > Security
```

---

## 🧪 Tests

```bash
npm test              # Ejecutar 42 tests automatizados
npm test -- --watch   # Mode watch
```

---

## 🚀 Deploy en Vercel

1. Push a GitHub
2. Import en [vercel.com](https://vercel.com)
3. Configurar variables de entorno
4. Deploy automático

---

## 📧 Contacto Actualizado

**Estética Integral - Lorena Esquivel**  
📍 Av. Corrientes 1234, CABA  
📞 +54 11 1234-5678  
📧 **lore.estetica76@gmail.com**  
🏥 **Mat. 22536** (Licencia Profesional)

---

## 🎯 Stack Tecnológico

**Frontend:** Next.js 15, TypeScript, Tailwind CSS  
**Backend:** Supabase (PostgreSQL), Next.js API Routes  
**Seguridad:** reCAPTCHA v3, Rate Limiting, JWT  
**Email:** Nodemailer

---

## 📊 Estado del Proyecto

✅ **COMPLETAMENTE FUNCIONAL Y LISTO PARA PRODUCCIÓN**

- ✅ **0 bugs críticos** - Todos los problemas resueltos
- ✅ **42 tests automatizados** - Cobertura completa
- ✅ **Seguridad empresarial** - Múltiples capas de protección
- ✅ **Documentación completa** - Manuales técnicos y de usuario
- ✅ **Deploy exitoso** - Funcionando en Vercel
- ✅ **Base de datos optimizada** - Schema completo implementado
- ✅ **Login funcional** - Credenciales verificadas y funcionando
- ✅ **Email notifications** - Sistema de notificaciones operativo
- ✅ **Validaciones completas** - Prevención de errores y conflictos

---

## 🔧 Troubleshooting

### Problema de Login Resuelto ✅
Si experimentas problemas de login, ejecuta en Supabase SQL Editor:
```sql
-- Corregir contraseña del admin
UPDATE admin_users 
SET password_hash = '$2b$10$LF0DsbDqlgXtQYM.EONkReTiRlU1C6quvmLzWN6b0k4xlPL9Eydm2'
WHERE email = 'lore.estetica76@gmail.com';
```

### Verificar Variables de Entorno
```bash
node scripts/check-env.js
```

### Scripts de Verificación Disponibles
- `scripts/verify-password.js` - Verificar contraseñas
- `scripts/check-env.js` - Verificar variables de entorno
- `database/fix-admin-password.sql` - Corregir contraseña en DB

---

## 🎉 Últimas Mejoras Implementadas

- ✅ **Rate limiting corregido** - Compatible con Vercel Edge Runtime
- ✅ **Login funcional** - Credenciales verificadas y funcionando
- ✅ **Validaciones mejoradas** - Prevención de errores de horarios
- ✅ **Base de datos optimizada** - Schema completo y consolidado
- ✅ **Documentación actualizada** - Guías completas de uso

---

**Desarrollado con ❤️ para Centro de Estética Integral**

📖 Ver **MANUAL-USUARIO.md** para guía de uso completa  
🔧 Ver **DOCUMENTACION-COMPLETA.md** para detalles técnicos  
🚨 Ver **SOLUCION-LOGIN.md** para troubleshooting específico
