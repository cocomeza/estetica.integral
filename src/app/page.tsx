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
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-secondary/30">
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Centro de Estética Integral
                </h1>
                <p className="text-xs text-neutral font-medium">Lorena Esquivel - Esteticista Profesional</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-primary to-accent text-white text-sm font-medium rounded-lg hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Settings className="h-4 w-4 mr-2" />
              Panel Admin
            </Link>
          </div>
        </div>
        {!supabaseEnabled && (
          <div className="bg-secondary border-l-4 border-primary p-3">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-neutral">
                  <span className="font-medium">Modo de demostración:</span> 
                  {' '}Configurar Supabase para habilitar todas las funcionalidades.
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* Footer más compacto */}
      <footer className="bg-white border-t border-secondary mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Información del centro */}
            <div>
              <h3 className="text-base font-semibold text-dark mb-3">Centro de Estética Integral</h3>
              <div className="space-y-1 text-sm text-neutral">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  <span>Lorena Esquivel - Esteticista Profesional</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  <span>Mat. 12345</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  <span>Av. Corrientes 1234, CABA</span>
                </div>
              </div>
            </div>
            
            {/* Contacto */}
            <div>
              <h3 className="text-base font-semibold text-dark mb-3">Contacto</h3>
              <div className="space-y-1 text-sm text-neutral">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  <span>+54 11 1234-5678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  <span>lorena@esteticaintegral.com.ar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  <span>Lun-Vie: 09:00-18:00</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  <span>Sáb: 09:00-13:00 (Depilación)</span>
                </div>
              </div>
            </div>
            
            {/* Desarrollo */}
            <div>
              <h3 className="text-base font-semibold text-dark mb-3">Desarrollo</h3>
              <div className="text-center">
                <small className="text-neutral">
                  Desarrollado por{' '}
                  <a href="https://botoncreativo.onrender.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent underline">
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