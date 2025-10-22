# 🌸 Estética Integral - Lorena Esquivel
<!-- Build fix: a071853 -->

Sistema profesional de gestión de turnos para centro de estética.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/Tests-42%20passing-brightgreen)]()

**🔗 Demo:** [estetica-integral.vercel.app](https://estetica-integral.vercel.app)

---

## ✨ Características

- 📅 **Reserva online** de turnos 24/7
- ✅ **Confirmación automática** por email
- 🤖 **Protección anti-spam** y anti-bots
- 📊 **Panel admin** con estadísticas avanzadas
- 📅 **Vista de calendario** para administradores
- 🔒 **Seguridad empresarial**

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
# Ejecutar database/supabase-schema.sql en Supabase SQL Editor

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
**Email:** `admin@esteticaintegral.com.ar`  
**Password:** (configurar en producción)

---

## 🛡️ Seguridad

- ✅ Rate limiting (3 reservas/hora)
- ✅ Google reCAPTCHA v3
- ✅ JWT con rotación de tokens
- ✅ Validaciones múltiples capas
- ✅ Row Level Security (RLS)

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

## 📞 Contacto

**Estética Integral - Lorena Esquivel**  
📍 Av. Corrientes 1234, CABA  
📞 +54 11 1234-5678  
📧 lorena@esteticaintegral.com.ar

---

## 🎯 Stack Tecnológico

**Frontend:** Next.js 15, TypeScript, Tailwind CSS  
**Backend:** Supabase (PostgreSQL), Next.js API Routes  
**Seguridad:** reCAPTCHA v3, Rate Limiting, JWT  
**Email:** Nodemailer

---

## 📊 Estado del Proyecto

✅ **LISTO PARA PRODUCCIÓN**

- 0 bugs críticos
- 42 tests automatizados
- Seguridad empresarial
- Documentación completa

---

**Desarrollado con ❤️ para Centro de Estética Integral**

Ver **MANUAL-USUARIO.md** para guía de uso completa  
Ver **DOCUMENTACION-COMPLETA.md** para detalles técnicos
