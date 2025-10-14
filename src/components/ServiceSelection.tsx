'use client'
import { useState } from 'react'
import { Search, Clock, Sparkles, Heart, Zap, Star, Users } from 'lucide-react'
import { AestheticService } from '../lib/supabase'

interface ServiceSelectionProps {
  services: AestheticService[]
  onSelectService: (serviceId: string) => void
}

const categoryIcons = {
  facial: Heart,
  corporal: Users,
  depilacion: Zap,
  terapeutico: Star,
  estetico: Sparkles
}

const categoryNames = {
  facial: 'Tratamientos Faciales',
  corporal: 'Tratamientos Corporales',
  depilacion: 'Depilación',
  terapeutico: 'Terapias',
  estetico: 'Estética Avanzada'
}

const categoryColors = {
  facial: 'from-primary to-accent',
  corporal: 'from-accent to-neutral',
  depilacion: 'from-primary to-neutral',
  terapeutico: 'from-accent to-primary',
  estetico: 'from-neutral to-primary'
}

export default function ServiceSelection({ services, onSelectService }: ServiceSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filtrar servicios por búsqueda y categoría
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || service.category === selectedCategory
    return matchesSearch && matchesCategory && service.is_active
  })

  // Agrupar servicios por categoría
  const servicesByCategory = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, AestheticService[]>)

  // Obtener categorías únicas
  const categories = Array.from(new Set(services.map(s => s.category)))

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full mb-4">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-dark mb-3">
          Descubre Nuestros Servicios
        </h2>
        <p className="text-lg text-neutral max-w-2xl mx-auto leading-relaxed">
          Transformamos tu belleza con tratamientos personalizados y tecnología de vanguardia. 
          Selecciona el servicio que mejor se adapte a tus necesidades.
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="max-w-lg mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar tratamientos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-secondary rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-dark placeholder-neutral shadow-lg"
          />
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !selectedCategory
              ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
              : 'bg-white text-neutral hover:bg-secondary/50 border border-secondary'
          }`}
        >
          Todos los servicios
        </button>
        {categories.map((category) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons]
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                  : 'bg-white text-neutral hover:bg-secondary/50 border border-secondary'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{categoryNames[category as keyof typeof categoryNames]}</span>
            </button>
          )
        })}
      </div>

      {/* Servicios agrupados por categoría */}
      <div className="space-y-12">
        {Object.entries(servicesByCategory).map(([category, categoryServices]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons]
          const gradientColor = categoryColors[category as keyof typeof categoryColors]
          
          return (
            <div key={category} className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${gradientColor}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {categoryNames[category as keyof typeof categoryNames]}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryServices.map((service) => (
                  <div
                    key={service.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-pink-200 transform hover:-translate-y-1"
                  >
                    <div className={`h-2 bg-gradient-to-r ${gradientColor} opacity-80`}></div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                          {service.name}
                        </h4>
                        <div className="flex items-center space-x-1 text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{service.duration} min</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                        {service.description}
                      </p>
                      
                      <button
                        onClick={() => onSelectService(service.id)}
                        className={`w-full bg-gradient-to-r ${gradientColor} text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all transform active:scale-95 shadow-md`}
                      >
                        Reservar Turno
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Mensaje cuando no hay resultados */}
      {filteredServices.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            No encontramos servicios
          </h3>
          <p className="text-gray-600 mb-6">
            Intenta con otros términos de búsqueda o selecciona una categoría diferente.
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory(null)
            }}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all"
          >
            Ver todos los servicios
          </button>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 text-center border border-pink-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          ¿Necesitas asesoramiento personalizado?
        </h3>
        <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
          Nuestro equipo está listo para recomendarte el tratamiento ideal según tus necesidades específicas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center space-x-2 text-gray-700">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="font-medium">Consulta sin costo</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="font-medium">Tratamientos personalizados</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span className="font-medium">Tecnología de vanguardia</span>
          </div>
        </div>
      </div>
    </div>
  )
}
