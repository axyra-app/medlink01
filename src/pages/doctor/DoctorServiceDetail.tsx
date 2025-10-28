import { DoctorServiceMap } from '@/components/maps/DoctorServiceMap';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { ServiceRequest } from '@/types';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { CheckCircle, Clock, MapPin, Phone, Play, Square } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DoctorServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { firestoreUser } = useAuth();
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
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

          // Verificar que el doctor actual es el asignado
          if (data.doctorId !== firestoreUser?.uid) {
            setError('No tienes acceso a este servicio');
            setLoading(false);
            return;
          }

          // Redirección cuando el servicio se completa
          if (data.status === 'completed') {
            navigate('/doctor/dashboard');
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
  }, [id, navigate, firestoreUser?.uid]);

  const handleStartConsultation = async () => {
    if (!serviceRequest) return;

    setActionLoading(true);
    setError('');

    try {
      await updateDoc(doc(db, 'serviceRequests', serviceRequest.id), {
        status: 'in-progress',
        startedAt: new Date(),
      });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar consulta');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteConsultation = async () => {
    if (!serviceRequest) return;

    setActionLoading(true);
    setError('');

    try {
      await updateDoc(doc(db, 'serviceRequests', serviceRequest.id), {
        status: 'completed',
        completedAt: new Date(),
      });
    } catch (err: any) {
      setError(err.message || 'Error al completar consulta');
    } finally {
      setActionLoading(false);
    }
  };

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

  const canStartConsultation = serviceRequest.status === 'in-service';
  const canCompleteConsultation = serviceRequest.status === 'in-progress';

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-semibold text-gray-900'>Servicio Médico</h1>
              <p className='text-sm text-gray-600'>
                {serviceRequest.status === 'in-service' && 'En camino al paciente'}
                {serviceRequest.status === 'in-progress' && 'Consulta en curso'}
                {serviceRequest.status === 'completed' && 'Servicio completado'}
              </p>
            </div>
            <div className='flex items-center space-x-2 text-blue-600'>
              <CheckCircle className='h-5 w-5' />
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 py-6 space-y-6'>
        {/* Estado del servicio */}
        <div className='card text-center'>
          <div className='mb-4'>
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                serviceRequest.status === 'in-service'
                  ? 'bg-blue-100'
                  : serviceRequest.status === 'in-progress'
                  ? 'bg-green-100'
                  : 'bg-gray-100'
              }`}
            >
              {serviceRequest.status === 'in-service' && <MapPin className='h-8 w-8 text-blue-600' />}
              {serviceRequest.status === 'in-progress' && <Play className='h-8 w-8 text-green-600' />}
              {serviceRequest.status === 'completed' && <CheckCircle className='h-8 w-8 text-gray-600' />}
            </div>
            <h2 className='text-lg font-semibold text-gray-900 mb-2'>
              {serviceRequest.status === 'in-service' && 'En Camino'}
              {serviceRequest.status === 'in-progress' && 'Consulta en Curso'}
              {serviceRequest.status === 'completed' && 'Completado'}
            </h2>
            <p className='text-sm text-gray-600'>
              {serviceRequest.status === 'in-service' && 'Dirígete a la ubicación del paciente'}
              {serviceRequest.status === 'in-progress' && 'Realizando la consulta médica'}
              {serviceRequest.status === 'completed' && 'Servicio finalizado exitosamente'}
            </p>
          </div>
        </div>

        {/* Mapa con ubicación del paciente */}
        <div className='card p-0 overflow-hidden'>
          <div className='h-64'>
            <DoctorServiceMap patientLocation={serviceRequest.patientLocation} />
          </div>
        </div>

        {/* Información del paciente */}
        <div className='card'>
          <h3 className='font-semibold text-gray-900 mb-4'>Información del Paciente</h3>
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
              <MapPin className='h-4 w-4 text-gray-400 mt-1' />
              <div>
                <p className='text-sm font-medium text-gray-900'>Ubicación</p>
                <p className='text-sm text-gray-600'>{serviceRequest.patientLocation.address}</p>
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

        {/* Botones de acción */}
        {canStartConsultation && (
          <div className='card'>
            <h3 className='font-semibold text-gray-900 mb-4'>Acciones Disponibles</h3>
            {error && <Alert type='error' message={error} className='mb-4' />}

            <button
              onClick={handleStartConsultation}
              disabled={actionLoading}
              className='btn-primary w-full flex items-center justify-center'
            >
              {actionLoading ? (
                <LoadingSpinner size='sm' />
              ) : (
                <>
                  <Play className='h-4 w-4 mr-2' />
                  Iniciar Consulta
                </>
              )}
            </button>
          </div>
        )}

        {canCompleteConsultation && (
          <div className='card'>
            <h3 className='font-semibold text-gray-900 mb-4'>Finalizar Servicio</h3>
            {error && <Alert type='error' message={error} className='mb-4' />}

            <button
              onClick={handleCompleteConsultation}
              disabled={actionLoading}
              className='btn-primary w-full flex items-center justify-center bg-green-600 hover:bg-green-700'
            >
              {actionLoading ? (
                <LoadingSpinner size='sm' />
              ) : (
                <>
                  <Square className='h-4 w-4 mr-2' />
                  Finalizar Consulta
                </>
              )}
            </button>
          </div>
        )}

        {/* Información de contacto */}
        <div className='card bg-blue-50 border-blue-200'>
          <h3 className='font-medium text-blue-900 mb-2'>📞 Contacto</h3>
          <p className='text-sm text-blue-800 mb-3'>Mantén comunicación con el paciente durante el servicio.</p>
          <div className='flex space-x-3'>
            <button className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors'>
              <Phone className='h-4 w-4 inline mr-2' />
              Llamar Paciente
            </button>
            <button className='flex-1 bg-white text-blue-600 border border-blue-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors'>
              Mensaje
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorServiceDetail;
