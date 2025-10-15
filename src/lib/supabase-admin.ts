import { createClient } from '@supabase/supabase-js'
import { getTodayString, getDayOfWeek } from './date-utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente de Supabase con permisos de administrador (service role) o anónimo como fallback
// Solo debe usarse en el servidor, nunca en el cliente
let supabaseAdmin: any = null

if (supabaseUrl && supabaseServiceKey) {
  // Modo producción con service role
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
} else if (supabaseUrl && supabaseAnonKey) {
  // Modo demo con clave anónima
  console.warn('⚠️ Usando clave anónima para operaciones admin (modo demo)')
  supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
} else {
  console.error('❌ No hay configuración de Supabase disponible')
}

export { supabaseAdmin }

export interface AppointmentWithDetails {
  id: string
  appointment_date: string
  appointment_time: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
  specialist: {
    id: string
    name: string
    email: string
    phone: string
    title: string
  }
  service: {
    id: string
    name: string
    description: string
    duration: number
  }
  patient: {
    id: string
    name: string
    email: string
    phone: string
  }
}

export interface AdminAppointmentsFilter {
  search?: string
  startDate?: string
  endDate?: string
  status?: string
  specialistId?: string
  page?: number
  limit?: number
  sortBy?: 'date' | 'specialist' | 'patient'
  sortOrder?: 'asc' | 'desc'
}

export async function getAppointmentsForAdmin({
  search = '',
  startDate,
  endDate,
  status,
  specialistId,
  page = 1,
  limit = 10,
  sortBy = 'date',
  sortOrder = 'desc'
}: AdminAppointmentsFilter = {}) {
  let query = supabaseAdmin
    .from('appointments')
    .select(`
      id,
      appointment_date,
      appointment_time,
      status,
      notes,
      created_at,
      specialist:specialists(
        id,
        name,
        email,
        phone,
        title
      ),
      service:aesthetic_services(
        id,
        name,
        description,
        duration
      ),
      patient:patients(
        id,
        name,
        email,
        phone
      )
    `, { count: 'exact' })

  // Filtros
  if (startDate) {
    query = query.gte('appointment_date', startDate)
  }
  if (endDate) {
    query = query.lte('appointment_date', endDate)
  }
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  if (specialistId) {
    query = query.eq('specialist_id', specialistId)
  }

  // Búsqueda de texto (primero buscar pacientes que coincidan)
  if (search) {
    const { data: matchingPatients } = await supabaseAdmin
      .from('patients')
      .select('id')
      .or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
    
    if (matchingPatients && matchingPatients.length > 0) {
      const patientIds = matchingPatients.map((p: any) => p.id)
      query = query.in('patient_id', patientIds)
    } else {
      // No hay pacientes que coincidan, retornar resultados vacíos
      return {
        appointments: [],
        totalCount: 0,
        page,
        limit,
        totalPages: 0
      }
    }
  }

  // Ordenamiento
  if (sortBy === 'date') {
    query = query.order('appointment_date', { ascending: sortOrder === 'asc' })
    query = query.order('appointment_time', { ascending: sortOrder === 'asc' })
  } else if (sortBy === 'specialist') {
    query = query.order('name', { foreignTable: 'specialists', ascending: sortOrder === 'asc' })
  } else if (sortBy === 'patient') {
    query = query.order('name', { foreignTable: 'patients', ascending: sortOrder === 'asc' })
  } else {
    // Default ordering
    query = query.order('appointment_date', { ascending: sortOrder === 'asc' })
    query = query.order('appointment_time', { ascending: sortOrder === 'asc' })
  }

  // Paginación
  const offset = (page - 1) * limit
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching admin appointments:', error)
    throw error
  }

  return {
    appointments: (data || []) as unknown as AppointmentWithDetails[],
    totalCount: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

export async function updateAppointmentStatus(appointmentId: string, status: 'scheduled' | 'completed' | 'cancelled') {
  const { data, error } = await supabaseAdmin
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId)
    .select()
    .single()

  if (error) {
    console.error('Error updating appointment status:', error)
    throw error
  }

  return data
}

export async function getDoctorsForAdmin() {
  const { data, error } = await supabaseAdmin
    .from('specialists')
    .select(`
      id,
      name,
      email,
      title
    `)
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching specialists for admin:', error)
    throw error
  }

  return data
}

export async function getAppointmentStats() {
  // Obtener fecha de hoy en zona horaria local para evitar desfases
  const today = getTodayString()
  
  const [
    { count: totalAppointments },
    { count: todayAppointments },
    { count: scheduledAppointments },
    { count: completedAppointments }
  ] = await Promise.all([
    supabaseAdmin.from('appointments').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('appointments').select('*', { count: 'exact', head: true }).eq('appointment_date', today),
    supabaseAdmin.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'scheduled'),
    supabaseAdmin.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'completed')
  ])

  return {
    total: totalAppointments || 0,
    today: todayAppointments || 0,
    scheduled: scheduledAppointments || 0,
    completed: completedAppointments || 0
  }
}

