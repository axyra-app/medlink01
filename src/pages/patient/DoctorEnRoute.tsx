import { DoctorRouteMap } from '@/components/maps/DoctorRouteMap';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { DoctorLocation, ServiceRequest } from '@/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { Car, Clock, MapPin, Phone, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DoctorEnRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { } = useAuth();
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [doctorLocation, setDoctorLocation] = useState<DoctorLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [estimatedTime, setEstimatedTime] = useState<string>('');

  useEffect(() => {
    if (!id) {
      setError('ID de servicio no válido');
      setLoading(false);
      return;
    }

    // Suscribirse a cambios en tiempo real del servicio
    const serviceRef = doc(db, 'serviceRequests', id);
    const unsubscribeService = onSnapshot(
      serviceRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as ServiceRequest;
          setServiceRequest({ ...data, id: doc.id });

          // Redirección crítica: cuando el status cambia a 'in-progress'
          if (data.status === 'in-progress') {
            navigate(`/patient/request/${id}/in-progress`);
          }
        } else {
          setError('Servicio no encontrado');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error en suscripción del servicio:', error);
        setError('Error al cargar el servicio');
        setLoading(false);
      }
    );

    return () => unsubscribeService();
  }, [id, navigate]);

  useEffect(() => {
    if (!serviceRequest?.doctorId) return;

    // Suscribirse a la ubicación del doctor en tiempo real
    const doctorLocationRef = doc(db, 'doctorLocations', serviceRequest.doctorId);
    const unsubscribeLocation = onSnapshot(
      doctorLocationRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as DoctorLocation;
          setDoctorLocation(data);
        }
      },
      (error) => {
        console.error('Error en suscripción de ubicación:', error);
      }
    );

    return () => unsubscribeLocation();
  }, [serviceRequest?.doctorId]);

  // Simular cálculo de tiempo estimado
  useEffect(() => {
    if (serviceRequest && doctorLocation) {
      // En producción, esto sería un cálculo real basado en la distancia
      const estimatedMinutes = Math.floor(Math.random() * 15) + 5; // 5-20 minutos
      setEstimatedTime(`${estimatedMinutes} minutos`);
    }
  }, [serviceRequest, doctorLocation]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <LoadingSpinner size='lg' />
          <p className='mt-4 text-gray-600'>Cargando información del doctor...</p>
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
              <h1 className='text-xl font-semibold text-gray-900'>Doctor en Camino</h1>
              <p className='text-sm text-gray-600'>Tu doctor está llegando</p>
            </div>
            <div className='flex items-center space-x-2 text-green-600'>
              <Car className='h-5 w-5 animate-pulse' />
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 py-6 space-y-6'>
        {/* Estado del servicio */}
        <div className='card text-center'>
          <div className='mb-4'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3'>
              <Car className='h-8 w-8 text-green-600' />
            </div>
            <h2 className='text-lg font-semibold text-gray-900 mb-2'>Doctor en Camino</h2>
            <p className='text-sm text-gray-600'>
              El Dr. {serviceRequest.doctorId ? 'Nombre del Doctor' : 'Doctor'} está en ruta hacia tu ubicación
            </p>
          </div>

          {estimatedTime && (
            <div className='bg-green-50 rounded-lg p-3 mb-4'>
              <div className='flex items-center justify-center space-x-2'>
                <Clock className='h-4 w-4 text-green-600' />
                <span className='text-sm font-medium text-green-800'>Tiempo estimado: {estimatedTime}</span>
              </div>
            </div>
          )}
        </div>

        {/* Mapa con ruta */}
        <div className='card p-0 overflow-hidden'>
          <div className='h-80'>
            <DoctorRouteMap
              patientLocation={serviceRequest.patientLocation}
              doctorLocation={doctorLocation}
            />
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

            <div className='flex items-center space-x-3'>
              <MapPin className='h-4 w-4 text-gray-400' />
              <div>
                <p className='text-sm font-medium text-gray-900'>Ubicación actual</p>
                <p className='text-sm text-gray-600'>{doctorLocation ? 'En movimiento' : 'Obteniendo ubicación...'}</p>
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
                <p className='text-sm font-medium text-gray-900'>Síntomas</p>
                <p className='text-sm text-gray-600'>{serviceRequest.symptoms}</p>
              </div>
            </div>

            <div className='flex items-start space-x-3'>
              <div className='w-2 h-2 bg-yellow-600 rounded-full mt-2' />
              <div>
                <p className='text-sm font-medium text-gray-900'>Urgencia</p>
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
                <p className='text-sm font-medium text-gray-900'>Tu ubicación</p>
                <p className='text-sm text-gray-600'>{serviceRequest.patientLocation.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información de contacto */}
        <div className='card bg-blue-50 border-blue-200'>
          <h3 className='font-medium text-blue-900 mb-2'>📞 ¿Necesitas ayuda?</h3>
          <p className='text-sm text-blue-800 mb-3'>
            Si tienes alguna pregunta o necesitas contactar al doctor directamente.
          </p>
          <div className='flex space-x-3'>
            <button className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors'>
              <Phone className='h-4 w-4 inline mr-2' />
              Llamar Doctor
            </button>
            <button className='flex-1 bg-white text-blue-600 border border-blue-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors'>
              Mensaje
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className='card'>
          <h3 className='font-medium text-gray-900 mb-3'>💡 ¿Qué hacer mientras esperas?</h3>
          <div className='space-y-2 text-sm text-gray-600'>
            <p>• Mantén tu ubicación actualizada</p>
            <p>• Ten a mano tu documento de identidad</p>
            <p>• Prepara una lista de medicamentos que tomas</p>
            <p>• El doctor te llamará cuando esté cerca</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorEnRoute;
