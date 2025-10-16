import type { NextApiRequest, NextApiResponse } from 'next'
import { 
  getAppointmentsForAdmin, 
  updateAppointmentStatus, 
  createAppointmentForAdmin,
  updateAppointmentForAdmin,
  deleteAppointmentForAdmin 
} from '../../src/lib/supabase-admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // La autenticación se maneja en el middleware

  if (req.method === 'GET') {
    try {
      const {
        search,
        startDate,
        endDate,
        status,
        specialistId,
        page = '1',
        limit = '10',
        sortBy = 'date',
        sortOrder = 'desc'
      } = req.query

      const filters = {
        search: search as string,
        startDate: startDate as string,
        endDate: endDate as string,
        status: status as string,
        specialistId: specialistId as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as 'date' | 'specialist' | 'patient',
        sortOrder: sortOrder as 'asc' | 'desc'
      }

      const result = await getAppointmentsForAdmin(filters)
      return res.status(200).json(result)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      return res.status(500).json({ error: 'Error al obtener citas' })
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { appointmentId, status } = req.body

      if (!appointmentId || !status) {
        return res.status(400).json({ error: 'ID de cita y estado requeridos' })
      }

      if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Estado inválido' })
      }

      const updatedAppointment = await updateAppointmentStatus(appointmentId, status)
      return res.status(200).json({ 
        success: true, 
        appointment: updatedAppointment 
      })
    } catch (error) {
      console.error('Error updating appointment:', error)
      return res.status(500).json({ error: 'Error al actualizar cita' })
    }
  }

  if (req.method === 'POST') {
    try {
      console.log('🔵 POST /api/appointments - Body recibido:', JSON.stringify(req.body, null, 2))
      
      // Verificar si es una reserva pública (desde el frontend) o admin
      const { specialistId, serviceId, patientInfo, appointmentDate, appointmentTime, duration } = req.body
      
      console.log('🔍 Verificando campos:', { 
        hasSpecialistId: !!specialistId, 
        hasServiceId: !!serviceId, 
        hasPatientInfo: !!patientInfo,
        patientInfo 
      })
      
      if (specialistId && serviceId && patientInfo) {
        // Reserva pública desde el frontend
        console.log('✅ Es reserva pública - procesando...')
        
        if (!specialistId || !serviceId || !appointmentDate || !appointmentTime || !patientInfo?.name || !patientInfo?.email) {
          return res.status(400).json({ error: 'Especialista, servicio, fecha, hora y datos del paciente son requeridos' })
        }

        // Crear el appointment usando la función pública
        const { createPublicAppointment } = await import('../../src/lib/supabase-admin')
        const newAppointment = await createPublicAppointment({
          specialistId,
          serviceId,
          appointmentDate,
          appointmentTime,
          duration: duration || 45,
          patientInfo
        })

        console.log('✅ Reserva creada exitosamente:', newAppointment)
        return res.status(201).json({ 
          success: true, 
          appointment: newAppointment 
        })
      } else {
        // Reserva desde admin (formato anterior)
        const { specialistId, patientId, appointmentDate, appointmentTime, status, notes } = req.body

        if (!specialistId || !patientId || !appointmentDate || !appointmentTime) {
          return res.status(400).json({ error: 'Especialista, paciente, fecha y hora son requeridos' })
        }

        const newAppointment = await createAppointmentForAdmin({
          specialistId,
          patientId,
          appointmentDate,
          appointmentTime,
          status,
          notes
        })

        return res.status(201).json({ 
          success: true, 
          appointment: newAppointment 
        })
      }
    } catch (error: any) {
      console.error('❌ Error creating appointment:', error)
      return res.status(400).json({ error: error.message || 'Error al crear la cita' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { appointmentId, specialistId, patientId, appointmentDate, appointmentTime, status, notes } = req.body

      if (!appointmentId) {
        return res.status(400).json({ error: 'ID de cita requerido' })
      }

      const updatedAppointment = await updateAppointmentForAdmin(appointmentId, {
        specialistId,
        patientId,
        appointmentDate,
        appointmentTime,
        status,
        notes
      })

      return res.status(200).json({ 
        success: true, 
        appointment: updatedAppointment 
      })
    } catch (error: any) {
      console.error('Error updating appointment:', error)
      return res.status(400).json({ error: error.message || 'Error al actualizar la cita' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { appointmentId } = req.body

      if (!appointmentId) {
        return res.status(400).json({ error: 'ID de cita requerido' })
      }

      const deletedAppointment = await deleteAppointmentForAdmin(appointmentId)

      return res.status(200).json({ 
        success: true, 
        appointment: deletedAppointment 
      })
    } catch (error: any) {
      console.error('Error deleting appointment:', error)
      return res.status(400).json({ error: error.message || 'Error al eliminar la cita' })
    }
  }

  return res.status(405).json({ error: 'Método no permitido' })
}
