import { NextApiRequest, NextApiResponse } from 'next'
import { validateScheduleChange, getAffectedAppointments } from '../../lib/schedule-validation'

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
      newAllowedServices
    } = req.body

    // Validar parámetros requeridos
    if (!specialistId || dayOfWeek === undefined || !newStartTime || !newEndTime) {
      return res.status(400).json({
        error: 'Faltan parámetros requeridos: specialistId, dayOfWeek, newStartTime, newEndTime'
      })
    }

    // Validar el cambio de horario
    const validation = await validateScheduleChange(
      specialistId,
      dayOfWeek,
      newStartTime,
      newEndTime,
      newLunchStart,
      newLunchEnd,
      newAllowedServices
    )

    return res.status(200).json(validation)

  } catch (error) {
    console.error('Error validating schedule change:', error)
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}
