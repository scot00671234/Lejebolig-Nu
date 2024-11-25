import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

const containerStyle = {
  width: '100%',
  height: '400px'
};

const PropertyMap: React.FC<PropertyMapProps> = ({ latitude, longitude, address }) => {
  const center = {
    lat: latitude,
    lng: longitude
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        <Marker
          position={center}
          title={address}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default PropertyMap;
