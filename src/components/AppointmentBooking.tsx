'use client'
import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Calendar, Clock, User, CheckCircle, AlertCircle, Phone, Mail, Download, Sparkles } from 'lucide-react'
import { Dialog, Transition } from '@headlessui/react'
import { supabase, Specialist, AestheticService } from '../lib/supabase'
import { format, isSameDay, setHours, setMinutes, addMinutes } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatDateForAPI } from '../lib/date-utils'
import { Fragment } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { downloadAppointmentReceipt } from '../lib/pdf-generator'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

interface AppointmentBookingProps {
  serviceId: string
  onBack: () => void
}

// 📧 MEJORA #4: Función mejorada para validar email
const isValidEmail = (email: string): boolean => {
  // Regex más estricta que valida formato correcto de email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email.trim())
}

// 📱 MEJORA #5: Función para validar teléfono argentino
const isValidArgentinaPhone = (phone: string): boolean => {
  if (!phone || phone.trim() === '') return true // Teléfono es opcional
  
  // Formatos válidos para Argentina:
  // +54 11 1234-5678
  // 11 1234-5678
  // 1112345678
  // +54 9 11 1234-5678 (con código de celular)
  const phoneRegex = /^(\+?54)?[ ]?(9[ ]?)?(11|[2-9]\d{1,3})[ ]?\d{4}[-]?\d{4}$/
  return phoneRegex.test(phone.trim())
}

// Función para normalizar texto
const normalizeText = (text: string): string => {
  return text.trim().replace(/\s+/g, ' ') // Elimina espacios extra y múltiples
}

// Función para formatear nombre (Primera letra mayúscula)
const formatName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Usar función centralizada para formateo de fechas

