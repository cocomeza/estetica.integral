import { NextApiRequest, NextApiResponse } from 'next'
import { 
  getSystemMetrics, 
  getActiveAlerts, 
  resolveAlert, 
  getSystemStats,
  startSystemMonitoring,
  stopSystemMonitoring
} from '../../src/lib/system-monitoring'

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

    const { action = 'stats' } = req.body

    switch (action) {
      case 'stats':
        // Obtener estadísticas del sistema
        const stats = getSystemStats()
        return res.status(200).json({
          success: true,
          stats
        })

      case 'metrics':
        // Obtener métricas recientes
        const hours = req.body.hours || 24
        const metrics = getSystemMetrics(hours)
        return res.status(200).json({
          success: true,
          metrics,
          count: metrics.length
        })

      case 'alerts':
        // Obtener alertas activas
        const alerts = getActiveAlerts()
        return res.status(200).json({
          success: true,
          alerts,
          count: alerts.length
        })

      case 'resolve_alert':
        // Resolver una alerta
        const { alertId, resolvedBy } = req.body
        if (!alertId || !resolvedBy) {
          return res.status(400).json({
            error: 'alertId y resolvedBy son requeridos'
          })
        }

        const resolved = await resolveAlert(alertId, resolvedBy)
        if (resolved) {
          return res.status(200).json({
            success: true,
            message: 'Alerta resuelta exitosamente'
          })
        } else {
          return res.status(404).json({
            error: 'Alerta no encontrada o ya resuelta'
          })
        }

      case 'start_monitoring':
        // Iniciar monitoreo
        startSystemMonitoring()
        return res.status(200).json({
          success: true,
          message: 'Monitoreo iniciado'
        })

      case 'stop_monitoring':
        // Detener monitoreo
        stopSystemMonitoring()
        return res.status(200).json({
          success: true,
          message: 'Monitoreo detenido'
        })

      case 'dashboard':
        // Obtener datos para dashboard
        const dashboardData = {
          stats: getSystemStats(),
          recentMetrics: getSystemMetrics(1), // Última hora
          activeAlerts: getActiveAlerts(),
          systemHealth: calculateSystemHealth()
        }
        
        return res.status(200).json({
          success: true,
          dashboard: dashboardData
        })

      case 'health_check':
        // Verificación de salud del sistema
        const healthStatus = await performHealthCheck()
        return res.status(200).json({
          success: true,
          health: healthStatus
        })

      default:
        return res.status(400).json({
          error: 'Acción no válida. Usar: stats, metrics, alerts, resolve_alert, start_monitoring, stop_monitoring, dashboard, health_check'
        })
    }

  } catch (error) {
    console.error('Error en monitoreo del sistema:', error)
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

/**
 * Calcula el estado de salud del sistema
 */
function calculateSystemHealth(): {
  overall: 'healthy' | 'warning' | 'critical'
  score: number
  issues: string[]
  recommendations: string[]
} {
  const stats = getSystemStats()
  const alerts = getActiveAlerts()
  
  let score = 100
  const issues: string[] = []
  const recommendations: string[] = []

  // Penalizar por alertas activas
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length
  const highAlerts = alerts.filter(a => a.severity === 'high').length
  const mediumAlerts = alerts.filter(a => a.severity === 'medium').length

  score -= criticalAlerts * 25
  score -= highAlerts * 15
  score -= mediumAlerts * 5

  if (criticalAlerts > 0) {
    issues.push(`${criticalAlerts} alertas críticas activas`)
    recommendations.push('Resolver alertas críticas inmediatamente')
  }

  if (highAlerts > 0) {
    issues.push(`${highAlerts} alertas de alta prioridad activas`)
    recommendations.push('Revisar y resolver alertas de alta prioridad')
  }

  if (mediumAlerts > 0) {
    issues.push(`${mediumAlerts} alertas de prioridad media activas`)
    recommendations.push('Monitorear alertas de prioridad media')
  }

  // Penalizar si no hay monitoreo activo
  if (!stats.isMonitoring) {
    score -= 20
    issues.push('Monitoreo del sistema desactivado')
    recommendations.push('Activar monitoreo del sistema')
  }

  // Penalizar si hay muchas métricas antiguas
  if (stats.totalMetrics < 10) {
    score -= 10
    issues.push('Pocas métricas disponibles')
    recommendations.push('Verificar recolección de métricas')
  }

  const overall = score >= 80 ? 'healthy' : score >= 50 ? 'warning' : 'critical'

  if (score >= 80) {
    recommendations.push('Sistema funcionando correctamente')
  } else if (score >= 50) {
    recommendations.push('Sistema requiere atención')
  } else {
    recommendations.push('Sistema requiere intervención inmediata')
  }

  return {
    overall,
    score: Math.max(0, Math.min(100, score)),
    issues,
    recommendations
  }
}

/**
 * Realiza verificación de salud del sistema
 */
async function performHealthCheck(): Promise<{
  database: 'healthy' | 'unhealthy'
  email: 'healthy' | 'unhealthy'
  storage: 'healthy' | 'unhealthy'
  overall: 'healthy' | 'unhealthy'
  details: Record<string, any>
}> {
  const health = {
    database: 'healthy' as const,
    email: 'healthy' as const,
    storage: 'healthy' as const,
    overall: 'healthy' as const,
    details: {} as Record<string, any>
  }

  try {
    // Verificar base de datos
    const { supabaseAdmin } = await import('../../src/lib/supabase-admin')
    const { data, error } = await supabaseAdmin
      .from('specialists')
      .select('id')
      .limit(1)

    if (error) {
      health.database = 'unhealthy'
      health.details.databaseError = error.message
    } else {
      health.details.databaseConnected = true
    }

    // Verificar servicio de email (simulado)
    health.details.emailService = 'configured'
    
    // Verificar almacenamiento (simulado)
    health.details.storageAvailable = true

    // Determinar salud general
    if (health.database === 'unhealthy' || health.email === 'unhealthy' || health.storage === 'unhealthy') {
      health.overall = 'unhealthy'
    }

  } catch (error) {
    health.overall = 'unhealthy'
    health.details.error = error instanceof Error ? error.message : 'Error desconocido'
  }

  return health
}
