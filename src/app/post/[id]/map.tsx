import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const Map = ({ center }: { center: { lat: number; lng: number } }) => {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    throw new Error("Google Maps API key is not set");
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
  });

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      zoom={14}
      center={center}
      mapContainerStyle={{ width: '100%', height: '400px' }}
    >
      <Marker position={center} />
    </GoogleMap>
  );
};

export default Map;
