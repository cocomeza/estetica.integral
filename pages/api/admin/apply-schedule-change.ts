import { NextApiRequest, NextApiResponse } from 'next'
import { validateScheduleChange } from '../../lib/schedule-validation'
import { notifyAffectedPatients } from '../../lib/schedule-notifications'
import { supabaseAdmin } from '../../lib/supabase-admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    const {
      specialistId,
      dayOfWeek,
      newStartTime,
      newEndTime,
      newLunchStart,
      newLunchEnd,
      newAllowedServices,
      forceApply = false // Si true, aplica el cambio aunque haya conflictos
    } = req.body

    // Validar parámetros requeridos
    if (!specialistId || dayOfWeek === undefined || !newStartTime || !newEndTime) {
      return res.status(400).json({
        error: 'Faltan parámetros requeridos: specialistId, dayOfWeek, newStartTime, newEndTime'
      })
    }

    // 1. Validar el cambio de horario
    const validation = await validateScheduleChange(
      specialistId,
      dayOfWeek,
      newStartTime,
      newEndTime,
      newLunchStart,
      newLunchEnd,
      newAllowedServices
    )

    // 2. Si hay conflictos y no se fuerza la aplicación, devolver la validación
    if (validation.hasConflicts && !forceApply) {
      return res.status(409).json({
        error: 'Conflicto de horarios detectado',
        validation,
        message: 'Debe confirmar el cambio para proceder con los conflictos'
      })
    }

    // 3. Si hay conflictos y se fuerza la aplicación, enviar notificaciones
    if (validation.hasConflicts && forceApply) {
      console.log(`⚠️ Aplicando cambio de horario con ${validation.conflicts.length} conflictos`)
      
      // Convertir conflictos al formato de notificación
      const notifications = validation.conflicts.map(conflict => ({
        appointmentId: conflict.appointmentId,
        patientEmail: conflict.patientEmail,
        patientName: conflict.patientName,
        originalDate: conflict.appointmentDate,
        originalTime: conflict.appointmentTime,
        serviceName: conflict.serviceName,
        conflictType: conflict.conflictType,
        newSchedule: {
          startTime: newStartTime,
          endTime: newEndTime,
          lunchStart: newLunchStart,
          lunchEnd: newLunchEnd
        }
      }))

      // Enviar notificaciones
      const notificationResult = await notifyAffectedPatients(notifications)
      
      console.log(`📧 Notificaciones enviadas: ${notificationResult.success} exitosas, ${notificationResult.failed} fallidas`)
    }

    // 4. Aplicar el cambio de horario en la base de datos
    const updateData: any = {
      start_time: newStartTime,
      end_time: newEndTime,
      updated_at: new Date().toISOString()
    }

    if (newLunchStart && newLunchEnd) {
      updateData.lunch_start = newLunchStart
      updateData.lunch_end = newLunchEnd
    } else {
      updateData.lunch_start = null
      updateData.lunch_end = null
    }

    if (newAllowedServices !== undefined) {
      updateData.allowed_services = newAllowedServices
    }

    const { data: updatedSchedule, error: updateError } = await supabaseAdmin
      .from('work_schedules')
      .update(updateData)
      .eq('specialist_id', specialistId)
      .eq('day_of_week', dayOfWeek)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Error actualizando horario: ${updateError.message}`)
    }

    // 5. Registrar el cambio en el historial
    await supabaseAdmin
      .from('system_settings')
      .upsert([{
        key: `schedule_change_${specialistId}_${dayOfWeek}_${Date.now()}`,
        value: JSON.stringify({
          specialistId,
          dayOfWeek,
          oldSchedule: {
            startTime: 'previous_value', // Se podría obtener del historial
            endTime: 'previous_value',
            lunchStart: 'previous_value',
            lunchEnd: 'previous_value'
          },
          newSchedule: {
            startTime: newStartTime,
            endTime: newEndTime,
            lunchStart: newLunchStart,
            lunchEnd: newLunchEnd,
            allowedServices: newAllowedServices
          },
          appliedAt: new Date().toISOString(),
          conflictsDetected: validation.hasConflicts,
          conflictsCount: validation.conflicts.length,
          forceApplied: forceApply
        }),
        description: `Cambio de horario aplicado para especialista ${specialistId}, día ${dayOfWeek}`
      }])

    // 6. Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: 'Cambio de horario aplicado exitosamente',
      schedule: updatedSchedule,
      validation,
      notificationsSent: validation.hasConflicts ? validation.conflicts.length : 0
    })

  } catch (error) {
    console.error('Error applying schedule change:', error)
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}
