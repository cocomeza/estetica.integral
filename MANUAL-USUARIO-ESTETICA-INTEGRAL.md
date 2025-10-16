# 📋 Manual de Usuario - Sistema de Reservas Estética Integral

**Versión 1.0** | **Para: Lorena Esquivel** | **Estética Integral - Villa Ramallo**

---

## 🎯 **¿Qué es este Sistema?**

Este es un sistema completo de gestión de reservas médicas diseñado específicamente para **Estética Integral** en Villa Ramallo. Permite que tus pacientes reserven turnos online y que vos administres todo desde un panel profesional.

---

## 🌟 **Funcionalidades Principales**

### **Para tus Pacientes:**
- ✅ **Reservar turnos online** 24/7
- ✅ **Ver especialistas disponibles**
- ✅ **Elegir servicios y horarios**
- ✅ **Recibir confirmación por email**
- ✅ **Ver información de contacto**

### **Para Vos (Admin):**
- ✅ **Panel de administración completo**
- ✅ **Gestionar citas (crear, editar, cancelar)**
- ✅ **Configurar horarios de trabajo**
- ✅ **Programar vacaciones y cierres**
- ✅ **Crear anuncios para pacientes**
- ✅ **Ver estadísticas del negocio**

---

## 🚀 **Cómo Acceder al Sistema**

### **Sitio Público (Para Pacientes):**
```
https://tu-sitio-vercel.vercel.app
```
- Es el sitio que ven tus pacientes
- Pueden reservar turnos
- Ven la información de contacto

### **Panel de Administración:**
```
https://tu-sitio-vercel.vercel.app/admin
```
- Solo vos tenés acceso
- Usuario: `admin@esteticaintegral.com.ar`
- Contraseña: [la que configuraste]

---

## 👩‍⚕️ **Panel de Administración - Guía Completa**

### **1. 📅 Gestión de Turnos**

#### **Ver Turnos:**
- **Vista Activa**: Turnos de los últimos 3 meses (recomendado para uso diario)
- **Vista Historial**: Turnos más antiguos (solo para consultas)
- **Vista Todas**: Todos los turnos sin filtro

#### **Filtros Inteligentes:**
- **Períodos Rápidos**: Hoy, Semana, Mes, Trimestre
- **Búsqueda**: Por nombre, email o teléfono del paciente
- **Filtros**: Por estado (Programada, Completada, Cancelada)
- **Especialista**: Ver turnos de un profesional específico

#### **Acciones Disponibles:**
- **Crear Nueva Cita**: Agregar turnos manualmente
- **Editar**: Cambiar fecha, hora, especialista o notas
- **Completar**: Marcar como realizada
- **Cancelar**: Cancelar turnos
- **Reactivar**: Volver a activar turnos cancelados

#### **⚠️ Importante - Cambio de Turnos:**
Cuando cambias un turno (fecha/hora), el horario anterior **automáticamente queda disponible** para otros pacientes. No tenés que hacer nada extra.

### **2. ⏰ Gestión de Horarios**

#### **Configurar Horarios de Trabajo:**
- **Día de la semana**: Lunes a Domingo
- **Hora inicio**: Ej: 09:00
- **Hora fin**: Ej: 18:00
- **Almuerzo inicio**: Ej: 13:00
- **Almuerzo fin**: Ej: 14:00

#### **Gestión:**
- **Crear**: Agregar nuevos horarios
- **Editar**: Modificar horarios existentes
- **Activar/Desactivar**: Pausar horarios temporalmente
- **Eliminar**: Borrar horarios que no se usan

#### **💡 Consejos:**
- Configurá horarios diferentes para cada día si es necesario
- Podés desactivar horarios en lugar de eliminarlos
- Los pacientes solo ven horarios activos

### **3. 🏖️ Gestión de Cierres y Vacaciones**

#### **Tipos de Cierres:**
- **Vacaciones**: Cierres largos (ej: 1 semana)
- **Días no laborales**: Feriados o días especiales
- **Cierres temporales**: Por motivos personales

#### **Configuración:**
- **Fecha inicio**: Cuándo empieza el cierre
- **Fecha fin**: Cuándo termina el cierre
- **Motivo**: Descripción del cierre
- **Activar**: Hacer efectivo el cierre

#### **Efectos en el Sistema:**
- Los pacientes **no pueden reservar** durante cierres activos
- Aparece un mensaje explicando el cierre
- Los turnos existentes **no se ven afectados**

### **4. 📢 Gestión de Anuncios**

#### **Tipos de Anuncios:**
- **Informativo**: Noticias generales
- **Advertencia**: Avisos importantes
- **Alerta**: Situaciones especiales
- **Éxito**: Confirmaciones positivas
- **Vacaciones**: Anuncios de cierres

#### **Configuración:**
- **Título**: Título del anuncio
- **Mensaje**: Texto completo
- **Tipo**: Seleccionar categoría
- **Fechas**: Cuándo mostrar (opcional)
- **Mostrar en home**: Si aparece en la página principal
- **Bloquear reservas**: Si impide hacer reservas

#### **Ejemplos de Uso:**
- **"Nuevos tratamientos disponibles"** (Informativo)
- **"Cerrado por vacaciones del 20 al 30 de diciembre"** (Vacaciones)
- **"Sistema en mantenimiento"** (Advertencia)

---

## 📊 **Estadísticas y Reportes**

### **Tarjetas de Resumen:**
- **Total de Citas**: Cantidad total de turnos
- **Hoy**: Turnos del día actual
- **Programadas**: Turnos pendientes
- **Completadas**: Turnos realizados

