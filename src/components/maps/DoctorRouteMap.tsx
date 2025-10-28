import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl';

interface DoctorRouteMapProps {
  patientLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  doctorLocation: {
    doctorId: string;
    latitude: number;
    longitude: number;
    timestamp: Date;
  } | null;
}

export const DoctorRouteMap: React.FC<DoctorRouteMapProps> = ({ patientLocation, doctorLocation }) => {
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState({
    longitude: patientLocation.longitude,
    latitude: patientLocation.latitude,
    zoom: 13,
  });
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener la ruta desde Mapbox
  const fetchMapboxRoute = async (start: [number, number], end: [number, number]) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${
          end[1]
        }?geometries=geojson&access_token=pk.eyJ1IjoibWVkbGluazAxIiwiYSI6ImNtaGFxeXp3OTB6eHEya3B2enh6c3ljaGIifQ.fNLLY7BuMPp-gsTevR1JoQ`
      );

      if (!response.ok) {
        throw new Error('Error al obtener la ruta');
      }

      const data = await response.json();
      return data.routes[0]?.geometry;
    } catch (error) {
      console.error('Error obteniendo ruta:', error);
      return null;
    }
  };

  // Actualizar la ruta cuando cambie la ubicación del doctor
  useEffect(() => {
    if (doctorLocation) {
      const start: [number, number] = [doctorLocation.longitude, doctorLocation.latitude];
      const end: [number, number] = [patientLocation.longitude, patientLocation.latitude];

      fetchMapboxRoute(start, end).then((geometry) => {
        if (geometry) {
          setRoute({
            type: 'Feature',
            properties: {},
            geometry: geometry,
          });
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [doctorLocation, patientLocation]);

  // Centrar el mapa entre el doctor y el paciente
  useEffect(() => {
    if (doctorLocation) {
      const centerLng = (doctorLocation.longitude + patientLocation.longitude) / 2;
      const centerLat = (doctorLocation.latitude + patientLocation.latitude) / 2;

      setViewState((prev) => ({
        ...prev,
        longitude: centerLng,
        latitude: centerLat,
        zoom: 12,
      }));
    }
  }, [doctorLocation, patientLocation]);

  if (loading) {
    return (
      <div className='h-full flex items-center justify-center bg-gray-100'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2' />
          <p className='text-sm text-gray-600'>Calculando ruta...</p>
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

        {/* Ruta del doctor */}
        {route && (
          <Source id='route' type='geojson' data={route}>
            <Layer
              id='route-line'
              type='line'
              paint={{
                'line-color': '#3b82f6',
                'line-width': 4,
                'line-opacity': 0.8,
              }}
            />
          </Source>
        )}

        {/* Controles de navegación */}
        <NavigationControl position='top-right' />
      </Map>
    </div>
  );
};
