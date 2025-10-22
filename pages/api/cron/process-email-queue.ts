import { NextApiRequest, NextApiResponse } from 'next'
import { emailService } from '../../src/lib/email-service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    // Verificar autorización (solo para cron jobs o admin)
    const authHeader = req.headers.authorization
    const cronSecret = process.env.CRON_SECRET
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    const { action = 'process' } = req.body

    switch (action) {
      case 'process':
        // Procesar cola de emails
        const result = await emailService.processEmailQueue()
        return res.status(200).json({
          success: true,
          message: 'Cola de emails procesada',
          ...result
        })

      case 'stats':
        // Obtener estadísticas
        const stats = await emailService.getEmailQueueStats()
        return res.status(200).json({
          success: true,
          stats
        })

      case 'cleanup':
        // Limpiar emails antiguos
        const daysOld = req.body.daysOld || 30
        const cleanedCount = await emailService.cleanupOldEmails(daysOld)
        return res.status(200).json({
          success: true,
          message: `Limpiados ${cleanedCount} emails antiguos`,
          cleanedCount
        })

      case 'status':
        // Estado del servicio
        const status = await emailService.getServiceStatus()
        return res.status(200).json({
          success: true,
          status
        })

      default:
        return res.status(400).json({
          error: 'Acción no válida. Usar: process, stats, cleanup, status'
        })
    }

  } catch (error) {
    console.error('Error en procesamiento de cola de emails:', error)
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}
