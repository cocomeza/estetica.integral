'use client'

/**
 * Vista de Calendario para Panel Admin
 * 📅 MEJORA #6: Visualización de citas en formato calendario
 */

import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import esLocale from '@fullcalendar/core/locales/es'
import type { EventClickArg } from '@fullcalendar/core'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Calendar, Clock, User, Sparkles, X } from 'lucide-react'

interface AppointmentData {
  id: string
  appointment_date: string
  appointment_time: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  specialist: {
    id: string
    name: string
    title: string
  }
  service: {
    id: string
    name: string
    duration: number
  }
  patient: {
    id: string
    name: string
    email: string
    phone: string
  }
}

interface CalendarViewProps {
  appointments: AppointmentData[]
  onEditAppointment?: (appointment: AppointmentData) => void
  onRefresh?: () => void
}

export default function CalendarView({ 
  appointments, 
  onEditAppointment,
  onRefresh 
}: CalendarViewProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Convertir citas a eventos de FullCalendar
  const events = appointments.map((apt) => {
    // Combinar fecha y hora
    const startDateTime = `${apt.appointment_date}T${apt.appointment_time}`
    
    // Calcular hora de fin basándose en la duración
    const [hours, minutes] = apt.appointment_time.split(':').map(Number)
    const startMinutes = hours * 60 + minutes
    const endMinutes = startMinutes + apt.service.duration
    const endHours = Math.floor(endMinutes / 60)
    const endMins = endMinutes % 60
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`
    const endDateTime = `${apt.appointment_date}T${endTime}`

    // Colores según estado
    let backgroundColor = '#a6566c' // Rosa/primary para scheduled
    let borderColor = '#a6566c'
    
    if (apt.status === 'completed') {
      backgroundColor = '#10b981' // Verde
      borderColor = '#059669'
    } else if (apt.status === 'cancelled') {
      backgroundColor = '#ef4444' // Rojo
      borderColor = '#dc2626'
    }

    return {
      id: apt.id,
      title: `${apt.patient.name} - ${apt.service.name}`,
      start: startDateTime,
      end: endDateTime,
      backgroundColor,
      borderColor,
      extendedProps: {
        appointment: apt
      }
    }
  })

  const handleEventClick = (info: EventClickArg) => {
    const appointment = info.event.extendedProps.appointment as AppointmentData
    setSelectedAppointment(appointment)
    setShowDetailModal(true)
  }

  const handleEdit = () => {
    if (selectedAppointment && onEditAppointment) {
      setShowDetailModal(false)
      onEditAppointment(selectedAppointment)
    }
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      scheduled: 'Programada',
      completed: 'Completada',
      cancelled: 'Cancelada'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-pink-100 text-pink-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Vista de Calendario
          </h3>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Actualizar
            </button>
          )}
        </div>

        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="timeGridWeek"
            locale={esLocale}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              list: 'Lista'
            }}
            events={events}
            eventClick={handleEventClick}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            slotDuration="00:15:00"
            allDaySlot={false}
            height="auto"
            nowIndicator={true}
            weekends={true}
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5, 6], // Lunes a Sábado
              startTime: '09:00',
              endTime: '18:00',
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
          />
        </div>

        {/* Leyenda */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-pink-600 mr-2"></div>
            <span className="text-gray-700">Programada</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-green-600 mr-2"></div>
            <span className="text-gray-700">Completada</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-red-600 mr-2"></div>
            <span className="text-gray-700">Cancelada</span>
          </div>
        </div>
      </div>

      {/* Modal de Detalles de Cita */}
      <Transition appear show={showDetailModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowDetailModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="h-6 w-6 mr-2 text-primary" />
                    Detalles de la Cita
                  </Dialog.Title>

                  {selectedAppointment && (
                    <div className="space-y-4">
                      {/* Estado */}
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAppointment.status)}`}>
                          {getStatusLabel(selectedAppointment.status)}
                        </span>
                      </div>

                      {/* Información del Paciente */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 mr-2 text-gray-600" />
                          <h4 className="text-sm font-semibold text-gray-700">Paciente</h4>
                        </div>
                        <p className="text-gray-900 font-medium">{selectedAppointment.patient.name}</p>
                        <p className="text-sm text-gray-600">{selectedAppointment.patient.email}</p>
                        <p className="text-sm text-gray-600">{selectedAppointment.patient.phone}</p>
                      </div>

                      {/* Información del Servicio */}
                      <div className="bg-pink-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Sparkles className="h-4 w-4 mr-2 text-primary" />
                          <h4 className="text-sm font-semibold text-gray-700">Servicio</h4>
                        </div>
                        <p className="text-gray-900 font-medium">{selectedAppointment.service.name}</p>
                        <p className="text-sm text-gray-600">Duración: {selectedAppointment.service.duration} minutos</p>
                      </div>

                      {/* Fecha y Hora */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Clock className="h-4 w-4 mr-2 text-blue-600" />
                          <h4 className="text-sm font-semibold text-gray-700">Fecha y Hora</h4>
                        </div>
                        <p className="text-gray-900 font-medium">
                          {new Date(selectedAppointment.appointment_date).toLocaleDateString('es-AR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-gray-600">{selectedAppointment.appointment_time}</p>
                      </div>

                      {/* Notas */}
                      {selectedAppointment.notes && (
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Notas</h4>
                          <p className="text-sm text-gray-900">{selectedAppointment.notes}</p>
                        </div>
                      )}

                      {/* Botón de Editar */}
                      {onEditAppointment && (
                        <button
                          onClick={handleEdit}
                          className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors font-medium"
                        >
                          Editar Cita
                        </button>
                      )}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Estilos personalizados para FullCalendar */}
      <style jsx global>{`
        .calendar-wrapper {
          font-family: inherit;
        }
        
        .fc {
          font-size: 0.875rem;
        }
        
        .fc-toolbar-title {
          font-size: 1.5rem !important;
          font-weight: 700;
          color: #26272b;
        }
        
        .fc-button {
          background-color: #a6566c !important;
          border-color: #a6566c !important;
          text-transform: capitalize;
        }
        
        .fc-button:hover {
          background-color: #8a4557 !important;
          border-color: #8a4557 !important;
        }
        
        .fc-button-active {
          background-color: #6b3544 !important;
          border-color: #6b3544 !important;
        }
        
        .fc-event {
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .fc-event:hover {
          opacity: 0.9;
          transform: scale(1.02);
        }
        
        .fc-daygrid-event {
          white-space: normal !important;
          padding: 2px 4px;
        }
        
        .fc-timegrid-event {
          border-radius: 4px;
        }
        
        .fc-event-title {
          font-weight: 500;
        }
        
        .fc-col-header-cell {
          background-color: #f9fafb;
          font-weight: 600;
        }
        
        .fc-day-today {
          background-color: #fef3f2 !important;
        }
        
        .fc-timegrid-slot-label {
          font-size: 0.75rem;
        }
      `}</style>
    </>
  )
}

