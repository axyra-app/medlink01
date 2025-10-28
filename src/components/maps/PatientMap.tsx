import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';

interface PatientMapProps {
  onLocationSelect?: (location: { latitude: number; longitude: number; address: string }) => void;
}

export const PatientMap: React.FC<PatientMapProps> = ({ onLocationSelect }) => {
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState({
    longitude: -74.0817, // Bogotá por defecto
    latitude: 4.6097,
    zoom: 13,
  });
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setViewState((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
          setLoading(false);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  const handleMapClick = (event: any) => {
    const { lngLat } = event;
    const location = {
      latitude: lngLat.lat,
      longitude: lngLat.lng,
      address: 'Ubicación seleccionada', // En producción, usar reverse geocoding
    };

    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  if (loading) {
    return (
      <div className='h-full flex items-center justify-center bg-gray-100'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2' />
          <p className='text-sm text-gray-600'>Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full w-full'>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle='mapbox://styles/mapbox/streets-v12'
        mapboxAccessToken="pk.eyJ1IjoibWVkbGluazAxIiwiYSI6ImNtaGFxeXp3OTB6eHEya3B2enh6c3ljaGIifQ.fNLLY7BuMPp-gsTevR1JoQ"
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        {/* Marcador de ubicación del usuario */}
        {userLocation && (
          <Marker longitude={userLocation.longitude} latitude={userLocation.latitude} anchor='center'>
            <div className='w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center'>
              <div className='w-2 h-2 bg-white rounded-full' />
            </div>
          </Marker>
        )}

        {/* Controles de navegación */}
        <NavigationControl position='top-right' />
      </Map>
    </div>
  );
};
