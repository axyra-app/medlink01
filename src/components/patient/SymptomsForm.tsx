import { AlertCircle, Clock, Zap } from 'lucide-react';
import React, { useState } from 'react';

interface SymptomsFormProps {
  onSubmit: (data: {
    symptoms: string;
    urgency: 'low' | 'medium' | 'high';
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
  }) => void;
  loading: boolean;
}

export const SymptomsForm: React.FC<SymptomsFormProps> = ({ onSubmit, loading }) => {
  const [symptoms, setSymptoms] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);

  React.useEffect(() => {
    // Obtener ubicación actual del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: 'Ubicación actual', // En producción, usar reverse geocoding
          });
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          // Ubicación por defecto (Bogotá)
          setCurrentLocation({
            latitude: 4.6097,
            longitude: -74.0817,
            address: 'Bogotá, Colombia',
          });
        }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!symptoms.trim()) {
      return;
    }

    if (!currentLocation) {
      return;
    }

    onSubmit({
      symptoms: symptoms.trim(),
      urgency,
      location: currentLocation,
    });
  };

  const urgencyOptions = [
    {
      value: 'low' as const,
      label: 'Baja',
      description: 'Consulta general',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      value: 'medium' as const,
      label: 'Media',
      description: 'Atención urgente',
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      value: 'high' as const,
      label: 'Alta',
      description: 'Emergencia',
      icon: Zap,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Campo de síntomas */}
      <div>
        <label htmlFor='symptoms' className='block text-sm font-medium text-gray-700 mb-2'>
          Describe tus síntomas
        </label>
        <textarea
          id='symptoms'
          rows={4}
          className='input-field resize-none'
          placeholder='Ej: Dolor de cabeza intenso desde hace 2 horas, acompañado de náuseas...'
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          required
        />
        <p className='mt-1 text-xs text-gray-500'>Sé específico sobre cuándo comenzaron los síntomas y su intensidad</p>
      </div>

      {/* Nivel de urgencia */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-3'>Nivel de urgencia</label>
        <div className='grid grid-cols-1 gap-3'>
          {urgencyOptions.map((option) => {
            const Icon = option.icon;
            return (
              <label
                key={option.value}
                className={`
                  relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${
                    urgency === option.value
                      ? `${option.bgColor} ${option.borderColor}`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <input
                  type='radio'
                  name='urgency'
                  value={option.value}
                  checked={urgency === option.value}
                  onChange={(e) => setUrgency(e.target.value as 'low' | 'medium' | 'high')}
                  className='sr-only'
                />
                <Icon className={`h-5 w-5 ${option.color} mr-3`} />
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium text-gray-900'>{option.label}</span>
                    {urgency === option.value && (
                      <div className={`w-2 h-2 rounded-full ${option.color.replace('text-', 'bg-')}`} />
                    )}
                  </div>
                  <p className='text-sm text-gray-600'>{option.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Información de ubicación */}
      {currentLocation && (
        <div className='bg-gray-50 rounded-lg p-4'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>Ubicación</h4>
          <p className='text-sm text-gray-600'>{currentLocation.address}</p>
        </div>
      )}

      {/* Botón de envío */}
      <button
        type='submit'
        disabled={loading || !symptoms.trim() || !currentLocation}
        className='btn-primary w-full flex items-center justify-center'
      >
        {loading ? (
          <>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
            Solicitando servicio...
          </>
        ) : (
          <>
            Solicitar Atención Médica
            <Zap className='ml-2 h-4 w-4' />
          </>
        )}
      </button>
    </form>
  );
};
