import { NextApiRequest, NextApiResponse } from 'next'
import { runDataIntegrityCheck, autoFixDataIntegrityIssues, getDataIntegrityStats } from '../../src/lib/data-integrity'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    // Verificar autorización (solo para admin)
    const authHeader = req.headers.authorization
    const adminSecret = process.env.ADMIN_SECRET
    
    if (authHeader !== `Bearer ${adminSecret}`) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    const { action = 'check' } = req.body

    switch (action) {
      case 'check':
        // Ejecutar verificación de integridad
        const report = await runDataIntegrityCheck()
        return res.status(200).json({
          success: true,
          message: 'Verificación de integridad completada',
          report
        })

      case 'fix':
        // Corregir problemas automáticamente
        const { issues } = req.body
        if (!issues || !Array.isArray(issues)) {
          return res.status(400).json({
            error: 'Lista de problemas requerida para corrección'
          })
        }

        const fixResult = await autoFixDataIntegrityIssues(issues)
        return res.status(200).json({
          success: true,
          message: 'Corrección automática completada',
          ...fixResult
        })

      case 'stats':
        // Obtener estadísticas
        const stats = await getDataIntegrityStats()
        return res.status(200).json({
          success: true,
          stats
        })

      case 'summary':
        // Obtener resumen ejecutivo
        const summary = await getDataIntegrityStats()
        const healthStatus = summary.healthScore >= 90 ? 'excellent' :
                           summary.healthScore >= 70 ? 'good' :
                           summary.healthScore >= 50 ? 'fair' : 'poor'
        
        return res.status(200).json({
          success: true,
          summary: {
            healthScore: summary.healthScore,
            healthStatus,
            issuesFound: summary.issuesFound,
            lastChecked: summary.lastCheck,
            recommendations: summary.healthScore < 70 ? [
              'Ejecutar verificación completa de integridad',
              'Revisar y corregir problemas detectados',
              'Implementar monitoreo regular'
            ] : [
              'Sistema en buen estado',
              'Continuar con monitoreo regular'
            ]
          }
        })

      default:
        return res.status(400).json({
          error: 'Acción no válida. Usar: check, fix, stats, summary'
        })
    }

  } catch (error) {
    console.error('Error en verificación de integridad:', error)
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}
