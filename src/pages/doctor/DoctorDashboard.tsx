import { AvailableRequestsList } from '@/components/doctor/AvailableRequestsList';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Clock, MapPin, Power, Stethoscope } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard: React.FC = () => {
  const { firestoreUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOnline, setIsOnline] = useState(firestoreUser?.status === 'online');

  const handleToggleStatus = async () => {
    if (!firestoreUser) return;

    setLoading(true);
    setError('');

    try {
      const newStatus = isOnline ? 'offline' : 'online';

      // Actualizar estado en Firestore
      await updateDoc(doc(db, 'users', firestoreUser.uid), {
        status: newStatus,
      });

      setIsOnline(!isOnline);
    } catch (err: any) {
      setError(err.message || 'Error al cambiar estado');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceAccepted = (serviceId: string) => {
    // Redirección automática cuando se acepta un servicio
    navigate(`/doctor/service/${serviceId}`);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-semibold text-gray-900'>Hola, Dr. {firestoreUser?.profile?.name}</h1>
              <p className='text-sm text-gray-600'>{isOnline ? 'Disponible para atender' : 'Desconectado'}</p>
            </div>
            <div className='flex items-center space-x-2 text-blue-600'>
              <Stethoscope className='h-5 w-5' />
              <span className='text-sm font-medium'>Medlink</span>
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 py-6 space-y-6'>
        {/* Estado del doctor */}
        <div className='card'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-semibold text-gray-900'>Estado de Disponibilidad</h3>
            <div className={`flex items-center space-x-2 ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className='text-sm font-medium'>{isOnline ? 'En línea' : 'Desconectado'}</span>
            </div>
          </div>

          <button
            onClick={handleToggleStatus}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
              isOnline ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <LoadingSpinner size='sm' />
            ) : (
              <>
                <Power className='h-4 w-4 mr-2' />
                {isOnline ? 'Desconectarse' : 'Conectarse'}
              </>
            )}
          </button>

          {error && <Alert type='error' message={error} className='mt-4' />}
        </div>

        {/* Información rápida */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='card text-center'>
            <Clock className='h-8 w-8 text-blue-600 mx-auto mb-2' />
            <h3 className='font-medium text-gray-900'>Tiempo Promedio</h3>
            <p className='text-sm text-gray-600'>15-20 min</p>
          </div>
          <div className='card text-center'>
            <MapPin className='h-8 w-8 text-green-600 mx-auto mb-2' />
            <h3 className='font-medium text-gray-900'>Radio de Servicio</h3>
            <p className='text-sm text-gray-600'>5 km</p>
          </div>
        </div>

        {/* Lista de solicitudes disponibles */}
        {isOnline ? (
          <div className='card'>
            <h3 className='font-semibold text-gray-900 mb-4'>Solicitudes Disponibles</h3>
            <AvailableRequestsList doctorId={firestoreUser?.uid || ''} onServiceAccepted={handleServiceAccepted} />
          </div>
        ) : (
          <div className='card bg-gray-50 border-gray-200'>
            <div className='text-center py-8'>
              <Power className='h-12 w-12 text-gray-400 mx-auto mb-3' />
              <h3 className='font-medium text-gray-900 mb-2'>Conéctate para ver solicitudes</h3>
              <p className='text-sm text-gray-600'>Activa tu disponibilidad para recibir solicitudes de pacientes</p>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className='card bg-blue-50 border-blue-200'>
          <h3 className='font-medium text-blue-900 mb-2'>💡 Consejos para doctores</h3>
          <div className='space-y-2 text-sm text-blue-800'>
            <p>• Mantén tu ubicación actualizada</p>
            <p>• Responde rápidamente a las solicitudes</p>
            <p>• Comunica claramente con los pacientes</p>
            <p>• Actualiza tu estado cuando no estés disponible</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
