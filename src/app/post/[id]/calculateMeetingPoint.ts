const getCoordinates = async (station: string): Promise<{ lat: number; lng: number } | null> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      station
    )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  );

  const data = await response.json();
  if (data.results && data.results[0]) {
    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  }

  return null;
};

const calculateMidpoint = (coordinates: { lat: number; lng: number }[]) => {
  const totalLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0);
  const totalLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0);

  return {
    lat: totalLat / coordinates.length,
    lng: totalLng / coordinates.length,
  };
};

const calculateMeetingPoint = async (stations: string[]) => {
  const coordinates = await Promise.all(
    stations.map((station) => getCoordinates(station))
  );

  const validCoordinates = coordinates.filter((coord) => coord !== null) as {
    lat: number;
    lng: number;
  }[];

  return calculateMidpoint(validCoordinates);
};

export default calculateMeetingPoint;
