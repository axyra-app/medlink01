import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { ServiceRequest } from '@/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { CheckCircle, Clock, Phone, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ServiceInProgress: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { firestoreUser } = useAuth();
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('ID de servicio no válido');
      setLoading(false);
      return;
    }

    // Suscribirse a cambios en tiempo real del servicio
    const serviceRef = doc(db, 'serviceRequests', id);
    const unsubscribe = onSnapshot(
      serviceRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as ServiceRequest;
          setServiceRequest({ ...data, id: doc.id });

          // Redirección crítica: cuando el status cambia a 'completed'
          if (data.status === 'completed') {
            navigate(`/patient/review/${id}`);
          }
        } else {
          setError('Servicio no encontrado');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error en suscripción:', error);
        setError('Error al cargar el servicio');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <LoadingSpinner size='lg' />
          <p className='mt-4 text-gray-600'>Cargando servicio...</p>
        </div>
      </div>
    );
  }

  if (error || !serviceRequest) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
        <Alert type='error' message={error || 'Servicio no encontrado'} />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-semibold text-gray-900'>Consulta en Curso</h1>
              <p className='text-sm text-gray-600'>El doctor ha llegado</p>
            </div>
            <div className='flex items-center space-x-2 text-green-600'>
              <CheckCircle className='h-5 w-5' />
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 py-6 space-y-6'>
        {/* Estado del servicio */}
        <div className='card text-center'>
          <div className='mb-4'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3'>
              <CheckCircle className='h-8 w-8 text-green-600' />
            </div>
            <h2 className='text-lg font-semibold text-gray-900 mb-2'>Consulta en Curso</h2>
            <p className='text-sm text-gray-600'>El doctor ha llegado y está realizando la consulta médica</p>
          </div>

          <div className='bg-green-50 rounded-lg p-3 mb-4'>
            <div className='flex items-center justify-center space-x-2'>
              <Clock className='h-4 w-4 text-green-600' />
              <span className='text-sm font-medium text-green-800'>
                Consulta iniciada:{' '}
                {serviceRequest.startedAt
                  ? new Date(serviceRequest.startedAt).toLocaleTimeString('es-CO')
                  : 'Recién iniciada'}
              </span>
            </div>
          </div>
        </div>

        {/* Información del doctor */}
        <div className='card'>
          <h3 className='font-semibold text-gray-900 mb-4'>Información del Doctor</h3>
          <div className='flex items-center space-x-4 mb-4'>
            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
              <User className='h-6 w-6 text-blue-600' />
            </div>
            <div>
              <h4 className='font-medium text-gray-900'>Dr. Nombre del Doctor</h4>
              <p className='text-sm text-gray-600'>Medicina General</p>
              <p className='text-xs text-gray-500'>Licencia: 12345</p>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center space-x-3'>
              <Phone className='h-4 w-4 text-gray-400' />
              <div>
                <p className='text-sm font-medium text-gray-900'>Teléfono</p>
                <p className='text-sm text-gray-600'>+57 300 123 4567</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles del servicio */}
        <div className='card'>
          <h3 className='font-semibold text-gray-900 mb-4'>Detalles del Servicio</h3>
          <div className='space-y-3'>
            <div className='flex items-start space-x-3'>
              <div className='w-2 h-2 bg-blue-600 rounded-full mt-2' />
              <div>
                <p className='text-sm font-medium text-gray-900'>Síntomas reportados</p>
                <p className='text-sm text-gray-600'>{serviceRequest.symptoms}</p>
              </div>
            </div>

            <div className='flex items-start space-x-3'>
              <div className='w-2 h-2 bg-yellow-600 rounded-full mt-2' />
              <div>
                <p className='text-sm font-medium text-gray-900'>Nivel de urgencia</p>
                <p className='text-sm text-gray-600 capitalize'>
                  {serviceRequest.urgency === 'low' && 'Baja'}
                  {serviceRequest.urgency === 'medium' && 'Media'}
                  {serviceRequest.urgency === 'high' && 'Alta'}
                </p>
              </div>
            </div>

            <div className='flex items-start space-x-3'>
              <Clock className='h-4 w-4 text-gray-400 mt-1' />
              <div>
                <p className='text-sm font-medium text-gray-900'>Solicitado</p>
                <p className='text-sm text-gray-600'>{new Date(serviceRequest.createdAt).toLocaleString('es-CO')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información de contacto */}
        <div className='card bg-blue-50 border-blue-200'>
          <h3 className='font-medium text-blue-900 mb-2'>📞 ¿Necesitas ayuda?</h3>
          <p className='text-sm text-blue-800 mb-3'>
            Si tienes alguna pregunta durante la consulta, no dudes en contactarnos.
          </p>
          <div className='flex space-x-3'>
            <button className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors'>
              <Phone className='h-4 w-4 inline mr-2' />
              Llamar Soporte
            </button>
            <button className='flex-1 bg-white text-blue-600 border border-blue-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors'>
              Chat en Vivo
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className='card'>
          <h3 className='font-medium text-gray-900 mb-3'>💡 Durante la consulta</h3>
          <div className='space-y-2 text-sm text-gray-600'>
            <p>• El doctor realizará un examen físico</p>
            <p>• Puede hacer preguntas sobre tu historial médico</p>
            <p>• Te proporcionará un diagnóstico y tratamiento</p>
            <p>• Al finalizar, podrás calificar el servicio</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceInProgress;