### **Filtros para Análisis:**
- **Por período**: Ver estadísticas de diferentes meses
- **Por especialista**: Rendimiento individual
- **Por estado**: Análisis de completitud

---

## 🎨 **Personalización Visual**

### **Colores del Tema:**
- **Rosa/Magenta**: Colores principales de Estética Integral
- **Gradientes suaves**: Diseño profesional y elegante
- **Consistencia**: Mismo estilo en todo el sistema

### **Información de Contacto:**
- **Dirección**: Barberis 571 - Villa Ramallo, Pcia de Bs As
- **Teléfono**: 03407 - 494611
- **Email**: lorena@esteticaintegral.com.ar
- **Horarios**: Lun-Vie: 09:00-18:00

---

## 🔧 **Funciones Avanzadas**

### **Gestión de Pacientes:**
- **Crear pacientes nuevos** desde el panel admin
- **Ver historial** de cada paciente
- **Buscar por nombre, email o teléfono**
- **Editar información** de contacto

### **Gestión de Servicios:**
- **Servicios activos**: Los que aparecen para reservar
- **Configuración de duración**: Para calcular horarios disponibles
- **Categorías**: Organización por tipo de tratamiento

### **Sistema de Seguridad:**
- **Acceso solo con usuario y contraseña**
- **Protección de datos** de pacientes
- **Backup automático** de información

---

## 📱 **Cómo Funciona para los Pacientes**

### **Proceso de Reserva:**
1. **Entran al sitio web**
2. **Seleccionan el servicio** que necesitan
3. **Elegir especialista** (si hay varios)
4. **Seleccionan fecha** disponible
5. **Elegir horario** dentro de tus horarios de trabajo
6. **Completar datos** personales
7. **Confirmar reserva**
8. **Reciben confirmación** por email

### **Restricciones Automáticas:**
- **No pueden reservar** en horarios ocupados
- **No pueden reservar** en cierres/vacaciones
- **No pueden reservar** fuera de horarios de trabajo
- **No pueden reservar** fechas pasadas

---

## 🚨 **Situaciones Especiales**

### **Si un Paciente No Puede Venir:**
1. **Vos como admin** podés cancelar el turno
2. **El horario queda disponible** automáticamente
3. **Otros pacientes** pueden reservarlo

### **Si Necesitás Cambiar un Turno:**
1. **Editar la cita** desde el panel
2. **Cambiar fecha/hora** según necesidad
3. **El horario anterior** se libera automáticamente
4. **El paciente** puede seguir usando el nuevo horario

### **Si Tenés una Emergencia:**
1. **Crear un anuncio** de tipo "Advertencia"
2. **Activar "Bloquear reservas"** si es necesario
3. **Los pacientes verán** el mensaje inmediatamente

---

## 💡 **Consejos de Uso Diario**

### **Para el Día a Día:**
- **Usá "Vista Activa"** para ver solo turnos relevantes
- **Filtrá por "Hoy"** para ver el día actual
- **Ocultá completadas** para enfocarte en pendientes

### **Para Planificación:**
- **Usá "Vista Semana"** para planificar la semana
- **Revisá estadísticas mensuales** para análisis
- **Configurá horarios** con anticipación

### **Para Comunicación:**
- **Usá anuncios** para informar cambios
- **Programá cierres** con anticipación
- **Mantené actualizada** la información de contacto

---

## 🆘 **Soporte y Ayuda**

### **Si Tenés Problemas:**
1. **Revisá este manual** primero
2. **Verificá que tengas conexión** a internet
3. **Intentá cerrar y abrir** el navegador
4. **Contactá al desarrollador** si persiste el problema

### **Datos Importantes:**
- **Usuario admin**: `admin@esteticaintegral.com.ar`
- **URL del sitio**: [tu-dominio-vercel.vercel.app]
- **Soporte técnico**: [email-del-desarrollador]

---

## 📋 **Checklist de Configuración Inicial**

### **Configuración Básica:**
- [ ] Configurar horarios de trabajo para cada día
- [ ] Agregar servicios disponibles
- [ ] Configurar información de contacto
- [ ] Probar una reserva de prueba

### **Configuración Avanzada:**
- [ ] Crear anuncios informativos
- [ ] Configurar períodos de vacaciones
- [ ] Revisar estadísticas del sistema
- [ ] Capacitar personal (si tenés empleados)

---

## 🎯 **Beneficios del Sistema**

### **Para tu Negocio:**
- ✅ **Reservas 24/7** sin que estés presente
- ✅ **Menos llamadas** telefónicas
- ✅ **Mejor organización** de turnos
- ✅ **Profesionalismo** en la atención
- ✅ **Estadísticas** para tomar decisiones

### **Para tus Pacientes:**
- ✅ **Facilidad** para reservar turnos
- ✅ **Disponibilidad** fuera de horarios
- ✅ **Confirmación** automática
- ✅ **Información clara** de servicios

---

## 📞 **Contacto de Soporte**

**Desarrollador del Sistema:**
- **Email**: [email-del-desarrollador]
- **Disponibilidad**: [horarios-de-soporte]
- **Respuesta**: Máximo 24 horas

---

*Este manual fue creado específicamente para Estética Integral - Villa Ramallo. Si tenés dudas o necesitás ayuda, no dudes en contactar al desarrollador.*

**¡Que disfrutes usando tu nuevo sistema de reservas! 🌸✨**
