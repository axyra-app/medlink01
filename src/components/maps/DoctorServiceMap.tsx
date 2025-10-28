import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';

interface DoctorServiceMapProps {
  patientLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  serviceId: string;
}

export const DoctorServiceMap: React.FC<DoctorServiceMapProps> = ({ patientLocation, serviceId }) => {
  const [viewState, setViewState] = useState({
    longitude: patientLocation.longitude,
    latitude: patientLocation.latitude,
    zoom: 15,
  });
  const [doctorLocation, setDoctorLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    // Obtener ubicación actual del doctor
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDoctorLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error obteniendo ubicación del doctor:', error);
        }
      );
    }
  }, []);

  return (
    <div className='h-full w-full'>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle='mapbox://styles/mapbox/streets-v12'
        mapboxAccessToken="pk.eyJ1IjoibWVkbGluazAxIiwiYSI6ImNtaGFxeXp3OTB6eHEya3B2enh6c3ljaGIifQ.fNLLY7BuMPp-gsTevR1JoQ"
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        {/* Marcador del paciente */}
        <Marker longitude={patientLocation.longitude} latitude={patientLocation.latitude} anchor='center'>
          <div className='w-8 h-8 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center'>
            <div className='w-3 h-3 bg-white rounded-full' />
          </div>
        </Marker>

        {/* Marcador del doctor */}
        {doctorLocation && (
          <Marker longitude={doctorLocation.longitude} latitude={doctorLocation.latitude} anchor='center'>
            <div className='w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center'>
              <div className='w-3 h-3 bg-white rounded-full' />
            </div>
          </Marker>
        )}

        {/* Controles de navegación */}
        <NavigationControl position='top-right' />
      </Map>
    </div>
  );
};
