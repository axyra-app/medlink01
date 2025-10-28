import { useAuth } from '@/hooks/useAuth';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Brain, Calendar, MessageCircle, Users, Clock, Star, Heart } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const PsychologistDashboard: React.FC = () => {
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

  const userName = firestoreUser.profile?.name || 'Psicólogo';

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-semibold text-gray-900'>
                ¡Bienvenido, {userName}!
              </h1>
              <p className='text-sm text-gray-600'>Tu centro de atención psicológica</p>
            </div>
            <div className='flex items-center space-x-2 text-purple-600'>
              <Brain className='h-5 w-5' />
              <span className='text-sm font-medium'>Medlink Psicología</span>
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 py-6 space-y-6'>
        {/* Estadísticas especializadas */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='card text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'>
            <div className='w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3'>
              <Users className='h-6 w-6 text-white' />
            </div>
            <h3 className='font-semibold text-gray-900'>Pacientes Activos</h3>
            <p className='text-2xl font-bold text-purple-600'>0</p>
            <p className='text-xs text-gray-500 mt-1'>En tratamiento</p>
          </div>

          <div className='card text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'>
            <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3'>
              <Calendar className='h-6 w-6 text-white' />
            </div>
            <h3 className='font-semibold text-gray-900'>Sesiones Hoy</h3>
            <p className='text-2xl font-bold text-blue-600'>0</p>
            <p className='text-xs text-gray-500 mt-1'>Programadas</p>
          </div>
        </div>

        {/* Acciones principales */}
        <div className='card'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Panel de Control Psicológico
          </h2>
          
          <div className='space-y-3'>
            <Link
              to='/doctor/dashboard'
              className='btn-primary w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700'
            >
              <Brain className='h-4 w-4 mr-2' />
              Ver Solicitudes de Consulta
            </Link>
            <Link
              to='/doctor/dashboard'
              className='btn-secondary w-full flex items-center justify-center'
            >
              <Calendar className='h-4 w-4 mr-2' />
              Gestionar Agenda
            </Link>
            <Link
              to='/doctor/dashboard'
              className='btn-secondary w-full flex items-center justify-center'
            >
              <MessageCircle className='h-4 w-4 mr-2' />
              Chat con Pacientes
            </Link>
          </div>
        </div>

        {/* Información del perfil */}
        <div className='card'>
          <h3 className='font-semibold text-gray-900 mb-4'>Información Profesional</h3>
          <div className='space-y-3'>
            <div className='flex items-center space-x-3'>
              <Brain className='h-4 w-4 text-purple-400' />
              <div>
                <p className='text-sm font-medium text-gray-900'>Especialidad</p>
                <p className='text-sm text-gray-600'>Psicología Clínica</p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <Users className='h-4 w-4 text-purple-400' />
              <div>
                <p className='text-sm font-medium text-gray-900'>Tipo de Cuenta</p>
                <p className='text-sm text-gray-600'>Psicólogo</p>
              </div>
            </div>
            {firestoreUser.profile?.phone && (
              <div className='flex items-center space-x-3'>
                <MessageCircle className='h-4 w-4 text-purple-400' />
                <div>
                  <p className='text-sm font-medium text-gray-900'>Teléfono</p>
                  <p className='text-sm text-gray-600'>{firestoreUser.profile.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Herramientas especializadas */}
        <div className='card bg-purple-50 border-purple-200'>
          <h3 className='font-medium text-purple-900 mb-3'>
            🧠 Herramientas Psicológicas
          </h3>
          <div className='space-y-2'>
            <div className='flex items-center space-x-2 text-sm text-purple-800'>
              <Heart className='h-4 w-4' />
              <span>Evaluaciones psicológicas</span>
            </div>
            <div className='flex items-center space-x-2 text-sm text-purple-800'>
              <Clock className='h-4 w-4' />
              <span>Seguimiento de progreso</span>
            </div>
            <div className='flex items-center space-x-2 text-sm text-purple-800'>
              <Star className='h-4 w-4' />
              <span>Reportes de sesiones</span>
            </div>
          </div>
        </div>

        {/* Consejos especializados */}
        <div className='card bg-blue-50 border-blue-200'>
          <h3 className='font-medium text-blue-900 mb-2'>
            💡 Consejos para Psicólogos
          </h3>
          <p className='text-sm text-blue-800'>
            Mantén un ambiente de confianza y empatía. La comunicación clara y el seguimiento regular son clave para el éxito terapéutico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PsychologistDashboard;
