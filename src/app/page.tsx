'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, Sparkles } from 'lucide-react'
import { supabase, AestheticService, isSupabaseConfigured } from '../lib/supabase'
import { AESTHETIC_SERVICES } from '../config/aesthetic-services'
import ServiceSelection from '../components/ServiceSelection'
import SpecialistInfo from '../components/SpecialistInfo'
import AppointmentBooking from '../components/AppointmentBooking'

// Datos de ejemplo para mostrar la interfaz cuando Supabase no está configurado
const mockServices: AestheticService[] = [
  {
    id: '1',
    name: 'Drenaje Linfático',
    description: 'Técnica de masaje suave que estimula el sistema linfático para eliminar toxinas y reducir la retención de líquidos.',
    duration: 45,
    category: 'corporal',
    is_active: true
  },
  {
    id: '2',
    name: 'Limpieza Facial',
    description: 'Tratamiento profundo que incluye limpieza, exfoliación y mascarilla purificante.',
    duration: 45,
    category: 'facial',
    is_active: true
  },
  {
    id: '3',
    name: 'Depilación Láser',
    description: 'Eliminación definitiva del vello no deseado mediante tecnología láser de última generación.',
    duration: 20,
    category: 'depilacion',
    is_active: true
  },
  {
    id: '4',
    name: 'Cosmiatría',
    description: 'Tratamientos faciales especializados para mejorar la textura y luminosidad de la piel.',
    duration: 45,
    category: 'facial',
    is_active: true
  },
  {
    id: '5',
    name: 'Reflexología',
    description: 'Técnica terapéutica que estimula puntos específicos en los pies para promover el bienestar.',
    duration: 45,
    category: 'terapeutico',
    is_active: true
  },
  {
    id: '6',
    name: 'Lifting Facial',
    description: 'Tratamiento no invasivo que tensiona y reafirma la piel del rostro.',
    duration: 45,
    category: 'estetico',
    is_active: true
  }
]

export default function Home() {
  const [services, setServices] = useState<AestheticService[]>([])
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [showSpecialist, setShowSpecialist] = useState(false)
  const [supabaseEnabled, setSupabaseEnabled] = useState(false)

  useEffect(() => {
    const configured = isSupabaseConfigured()
    setSupabaseEnabled(configured)
    
    if (configured) {
      fetchServices()
    } else {
      // Usar datos de ejemplo si Supabase no está configurado
      setServices(mockServices)
    }
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('aesthetic_services')
        .select('*')
        .eq('is_active', true)
        .order('category, name')
      
      if (data) setServices(data)
      if (error) {
        console.error('Error fetching services:', error)
        // Fallback a datos de ejemplo si hay error
        setServices(mockServices)
      }
    } catch (error) {
      console.error('Error connecting to Supabase:', error)
      // Usar datos de ejemplo si hay problemas de conexión
      setServices(mockServices)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e5cfc2] via-white to-[#e5cfc2]/30">
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-[#e5cfc2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-[#a6566c] to-[#605a57] p-2 rounded-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#a6566c] to-[#605a57] bg-clip-text text-transparent">
                  Centro de Estética Integral
                </h1>
                <p className="text-sm text-[#605a57] font-medium">Lorena Esquivel - Esteticista Profesional</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#a6566c] to-[#605a57] text-white text-sm font-medium rounded-lg hover:from-[#a6566c]/90 hover:to-[#605a57]/90 focus:outline-none focus:ring-2 focus:ring-[#a6566c]/20 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Settings className="h-4 w-4 mr-2" />
              Panel Administrativo
            </Link>
          </div>
        </div>
        {!supabaseEnabled && (
          <div className="bg-[#e5cfc2] border-l-4 border-[#a6566c] p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-[#605a57]">
                  <span className="font-medium">Modo de demostración:</span> 
                  {' '}Configurar Supabase para habilitar todas las funcionalidades.
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedService ? (
          <ServiceSelection 
            services={services}
            onSelectService={setSelectedService}
          />
        ) : !showSpecialist ? (
          <SpecialistInfo 
            serviceId={selectedService}
            onContinue={() => setShowSpecialist(true)}
            onBack={() => setSelectedService(null)}
          />
        ) : (
          <AppointmentBooking 
            serviceId={selectedService}
            onBack={() => setShowSpecialist(false)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e5cfc2] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Información del centro */}
            <div>
              <h3 className="text-lg font-semibold text-[#26272b] mb-4">Centro de Estética Integral</h3>
              <div className="space-y-2 text-[#605a57]">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-[#a6566c] rounded-full"></span>
                  <span>Lorena Esquivel - Esteticista Profesional</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-[#a6566c] rounded-full"></span>
                  <span>Mat. 12345</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-[#a6566c] rounded-full"></span>
                  <span>Av. Corrientes 1234, CABA</span>
                </div>
              </div>
            </div>
            
            {/* Contacto */}
            <div>
              <h3 className="text-lg font-semibold text-[#26272b] mb-4">Contacto</h3>
              <div className="space-y-2 text-[#605a57]">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-[#a6566c] rounded-full"></span>
                  <span>+54 11 1234-5678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-[#a6566c] rounded-full"></span>
                  <span>lorena@esteticaintegral.com.ar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-[#a6566c] rounded-full"></span>
                  <span>Lunes a Viernes: 09:00 - 18:00</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-[#a6566c] rounded-full"></span>
                  <span>Sábados: 09:00 - 13:00 (Solo Depilación)</span>
                </div>
              </div>
            </div>
            
            {/* Desarrollo */}
            <div>
              <h3 className="text-lg font-semibold text-[#26272b] mb-4">Desarrollo</h3>
              <div className="text-center">
                <small className="text-[#605a57]">
                  Desarrollado por{' '}
                  <a href="https://botoncreativo.onrender.com" target="_blank" rel="noopener noreferrer" className="text-[#a6566c] hover:text-[#605a57] underline">
                    Botón Creativo
                  </a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}