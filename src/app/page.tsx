'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, Sparkles } from 'lucide-react'
import { supabase, AestheticService, isSupabaseConfigured } from '../lib/supabase'
import { AESTHETIC_SERVICES } from '../config/aesthetic-services'
import ServiceSelection from '../components/ServiceSelection'
import SpecialistInfo from '../components/SpecialistInfo'
import AppointmentBooking from '../components/AppointmentBooking'
import AnnouncementBanner from '../components/AnnouncementBanner'

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
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-secondary/30">
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <img 
                  src="/images/logo_estetica-integral.png" 
                  alt="Estética Integral" 
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Estética Integral
                </h1>
                <p className="text-xs text-neutral">Lorena Esquivel</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-primary to-accent text-white text-sm font-medium rounded-lg hover:from-primary/90 hover:to-accent/90 transition-all"
            >
              <Settings className="h-4 w-4 mr-1" />
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner de anuncios */}
        <div className="mb-6">
          <AnnouncementBanner />
        </div>

        {/* Mensaje de bienvenida simple */}
        {!selectedService && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reservá tu turno</h2>
            <p className="text-gray-600">Elegí el servicio que necesitás y reservá en minutos</p>
          </div>
        )}

        {!selectedService ? (
          <ServiceSelection 
            services={services}
            onSelectService={setSelectedService}
          />
        ) : (
          <AppointmentBooking 
            serviceId={selectedService}
            onBack={() => setSelectedService(null)}
          />
        )}
      </main>

      {/* Footer profesional y balanceado */}
      <footer className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Contenido principal en grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* Información de la clínica */}
            <div className="text-center md:text-left">
              <div className="font-bold text-gray-900 text-lg mb-2">
                Lorena Esquivel
              </div>
              <div className="text-primary font-medium mb-3">
                Estética Integral
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                Barberis 571<br />
                Villa Ramallo, Pcia de Bs As
              </div>
            </div>

            {/* Información de contacto */}
            <div className="text-center md:text-left">
              <div className="font-semibold text-gray-900 text-sm mb-3">
                Contacto
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium">03407 - 494611</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
              <span>Lun-Vie: 09:00-18:00</span>
                </div>
              </div>
            </div>

            {/* Horarios de atención */}
            <div className="text-center md:text-left">
              <div className="font-semibold text-gray-900 text-sm mb-3">
                Horarios
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Lunes a Viernes: 09:00 - 18:00</div>
                <div>Sábados: 09:00 - 13:00</div>
                <div>Domingos: Cerrado</div>
              </div>
            </div>
          </div>

          {/* Separador y copyright */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="text-xs text-gray-500">
                © 2025 Estética Integral Villa Ramallo. Todos los derechos reservados.
              </div>
              <div className="text-xs text-gray-500">
                Desarrollado por{' '}
                <a 
                  href="https://botoncreativo.onrender.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-pink-700 font-medium transition-colors"
                >
                  Boton Creativo
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}