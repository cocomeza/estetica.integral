import React, { useState } from 'react'
import { ScheduleConflict, ScheduleChangeValidation } from '../../lib/schedule-validation'

interface ScheduleConflictModalProps {
  isOpen: boolean
  onClose: () => void
  validation: ScheduleChangeValidation | null
  onConfirmChange: () => void
  onCancelChange: () => void
}

export default function ScheduleConflictModal({
  isOpen,
  onClose,
  validation,
  onConfirmChange,
  onCancelChange
}: ScheduleConflictModalProps) {
  if (!isOpen || !validation) return null

  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'outside_hours':
        return '⏰'
      case 'lunch_conflict':
        return '🍽️'
      case 'service_not_allowed':
        return '🚫'
      default:
        return '⚠️'
    }
  }

  const getConflictMessage = (type: string) => {
    switch (type) {
      case 'outside_hours':
        return 'Turno fuera del nuevo horario'
      case 'lunch_conflict':
        return 'Conflicto con horario de almuerzo'
      case 'service_not_allowed':
        return 'Servicio no permitido en este día'
      default:
        return 'Conflicto detectado'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            ⚠️ Conflicto de Horarios Detectado
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium">
            {validation.recommendation}
          </p>
        </div>

        {validation.hasConflicts && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Turnos Afectados ({validation.affectedAppointmentsCount})
            </h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {validation.conflicts.map((conflict, index) => (
                <div
                  key={conflict.appointmentId}
                  className="border border-red-200 rounded-lg p-4 bg-red-50"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">
                      {getConflictIcon(conflict.conflictType)}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {conflict.patientName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {conflict.patientEmail}
                          </p>
                        </div>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {getConflictMessage(conflict.conflictType)}
                        </span>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-700">
                        <p><strong>Fecha:</strong> {conflict.appointmentDate}</p>
                        <p><strong>Hora:</strong> {conflict.appointmentTime}</p>
                        <p><strong>Servicio:</strong> {conflict.serviceName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancelChange}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar Cambio
          </button>
          
          {validation.hasConflicts ? (
            <button
              onClick={onConfirmChange}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Aplicar Cambio (Afectará {validation.affectedAppointmentsCount} turnos)
            </button>
          ) : (
            <button
              onClick={onConfirmChange}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Aplicar Cambio
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
