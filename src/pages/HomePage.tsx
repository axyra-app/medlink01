import { useAuth } from '@/hooks/useAuth';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Stethoscope, User, Heart, MapPin, Clock, Star } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { firestoreUser, loading } = useAuth();

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  if (!firestoreUser) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
        <Alert type='error' message='No se pudo cargar la información del usuario' />
      </div>
    );
  }

  const isDoctor = firestoreUser.role === 'doctor';
  const userName = firestoreUser.profile?.name || 'Usuario';

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-semibold text-gray-900'>
                ¡Bienvenido, {isDoctor ? 'Dr.' : ''} {userName}!
              </h1>
              <p className='text-sm text-gray-600'>
                {isDoctor ? 'Tu panel de control médico' : 'Tu centro de atención médica'}
              </p>
            </div>
            <div className='flex items-center space-x-2 text-blue-600'>
              <Stethoscope className='h-5 w-5' />
              <span className='text-sm font-medium'>Medlink</span>
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 py-6 space-y-6'>
        {/* Estadísticas rápidas */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='card text-center'>
            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
              <Heart className='h-6 w-6 text-blue-600' />
            </div>
            <h3 className='font-semibold text-gray-900'>
              {isDoctor ? 'Pacientes Atendidos' : 'Consultas Realizadas'}
            </h3>
            <p className='text-2xl font-bold text-blue-600'>0</p>
          </div>

          <div className='card text-center'>
            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3'>
              <Star className='h-6 w-6 text-green-600' />
            </div>
            <h3 className='font-semibold text-gray-900'>
              {isDoctor ? 'Calificación Promedio' : 'Calificación Recibida'}
            </h3>
            <p className='text-2xl font-bold text-green-600'>-</p>
          </div>
        </div>

        {/* Acciones principales */}
        <div className='card'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            {isDoctor ? 'Acciones Disponibles' : '¿Necesitas atención médica?'}
          </h2>
          
          {isDoctor ? (
            <div className='space-y-3'>
              <Link
                to='/doctor/dashboard'
                className='btn-primary w-full flex items-center justify-center'
              >
                <Stethoscope className='h-4 w-4 mr-2' />
                Ir al Dashboard
              </Link>
              <Link
                to='/doctor/dashboard'
                className='btn-secondary w-full flex items-center justify-center'
              >
                <MapPin className='h-4 w-4 mr-2' />
                Ver Solicitudes Disponibles
              </Link>
            </div>
          ) : (
            <div className='space-y-3'>
              <Link
                to='/patient/home'
                className='btn-primary w-full flex items-center justify-center'
              >
                <Heart className='h-4 w-4 mr-2' />
                Solicitar Consulta Médica
              </Link>
              <Link
                to='/patient/home'
                className='btn-secondary w-full flex items-center justify-center'
              >
                <Clock className='h-4 w-4 mr-2' />
                Ver Consultas Anteriores
              </Link>
            </div>
          )}
        </div>

        {/* Información del perfil */}
        <div className='card'>
          <h3 className='font-semibold text-gray-900 mb-4'>Información del Perfil</h3>
          <div className='space-y-3'>
            <div className='flex items-center space-x-3'>
              <User className='h-4 w-4 text-gray-400' />
              <div>
                <p className='text-sm font-medium text-gray-900'>Nombre</p>
                <p className='text-sm text-gray-600'>{userName}</p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <Stethoscope className='h-4 w-4 text-gray-400' />
              <div>
                <p className='text-sm font-medium text-gray-900'>Tipo de Cuenta</p>
                <p className='text-sm text-gray-600'>
                  {isDoctor ? 'Doctor' : 'Paciente'}
                </p>
              </div>
            </div>
            {firestoreUser.profile?.phone && (
              <div className='flex items-center space-x-3'>
                <MapPin className='h-4 w-4 text-gray-400' />
                <div>
                  <p className='text-sm font-medium text-gray-900'>Teléfono</p>
                  <p className='text-sm text-gray-600'>{firestoreUser.profile.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className='card bg-blue-50 border-blue-200'>
          <h3 className='font-medium text-blue-900 mb-2'>
            {isDoctor ? '💡 Consejo para Doctores' : '💡 Consejo para Pacientes'}
          </h3>
          <p className='text-sm text-blue-800'>
            {isDoctor 
              ? 'Mantén tu estado online para recibir solicitudes de pacientes en tu área.'
              : 'Describe tus síntomas de manera clara para recibir la mejor atención médica.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
