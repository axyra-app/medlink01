import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { db } from '@/lib/firebase';
import { ServiceRequest } from '@/types';
import { doc, updateDoc } from 'firebase/firestore';
import { AlertCircle, Clock, MapPin, Phone, User } from 'lucide-react';
import React, { useState } from 'react';

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onAccept: () => void;
}

export const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({ request, onAccept }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAccept = async () => {
    setLoading(true);
    setError('');

    try {
      // Simular llamada a Cloud Function acceptService
      const response = await fetch('/api/acceptService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: request.id,
          doctorId: 'current-doctor-id', // En producción, obtener del contexto
        }),
      });

      if (!response.ok) {
        throw new Error('Error al aceptar el servicio');
      }

      // Actualizar estado local del servicio
      await updateDoc(doc(db, 'serviceRequests', request.id), {
        status: 'in-service',
        doctorId: 'current-doctor-id',
        acceptedAt: new Date(),
      });

      onAccept();
    } catch (err: any) {
      setError(err.message || 'Error al aceptar el servicio');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return 'No especificada';
    }
  };

  return (
    <div className='border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow'>
      {error && <Alert type='error' message={error} className='mb-4' />}

      <div className='space-y-3'>
        {/* Header con urgencia */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <User className='h-4 w-4 text-gray-400' />
            <span className='text-sm font-medium text-gray-900'>Paciente</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgency)}`}>
            {getUrgencyLabel(request.urgency)}
          </div>
        </div>

        {/* Síntomas */}
        <div>
          <h4 className='text-sm font-medium text-gray-900 mb-1'>Síntomas</h4>
          <p className='text-sm text-gray-600 line-clamp-2'>{request.symptoms}</p>
        </div>

        {/* Información de ubicación y tiempo */}
        <div className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <MapPin className='h-4 w-4 text-gray-400' />
            <span className='text-sm text-gray-600'>{request.patientLocation.address}</span>
          </div>
          <div className='flex items-center space-x-2'>
            <Clock className='h-4 w-4 text-gray-400' />
            <span className='text-sm text-gray-600'>
              Hace {Math.floor((Date.now() - new Date(request.createdAt).getTime()) / 60000)} min
            </span>
          </div>
        </div>

        {/* Botón de acción */}
        <div className='flex space-x-3 pt-2'>
          <button
            onClick={handleAccept}
            disabled={loading}
            className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
          >
            {loading ? (
              <LoadingSpinner size='sm' />
            ) : (
              <>
                <AlertCircle className='h-4 w-4 mr-2' />
                Aceptar STAT
              </>
            )}
          </button>
          <button className='bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center'>
            <Phone className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
};
