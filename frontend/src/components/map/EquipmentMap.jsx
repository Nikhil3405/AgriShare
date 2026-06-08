import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

const EquipmentMap = ({ equipment }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      center={{
        lat: equipment.latitude,
        lng: equipment.longitude,
      }}
      zoom={15}
      mapContainerStyle={{
        width: "100%",
        height: "400px",
      }}
    >
      <Marker
        position={{
          lat: equipment.latitude,
          lng: equipment.longitude,
        }}
      />
    </GoogleMap>
  );
};

export default EquipmentMap;