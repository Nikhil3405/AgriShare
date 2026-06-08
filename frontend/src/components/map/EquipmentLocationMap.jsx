import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_LIBRARIES } from "../../config/googleMaps";
import { MapPin, Navigation, ExternalLink, Map as MapIcon, Info, Copy } from "lucide-react";
import { useState } from "react";

const EquipmentLocationMap = ({ equipment }) => {
  const [copied, setCopied] = useState(false);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const handleCopyCoords = () => {
    const coords = `${equipment.latitude}, ${equipment.longitude}`;
    navigator.clipboard.writeText(coords);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!equipment?.latitude || !equipment?.longitude) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
        <MapPin className="mx-auto h-12 w-12 text-slate-300 mb-3" />
        <h3 className="text-slate-900 font-bold">Location not available</h3>
        <p className="text-slate-500 text-sm mt-1">The owner has not provided precise coordinates for this equipment.</p>
      </div>
    );
  }

  // Map Skeleton Loader
  if (!isLoaded) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-[400px] w-full bg-slate-200 rounded-3xl" />
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-slate-200 rounded-xl" />
          <div className="h-10 w-32 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  const center = {
    lat: Number(equipment.latitude),
    lng: Number(equipment.longitude),
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="relative group">
        <div className="h-[300px] rounded-3xl border border-slate-200 shadow-card bg-slate-100">
          <GoogleMap
            center={center}
            zoom={15}
            options={mapOptions}
            mapContainerStyle={{
              width: "100%",
              height: "100%",
            }}
          >
            <Marker 
              position={center}
              animation={window.google.maps.Animation.DROP}
            />
          </GoogleMap>
        </div>

        {/* Floating Info Overlay */}
        <div className="absolute top-4 left-4 right-4 md:right-auto md:w-72 bg-white/90 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-lg pointer-events-none md:pointer-events-auto">
          <div className="flex items-start gap-3">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <Info size={16} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Area Info</p>
              <p className="text-xs text-slate-700 leading-tight">
                This location is within <span className="font-bold text-slate-900">{equipment.location || 'the village'}</span>. 
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Action Bar */}
      <div className="flex flex-wrap gap-3">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${equipment.latitude},${equipment.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 active:scale-95"
        >
          <Navigation size={18} />
          Get Directions
        </a>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${equipment.latitude},${equipment.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <MapIcon size={18} className="text-primary" />
          Full Screen Map
        </a>

        <button
          onClick={handleCopyCoords}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 ml-auto"
        >
          {copied ? (
            <span className="text-emerald-600 flex items-center gap-2 animate-in fade-in zoom-in-95">
              <ExternalLink size={18} />
              Copied!
            </span>
          ) : (
            <>
              <Copy size={18} className="text-slate-400" />
              Copy Coords
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EquipmentLocationMap;