// Nuevas funciones para CRUD completo de citas

export interface CreateAppointmentData {
  specialistId: string
  patientId: string
  appointmentDate: string
  appointmentTime: string
  status?: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

export interface UpdateAppointmentData {
  specialistId?: string
  patientId?: string
  appointmentDate?: string
  appointmentTime?: string
  status?: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

export async function createAppointmentForAdmin(appointmentData: CreateAppointmentData) {
  // Verificar que el horario esté disponible
  const { data: existingAppointment } = await supabaseAdmin
    .from('appointments')
    .select('id')
    .eq('specialist_id', appointmentData.specialistId)
    .eq('appointment_date', appointmentData.appointmentDate)
    .eq('appointment_time', appointmentData.appointmentTime)
    .neq('status', 'cancelled')
    .single()

  if (existingAppointment) {
    throw new Error('El horario seleccionado ya está ocupado')
  }

  const { data, error } = await supabaseAdmin
    .from('appointments')
    .insert([{
      specialist_id: appointmentData.specialistId,
      patient_id: appointmentData.patientId,
      appointment_date: appointmentData.appointmentDate,
      appointment_time: appointmentData.appointmentTime,
      status: appointmentData.status || 'scheduled',
      notes: appointmentData.notes
    }])
    .select(`
      id,
      appointment_date,
      appointment_time,
      status,
      notes,
      created_at,
      specialist:specialists(
        id,
        name,
        email,
        phone,
        title
      ),
      service:aesthetic_services(
        id,
        name,
        description,
        duration
      ),
      patient:patients(
        id,
        name,
        email,
        phone
      )
    `)
    .single()

  if (error) {
    console.error('Error creating appointment:', error)
    throw error
  }

  return data
}

export async function updateAppointmentForAdmin(appointmentId: string, updateData: UpdateAppointmentData) {
  // Si se está cambiando fecha/hora/especialista, verificar disponibilidad
  if (updateData.specialistId && updateData.appointmentDate && updateData.appointmentTime) {
    const { data: existingAppointment } = await supabaseAdmin
      .from('appointments')
      .select('id')
      .eq('specialist_id', updateData.specialistId)
      .eq('appointment_date', updateData.appointmentDate)
      .eq('appointment_time', updateData.appointmentTime)
      .neq('status', 'cancelled')
      .neq('id', appointmentId)
      .single()

    if (existingAppointment) {
      throw new Error('El horario seleccionado ya está ocupado')
    }
  }

  const updateObject: any = {}
  
  if (updateData.specialistId) updateObject.specialist_id = updateData.specialistId
  if (updateData.patientId) updateObject.patient_id = updateData.patientId
  if (updateData.appointmentDate) updateObject.appointment_date = updateData.appointmentDate
  if (updateData.appointmentTime) updateObject.appointment_time = updateData.appointmentTime
  if (updateData.status) updateObject.status = updateData.status
  if (updateData.notes !== undefined) updateObject.notes = updateData.notes

  const { data, error } = await supabaseAdmin
    .from('appointments')
    .update(updateObject)
    .eq('id', appointmentId)
    .select(`
      id,
      appointment_date,
      appointment_time,
      status,
      notes,
      created_at,
      specialist:specialists(
        id,
        name,
        email,
        phone,
        title
      ),
      service:aesthetic_services(
        id,
        name,
        description,
        duration
      ),
      patient:patients(
        id,
        name,
        email,
        phone
      )
    `)
    .single()

  if (error) {
    console.error('Error updating appointment:', error)
    throw error
  }

  return data
}

export async function deleteAppointmentForAdmin(appointmentId: string) {
  const { data, error } = await supabaseAdmin
    .from('appointments')
    .delete()
    .eq('id', appointmentId)
    .select()
    .single()

  if (error) {
    console.error('Error deleting appointment:', error)
    throw error
  }

  return data
}

export async function getPatientsForAdmin() {
  const { data, error } = await supabaseAdmin
    .from('patients')
    .select('id, name, email, phone')
    .order('name')

  if (error) {
    console.error('Error fetching patients for admin:', error)
    throw error
  }

  return data
}

export async function createPatientForAdmin(patientData: { name: string; email: string; phone?: string }) {
  // Verificar si el email ya existe
  const { data: existingPatient } = await supabaseAdmin
    .from('patients')
    .select('id')
    .eq('email', patientData.email)
    .single()

  if (existingPatient) {
    throw new Error('Ya existe un paciente con este email')
  }

  const { data, error } = await supabaseAdmin
    .from('patients')
    .insert([patientData])
    .select()
    .single()

  if (error) {
    console.error('Error creating patient:', error)
    throw error
  }

  return data
}

export async function getAvailableTimesForAdmin(specialistId: string, date: string) {
  // Obtener horario del especialista para ese día usando función centralizada
  const dayOfWeek = getDayOfWeek(date)
  
  const { data: schedule } = await supabaseAdmin
    .from('work_schedules')
    .select('start_time, end_time')
    .eq('specialist_id', specialistId)
    .eq('day_of_week', dayOfWeek)
    .single()

  if (!schedule) {
    return []
  }

  // Obtener turnos ya reservados para esa fecha
  const { data: existingAppointments } = await supabaseAdmin
    .from('appointments')
    .select('appointment_time')
    .eq('specialist_id', specialistId)
    .eq('appointment_date', date)
    .neq('status', 'cancelled')

  const bookedTimes = existingAppointments?.map((apt: any) => apt.appointment_time) || []

  // Generar horarios disponibles (cada 30 minutos)
  const times = []
  const [startHour, startMin] = schedule.start_time.split(':').map(Number)
  const [endHour, endMin] = schedule.end_time.split(':').map(Number)
  
  const startTime = startHour * 60 + startMin
  const endTime = endHour * 60 + endMin
  
  for (let time = startTime; time < endTime; time += 30) {
    const hours = Math.floor(time / 60).toString().padStart(2, '0')
    const minutes = (time % 60).toString().padStart(2, '0')
    const timeString = `${hours}:${minutes}`
    
    if (!bookedTimes.includes(timeString)) {
      times.push(timeString)
    }
  }

  return times
}

// Función para crear una reserva pública (desde el frontend)
export async function createPublicAppointment({
  specialistId,
  serviceId,
  appointmentDate,
  appointmentTime,
  duration,
  patientInfo
}: {
  specialistId: string
  serviceId: string
  appointmentDate: string
  appointmentTime: string
  duration: number
  patientInfo: {
    name: string
    email: string
    phone?: string
  }
}) {
  console.log('🔄 Iniciando creación de reserva pública...')
  
  try {
    // 1. Verificar que el especialista existe y está activo
    const { data: specialist, error: specialistError } = await supabaseAdmin
      .from('specialists')
      .select('id, name, is_active')
      .eq('id', specialistId)
      .eq('is_active', true)
      .single()

    if (specialistError || !specialist) {
      throw new Error('Especialista no encontrado o inactivo')
    }

    // 2. Verificar que el servicio existe y está activo
    const { data: service, error: serviceError } = await supabaseAdmin
      .from('aesthetic_services')
      .select('id, name, duration, is_active')
      .eq('id', serviceId)
      .eq('is_active', true)
      .single()

    if (serviceError || !service) {
      throw new Error('Servicio no encontrado o inactivo')
    }

    // 3. Verificar disponibilidad del horario
    const { data: existingAppointment } = await supabaseAdmin
      .from('appointments')
      .select('id')
      .eq('specialist_id', specialistId)
      .eq('appointment_date', appointmentDate)
      .eq('appointment_time', appointmentTime)
      .neq('status', 'cancelled')
      .single()

    if (existingAppointment) {
      throw new Error('El horario seleccionado ya no está disponible')
    }

    // 4. Buscar o crear el paciente
    let patient
    const { data: existingPatient } = await supabaseAdmin
      .from('patients')
      .select('id, name, email, phone')
      .eq('email', patientInfo.email.toLowerCase().trim())
      .single()

    if (existingPatient) {
      // Actualizar datos del paciente si es necesario
      const { data: updatedPatient, error: updateError } = await supabaseAdmin
        .from('patients')
        .update({
          name: patientInfo.name.trim(),
          phone: patientInfo.phone?.trim() || existingPatient.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPatient.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error actualizando paciente:', updateError)
        patient = existingPatient
      } else {
        patient = updatedPatient
      }
    } else {
      // Crear nuevo paciente
      const { data: newPatient, error: patientError } = await supabaseAdmin
        .from('patients')
        .insert({
          name: patientInfo.name.trim(),
          email: patientInfo.email.toLowerCase().trim(),
          phone: patientInfo.phone?.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (patientError) {
        console.error('Error creando paciente:', patientError)
        throw new Error('Error al registrar los datos del paciente')
      }

      patient = newPatient
    }

    // 5. Crear la cita
    const appointmentData = {
      specialist_id: specialistId,
      patient_id: patient.id,
      service_id: serviceId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      duration: duration,
      status: 'scheduled' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: newAppointment, error: appointmentError } = await supabaseAdmin
      .from('appointments')
      .insert(appointmentData)
      .select(`
        id,
        appointment_date,
        appointment_time,
        duration,
        status,
        notes,
        created_at,
        specialist:specialists(id, name, title, email, phone),
        service:aesthetic_services(id, name, description, duration),
        patient:patients(id, name, email, phone)
      `)
      .single()

    if (appointmentError) {
      console.error('Error creando cita:', appointmentError)
      throw new Error('Error al crear la reserva')
    }

    console.log('✅ Reserva pública creada exitosamente:', newAppointment.id)
    return newAppointment

  } catch (error: any) {
    console.error('❌ Error en createPublicAppointment:', error)
    throw error
  }
}