export default function AppointmentBooking({ serviceId, onBack }: AppointmentBookingProps) {
  // 🤖 MEJORA #2: Hook de reCAPTCHA
  const { executeRecaptcha } = useGoogleReCaptcha()
  
  const [specialist, setSpecialist] = useState<Specialist | null>(null)
  const [service, setService] = useState<AestheticService | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdAppointment, setCreatedAppointment] = useState<any>(null)
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [bookingsBlocked, setBookingsBlocked] = useState(false)
  const [blockingMessage, setBlockingMessage] = useState('')

  const fetchSpecialist = useCallback(async () => {
    const { data, error } = await supabase
      .from('specialists')
      .select('*')
      .eq('is_active', true)
      .single()
    
    if (data) setSpecialist(data)
    if (error) console.error('Error fetching specialist:', error)
  }, [])

  const fetchService = useCallback(async () => {
    const { data, error } = await supabase
      .from('aesthetic_services')
      .select('*')
      .eq('id', serviceId)
      .single()
    
    if (data) setService(data)
    if (error) console.error('Error fetching service:', error)
  }, [serviceId])

  const checkBookingStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/announcements')
      if (response.ok) {
        const data = await response.json()
        if (data.hasBlockingAnnouncement) {
          const blockingAnnouncement = data.announcements.find((a: any) => a.block_bookings)
          setBookingsBlocked(true)
          setBlockingMessage(blockingAnnouncement?.message || 'Las reservas están temporalmente suspendidas')
        } else {
          setBookingsBlocked(false)
          setBlockingMessage('')
        }
      }
    } catch (error) {
      console.error('Error checking booking status:', error)
    }
  }, [])

  const fetchAvailableTimes = useCallback(async () => {
    if (!selectedDate || !specialist || !service) return

    // Usar fecha local consistente para evitar desfases
    const localDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    const dayOfWeek = localDate.getDay()
    const dateString = formatDateForAPI(selectedDate)
    
    console.log('🔍 Buscando horarios para:', { 
      selectedDate: selectedDate.toISOString(), 
      localDate: localDate.toISOString(), 
      dayOfWeek, 
      dateString 
    })
    
    // Verificar si hay cierres para esa fecha
    const { data: closures } = await supabase
      .from('closures')
      .select('*')
      .eq('specialist_id', specialist.id)
      .eq('is_active', true)
      .lte('start_date', dateString)
      .gte('end_date', dateString)

    if (closures && closures.length > 0) {
      console.log('❌ Fecha cerrada:', closures[0].reason)
      setAvailableTimes([])
      setError(`No hay atención disponible: ${closures[0].reason || 'Cerrado'}`)
      return
    }
    
    // Obtener horario del especialista para ese día
    const { data: schedule } = await supabase
      .from('work_schedules')
      .select('start_time, end_time, allowed_services, lunch_start, lunch_end')
      .eq('specialist_id', specialist.id)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .single()

    if (!schedule) {
      console.log('❌ No hay horario para el día', dayOfWeek)
      setAvailableTimes([])
      return
    }

    // Verificar si el servicio está permitido en este día
    if (schedule.allowed_services && !schedule.allowed_services.includes(serviceId)) {
      console.log('❌ Servicio no permitido en este día')
      setAvailableTimes([])
      return
    }

    console.log('📅 Horario del especialista:', schedule)

    // Obtener turnos ya reservados para esa fecha con su duración
    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('appointment_time, duration')
      .eq('specialist_id', specialist.id)
      .eq('appointment_date', dateString)
      .neq('status', 'cancelled')

    console.log('🚫 Citas existentes:', existingAppointments)

    // 🔧 FIX Bug #3: Crear intervalos ocupados considerando la duración
    const occupiedIntervals: Array<{ start: Date; end: Date }> = []
    
    if (existingAppointments) {
      existingAppointments.forEach((apt: any) => {
        const [hour, min] = apt.appointment_time.split(':').map(Number)
        const startTime = setMinutes(setHours(new Date(localDate), hour), min)
        const endTime = addMinutes(startTime, apt.duration || 45)
        occupiedIntervals.push({ start: startTime, end: endTime })
      })
    }

    // Generar horarios disponibles según la duración del servicio
    const times = []
    const [startHour, startMin] = schedule.start_time.split(':').map(Number)
    const [endHour, endMin] = schedule.end_time.split(':').map(Number)
    
    let currentTime = setMinutes(setHours(new Date(localDate), startHour), startMin)
    const endTime = setMinutes(setHours(new Date(localDate), endHour), endMin)
    
    // Obtener horario de almuerzo si existe
    let lunchStart = null
    let lunchEnd = null
    if (schedule.lunch_start && schedule.lunch_end) {
      const [lunchStartHour, lunchStartMin] = schedule.lunch_start.split(':').map(Number)
      const [lunchEndHour, lunchEndMin] = schedule.lunch_end.split(':').map(Number)
      lunchStart = setMinutes(setHours(new Date(localDate), lunchStartHour), lunchStartMin)
      lunchEnd = setMinutes(setHours(new Date(localDate), lunchEndHour), lunchEndMin)
    }
    
    // Usar la duración del servicio para los intervalos
    const intervalMinutes = service.duration
    
    while (currentTime < endTime) {
      const proposedEnd = addMinutes(currentTime, intervalMinutes)
      
      // Verificar que no se pase del horario de fin
      if (proposedEnd > endTime) {
        break
      }
      
      // Excluir horario de almuerzo
      const isLunchTime = lunchStart && lunchEnd && 
        ((currentTime >= lunchStart && currentTime < lunchEnd) ||
         (proposedEnd > lunchStart && proposedEnd <= lunchEnd) ||
         (currentTime <= lunchStart && proposedEnd >= lunchEnd))
      
      // 🔧 FIX Bug #3: Verificar que no haya overlap con intervalos ocupados
      let hasOverlap = false
      for (const occupied of occupiedIntervals) {
        if (
          (currentTime >= occupied.start && currentTime < occupied.end) ||
          (proposedEnd > occupied.start && proposedEnd <= occupied.end) ||
          (currentTime <= occupied.start && proposedEnd >= occupied.end)
        ) {
          hasOverlap = true
          break
        }
      }
      
      if (!hasOverlap && !isLunchTime) {
        times.push(format(currentTime, 'HH:mm'))
      }
      
      currentTime = addMinutes(currentTime, intervalMinutes)
    }

    console.log('✅ Horarios disponibles:', times)
    setAvailableTimes(times)
    
    // Limpiar error si había
    if (error) setError(null)
  }, [selectedDate, specialist, service, serviceId])

  useEffect(() => {
    fetchSpecialist()
    fetchService()
    checkBookingStatus()
  }, [fetchSpecialist, fetchService, checkBookingStatus])

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimes()
    }
  }, [fetchAvailableTimes])

  // Validación en tiempo real
  const validateField = (field: string, value: string) => {
    const errors = { ...validationErrors }
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'El nombre es obligatorio'
        } else if (value.trim().length < 2) {
          errors.name = 'El nombre debe tener al menos 2 caracteres'
        } else {
          errors.name = ''
        }
        break
      case 'email':
        if (!value.trim()) {
          errors.email = 'El email es obligatorio'
        } else if (!isValidEmail(value)) {
          errors.email = 'Por favor ingresa un email válido'
        } else {
          errors.email = ''
        }
        break
      case 'phone':
        if (value && !isValidArgentinaPhone(value)) {
          errors.phone = 'Formato: +54 11 1234-5678 o 11 1234-5678'
        } else {
          errors.phone = ''
        }
        break
    }
    
    setValidationErrors(errors)
  }

  // Manejar cambios en los inputs con validación
  const handleInputChange = (field: string, value: string) => {
    const updatedInfo = { ...patientInfo }
    
    switch (field) {
      case 'name':
        updatedInfo.name = value // Mantenemos el valor original mientras escribe
        break
      case 'email':
        updatedInfo.email = value.toLowerCase().trim() // Email siempre en minúsculas
        break
      case 'phone':
        updatedInfo.phone = value.trim()
        break
    }
    
    setPatientInfo(updatedInfo)
    validateField(field, value)
    
    // Limpiar error general si existe
    if (error) setError(null)
  }

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !patientInfo.name.trim() || !patientInfo.email.trim()) {
      setError('Por favor completa todos los campos obligatorios')
      return
    }

    // Validar email antes de enviar
    if (!isValidEmail(patientInfo.email)) {
      setError('Por favor ingresa un email válido')
      return
    }

    setIsBooking(true)
    setError(null)
    
    try {
      // 🤖 MEJORA #2: Obtener token de reCAPTCHA
      let recaptchaToken = ''
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha('submit_appointment')
        } catch (captchaError) {
          console.error('Error obteniendo token de CAPTCHA:', captchaError)
          // Continuar sin CAPTCHA en desarrollo
          if (process.env.NODE_ENV !== 'development') {
            setError('Error de verificación. Por favor recarga la página e intenta nuevamente.')
            return
          }
        }
      }

      // Normalizar y formatear datos del paciente
      const normalizedPatientInfo = {
        name: formatName(patientInfo.name), // Formatear nombre correctamente
        email: patientInfo.email.toLowerCase().trim(), // Email en minúsculas
        phone: normalizeText(patientInfo.phone) // Normalizar teléfono
      }

      console.log('📋 Datos del paciente a enviar:', normalizedPatientInfo)

      // Usar API route para crear la cita (más seguro que conexión directa)
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          specialistId: specialist?.id,
          serviceId: serviceId,
          appointmentDate: formatDateForAPI(selectedDate),
          appointmentTime: selectedTime,
          duration: service?.duration || 45,
          patientInfo: normalizedPatientInfo,
          recaptchaToken // 🤖 Incluir token de CAPTCHA
        })
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('❌ Error from API:', result)
        setError(result.error || 'Error al crear el turno médico')
        throw new Error(result.error || 'Error al crear el turno médico')
      }

      const newAppointment = result.appointment
      console.log('✅ Turno creado exitosamente:', newAppointment)
      
      // Almacenar datos para el comprobante
      setCreatedAppointment({
        ...newAppointment,
        patientInfo: normalizedPatientInfo,
        specialistInfo: {
          name: specialist?.name,
          title: specialist?.title
        },
        serviceInfo: {
          name: service?.name,
          duration: service?.duration
        }
      })

      // Mostrar modal de éxito
      setShowConfirmModal(false)
      setShowSuccessModal(true)
      
    } catch (error: any) {
      console.error('❌ Error booking appointment:', error)
      setError(error.message || 'Hubo un problema al reservar tu turno. Por favor intenta nuevamente.')
    } finally {
      setIsBooking(false)
    }
  }

  const handleConfirmBooking = () => {
    // Verificar si las reservas están bloqueadas
    if (bookingsBlocked) {
      setError(blockingMessage || 'Las reservas están temporalmente suspendidas')
      return
    }

    // Validación completa antes de abrir el modal
    const errors = []
    
    if (!selectedDate) errors.push('Selecciona una fecha')
    if (!selectedTime) errors.push('Selecciona un horario')
    if (!patientInfo.name.trim()) errors.push('Ingresa tu nombre completo')
    if (!patientInfo.email.trim()) errors.push('Ingresa tu email')
    if (!isValidEmail(patientInfo.email)) errors.push('Ingresa un email válido')
    
    if (errors.length > 0) {
      setError(errors.join(', '))
      return
    }
    
    setError(null)
    setShowConfirmModal(true)
  }

  const handleDownloadReceipt = () => {
    if (!specialist || !service || !selectedDate || !selectedTime || !createdAppointment) return
    
    const appointmentData = {
      id: createdAppointment?.id || 'N/A',
      patientName: createdAppointment.patientInfo?.name || patientInfo.name,
      patientEmail: createdAppointment.patientInfo?.email || patientInfo.email,
      patientPhone: createdAppointment.patientInfo?.phone || patientInfo.phone,
      specialistName: specialist.name,
      specialistTitle: specialist.title,
      serviceName: service.name,
      serviceDuration: service.duration,
      date: selectedDate,
      time: selectedTime,
      createdAt: new Date()
    }
    
    downloadAppointmentReceipt(appointmentData)
    // Aviso de descarga no intrusivo
    setShowDownloadSuccess(true)
    setTimeout(() => setShowDownloadSuccess(false), 3000)
  }

  if (!specialist || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#a6566c] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#605a57]">Cargando información del especialista...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center text-[#a6566c] hover:text-[#605a57] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver al especialista
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#e5cfc2]">
        <div className="flex items-start space-x-4 mb-6">
          <div className="bg-gradient-to-r from-[#a6566c] to-[#605a57] p-3 rounded-full">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#26272b]">{specialist.name}</h2>
            <p className="text-[#a6566c] font-medium">{specialist.title}</p>
            <p className="text-[#605a57] mt-2">{service.name} - {service.duration} minutos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Date Picker */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Seleccionar Fecha
            </h3>
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                locale={es}
                minDate={new Date()}
                dateFormat="EEEE, d MMMM yyyy"
                inline
                className="w-full"
                calendarClassName="w-full border-0"
                dayClassName={(date) => {
                  const isPast = date < new Date()
                  const isSelected = selectedDate && isSameDay(date, selectedDate)
                  const isToday = isSameDay(date, new Date())
                  
                  let classes = 'flex items-center justify-center w-8 h-8 text-sm rounded-lg transition-all duration-200'
                  
                  if (isPast) {
                    classes += ' text-gray-300 cursor-not-allowed'
                  } else if (isSelected) {
                    classes += ' bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg'
                  } else if (isToday) {
                    classes += ' bg-green-100 text-green-800 font-semibold border-2 border-green-300'
                  } else {
                    classes += ' text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }
                  
                  return classes
                }}
                weekDayClassName={() => 'text-xs font-semibold text-gray-500 uppercase tracking-wide py-2'}
                monthClassName={() => 'text-lg font-bold text-gray-900 mb-4'}
              />
            </div>
            {selectedDate && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Fecha seleccionada:</span>{' '}
                  {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: es })}
                </p>
              </div>
            )}
          </div>

          {/* Selección de hora */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Seleccionar Horario
            </h3>
            {selectedDate ? (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Horarios disponibles para {format(selectedDate, 'EEEE, d MMMM', { locale: es })}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableTimes.map((time) => {
                    const isSelected = selectedTime === time
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                          isSelected
                            ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                            : 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300 text-gray-700'
                        }`}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
                {availableTimes.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No hay horarios disponibles</p>
                    <p className="text-sm text-gray-400">Intenta seleccionar otra fecha</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Selecciona una fecha primero</p>
                <p className="text-sm text-gray-400">Elige un día para ver los horarios disponibles</p>
              </div>
            )}
          </div>
        </div>

        {/* Información del paciente */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-900">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Información del Paciente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Campo Nombre */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Nombre completo *"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all placeholder-gray-600 text-gray-900 font-medium bg-white shadow-sm ${
                  validationErrors.name 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                }`}
                value={patientInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>
            
            {/* Campo Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="correo@ejemplo.com *"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all placeholder-gray-600 text-gray-900 font-medium bg-white shadow-sm ${
                  validationErrors.email 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                }`}
                value={patientInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>
            
            {/* Campo Teléfono */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                placeholder="+54 11 1234-5678"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all placeholder-gray-600 text-gray-900 font-medium bg-white shadow-sm ${
                  validationErrors.phone 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                }`}
                value={patientInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Información importante:</span> Los campos con * son obligatorios. El email debe ser válido para recibir confirmación.
            </p>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Botón de confirmación */}
        <div className="mt-8">
          <button
            onClick={handleConfirmBooking}
            disabled={!selectedDate || !selectedTime || !patientInfo.name.trim() || !patientInfo.email.trim() || !isValidEmail(patientInfo.email)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
          >
            Reservar Turno
          </button>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <Transition appear show={showConfirmModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowConfirmModal(false)}>
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
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 mb-6">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 mb-3">
                      Confirmar Reserva
                    </Dialog.Title>
                    <div className="bg-blue-50 p-4 rounded-xl mb-6">
                      <p className="text-blue-800 font-medium mb-2">
                        ¿Confirmas la reserva del turno estético?
                      </p>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p><strong>Especialista:</strong> {specialist?.name}</p>
                        <p><strong>Servicio:</strong> {service?.name}</p>
                        <p><strong>Fecha:</strong> {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: es })}</p>
                        <p><strong>Hora:</strong> {selectedTime}</p>
                        <p><strong>Paciente:</strong> {patientInfo.name}</p>
                        <p><strong>Email:</strong> {patientInfo.email}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center items-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors disabled:bg-gray-400"
                        onClick={handleBookAppointment}
                        disabled={isBooking}
                      >
                        {isBooking ? (
                          <>
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                            Reservando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirmar Reserva
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-lg bg-gray-600 px-4 py-3 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                        onClick={() => setShowConfirmModal(false)}
                        disabled={isBooking}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal de Éxito */}
      <Transition appear show={showSuccessModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowSuccessModal(false)}>
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
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 mb-6">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 mb-3">
                      ¡Turno Reservado con Éxito!
                    </Dialog.Title>
                    <div className="bg-green-50 p-4 rounded-xl mb-6">
                      <p className="text-green-800 font-medium mb-2">
                        Tu cita estética ha sido guardada en el sistema
                      </p>
                      <p className="text-sm text-green-700">
                        El turno está registrado con {specialist?.name} para el {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: es })} a las {selectedTime} para el servicio de {service?.name}.
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-xl mb-6 text-left">
                      <h4 className="font-medium text-blue-900 mb-2">Recordatorio</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Llega 15 minutos antes de tu cita</li>
                        <li>• Trae tu documento de identidad</li>
                        <li>• Trae tu obra social (si tienes)</li>
                        <li>• Se envió confirmación a tu email</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      {showDownloadSuccess && (
                        <div className="w-full rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-2 text-sm">
                          📄 El comprobante fue descargado exitosamente.
                        </div>
                      )}
                      <button
                        type="button"
                        className="w-full inline-flex justify-center items-center rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition-colors"
                        onClick={handleDownloadReceipt}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar Comprobante
                      </button>
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        onClick={() => {
                          setShowSuccessModal(false)
                          onBack()
                        }}
                      >
                        Volver al Inicio
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

