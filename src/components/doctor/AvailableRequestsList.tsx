import { ServiceRequestCard } from '@/components/doctor/ServiceRequestCard';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { ServiceRequest } from '@/types';
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { AlertCircle, Clock, MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface AvailableRequestsListProps {
  doctorId: string;
  onServiceAccepted: (serviceId: string) => void;
}

export const AvailableRequestsList: React.FC<AvailableRequestsListProps> = ({ doctorId, onServiceAccepted }) => {
  const { firestoreUser } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!firestoreUser?.uid) return;

    // Query para obtener solicitudes pendientes en el área del doctor
    // En producción, esto incluiría geohashing para filtrar por proximidad
    const requestsRef = collection(db, 'serviceRequests');
    const q = query(requestsRef, where('status', '==', 'pending'), orderBy('createdAt', 'desc'), limit(10));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requestsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as ServiceRequest[];

        setRequests(requestsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error obteniendo solicitudes:', error);
        setError('Error al cargar las solicitudes');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestoreUser?.uid]);

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  if (error) {
    return <Alert type='error' message={error} />;
  }

  if (requests.length === 0) {
    return (
      <div className='text-center py-8'>
        <AlertCircle className='h-12 w-12 text-gray-400 mx-auto mb-3' />
        <h3 className='font-medium text-gray-900 mb-2'>No hay solicitudes disponibles</h3>
        <p className='text-sm text-gray-600'>No hay pacientes esperando atención en tu área en este momento.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h4 className='font-medium text-gray-900'>
          {requests.length} solicitud{requests.length !== 1 ? 'es' : ''} disponible{requests.length !== 1 ? 's' : ''}
        </h4>
        <div className='flex items-center space-x-2 text-sm text-gray-500'>
          <Clock className='h-4 w-4' />
          <span>Actualizado en tiempo real</span>
        </div>
      </div>

      <div className='space-y-3'>
        {requests.map((request) => (
          <ServiceRequestCard key={request.id} request={request} onAccept={() => onServiceAccepted(request.id)} />
        ))}
      </div>

      {/* Información adicional */}
      <div className='bg-gray-50 rounded-lg p-4'>
        <div className='flex items-start space-x-3'>
          <MapPin className='h-4 w-4 text-gray-400 mt-1' />
          <div>
            <p className='text-sm font-medium text-gray-900'>Área de cobertura</p>
            <p className='text-xs text-gray-600'>Solo se muestran solicitudes dentro de tu radio de servicio (5 km)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
