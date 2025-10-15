# 🚀 Guía de Despliegue - Centro de Estética Integral

## Configuración del Proyecto

### 1. Variables de Entorno

Crear un archivo `.env.local` con las siguientes variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# JWT Secret para autenticación de admin
JWT_SECRET=tu_jwt_secret_seguro

# Email Configuration (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_de_aplicacion
```

---

## 📦 Instalación

### Requisitos previos:
- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase

### Pasos:

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd estetica-integral
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env-template.txt .env.local
# Editar .env.local con tus credenciales
```

4. **Configurar base de datos en Supabase**
```bash
# Ir a Supabase Dashboard
# SQL Editor > New Query
# Copiar y ejecutar el contenido de: database/supabase-schema.sql
```

5. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

6. **Abrir en el navegador**
```
http://localhost:3000
```

---

## 🗄️ Configuración de Supabase

### Paso 1: Crear proyecto en Supabase

1. Ir a https://supabase.com
2. Crear una cuenta o iniciar sesión
3. Crear un nuevo proyecto
4. Copiar las credenciales (URL y anon key)

### Paso 2: Ejecutar el schema SQL

1. En el dashboard de Supabase, ir a **SQL Editor**
2. Crear una nueva query
3. Copiar todo el contenido de `database/supabase-schema.sql`
4. Ejecutar la query
5. Verificar que todas las tablas se crearon correctamente

### Tablas creadas:
- `aesthetic_services` - Servicios estéticos
- `specialists` - Profesionales
- `patients` - Clientes/Pacientes
- `appointments` - Turnos/Citas
- `work_schedules` - Horarios de trabajo
- `closures` - Cierres y vacaciones
- `admin_users` - Usuarios administradores
- `system_settings` - Configuración del sistema

### Paso 3: Verificar políticas RLS

Supabase tiene Row Level Security (RLS) habilitado. Las políticas permiten:
- Lectura pública de servicios, especialistas y horarios
- Solo admins pueden modificar datos
- Protección de información de pacientes

---

## 🔐 Configuración de Admin

### Credenciales por defecto:

- **Email:** admin@esteticaintegral.com.ar
- **Password:** admin123

⚠️ **IMPORTANTE:** Cambiar la contraseña en producción

### Para cambiar la contraseña:

1. Generar hash de nueva contraseña:
```javascript
const bcrypt = require('bcryptjs');
const newPassword = 'tu_nueva_contraseña';
const hash = bcrypt.hashSync(newPassword, 10);
console.log(hash);
```

2. Actualizar en Supabase:
```sql
UPDATE admin_users 
SET password_hash = 'nuevo_hash_generado'
WHERE email = 'admin@esteticaintegral.com.ar';
```

---

## 🌐 Despliegue en Producción

### Opción 1: Vercel (Recomendado)

1. **Conectar con GitHub**
```bash
# Subir código a GitHub
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Importar en Vercel**
- Ir a https://vercel.com
- Click en "New Project"
- Importar desde GitHub
- Seleccionar el repositorio

3. **Configurar variables de entorno**
- En Vercel Dashboard
- Settings > Environment Variables
- Agregar todas las variables de `.env.local`

4. **Desplegar**
- Click en "Deploy"
- Esperar a que se complete
- Obtener URL de producción

### Opción 2: Netlify

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Opción 3: Servidor propio

```bash
npm run build
npm start
```

---

## 📝 Configuración Post-Despliegue

### 1. Personalizar información

Actualizar en `database/supabase-schema.sql`:
```sql
-- Línea 133: Información del especialista
UPDATE specialists SET
  name = 'Lorena Esquivel',
  email = 'lorena@esteticaintegral.com.ar',
  phone = '+54 11 XXXX-XXXX',
  address = 'Tu dirección real',
  license = 'Tu matrícula real'
WHERE name = 'Lorena Esquivel';
```

### 2. Configurar horarios iniciales

Usar el panel de admin en la pestaña "Horarios"

### 3. Probar funcionalidad

- [ ] Crear un turno desde el sitio público
- [ ] Ver el turno en el panel de admin
- [ ] Editar/reprogramar un turno
- [ ] Configurar horarios
- [ ] Crear un cierre/vacación
- [ ] Verificar que los cierres bloqueen reservas

---

## 🔧 Mantenimiento

### Actualizar servicios:

```sql
-- Agregar nuevo servicio
INSERT INTO aesthetic_services (name, description, duration, category) 
VALUES ('Nuevo Servicio', 'Descripción del servicio', 60, 'facial');

-- Desactivar servicio
UPDATE aesthetic_services 
SET is_active = false 
WHERE name = 'Nombre del servicio';
```

### Hacer backup de la base de datos:

En Supabase Dashboard:
1. Database > Backups
2. Create backup
3. Descargar para guardar localmente

### Monitoreo:

1. **Logs en Vercel:**
   - Dashboard > Project > Deployments > View Function Logs

2. **Métricas en Supabase:**
   - Dashboard > Reports
   - Monitorear uso de base de datos

---

## 🐛 Troubleshooting

### Error: "Supabase URL not configured"

**Solución:** 
- Verificar que las variables de entorno estén configuradas
- Reiniciar el servidor de desarrollo

### Error: "Cannot read properties of null"

**Solución:**
- Ejecutar el schema SQL completo
- Verificar que todas las tablas existan
- Reinsertar datos iniciales si es necesario

### Los horarios no aparecen disponibles

**Solución:**
1. Verificar que existan horarios en `work_schedules`
2. Verificar que `is_active = true`
3. Verificar que no haya cierres activos

### No puedo iniciar sesión como admin

**Solución:**
1. Verificar credenciales
2. Verificar que JWT_SECRET esté configurado
3. Reiniciar el servidor

---

## 📚 Recursos Adicionales

- **Documentación de Next.js:** https://nextjs.org/docs
- **Documentación de Supabase:** https://supabase.com/docs
- **Documentación de Tailwind CSS:** https://tailwindcss.com/docs

---

## 🤝 Soporte

Para soporte técnico, contactar a:
- **Web:** https://botoncreativo.onrender.com
- **Email:** (agregar email de soporte)

---

## ✅ Checklist de Despliegue

- [ ] Configurar Supabase
- [ ] Ejecutar schema SQL
- [ ] Configurar variables de entorno
- [ ] Cambiar contraseña de admin
- [ ] Actualizar información del especialista
- [ ] Configurar horarios de atención
- [ ] Probar reserva de turnos
- [ ] Probar panel de admin
- [ ] Configurar dominio personalizado
- [ ] Configurar SSL/HTTPS
- [ ] Hacer backup inicial
- [ ] Entregar credenciales al cliente

---

**¡El sistema está listo para producción! 🎉**

