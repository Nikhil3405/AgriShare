import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GOOGLE_MAPS_LIBRARIES } from "../config/googleMaps";
import { 
  Tractor, 
  Info, 
  IndianRupee, 
  MapPin, 
  Navigation, 
  Calendar, 
  Wrench, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  ChevronLeft,
  Search
} from "lucide-react";

import equipmentService from "../services/equipmentService";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";

const EQUIPMENT_TYPES = [
  { id: 'tractor', label: 'Tractor' },
  { id: 'harvester', label: 'Harvester' },
  { id: 'rotavator', label: 'Rotavator' },
  { id: 'cultivator', label: 'Cultivator' },
  { id: 'plough', label: 'Plough' },
  { id: 'seeder', label: 'Seeder' },
  { id: 'sprayer', label: 'Sprayer' },
  { id: 'thresher', label: 'Thresher' },
  { id: 'trailer', label: 'Trailer' },
  { id: 'water_tanker', label: 'Water Tanker' },
  { id: 'power_tiller', label: 'Power Tiller' },
  { id: 'baler', label: 'Baler' },
  { id: 'transplanter', label: 'Rice Transplanter' },
  { id: 'other', label: 'Other' },
];

const EquipmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const { user } = useAuth();
  
  const [form, setForm] = useState({
    name: "",
    equipment_type: "tractor",
    description: "",
    hourly_rate: "",
    location: "",
    latitude: null,
    longitude: null,
    condition: "good",
    last_service_date: "",
    is_available: true,
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const fetchEquipment = async () => {
      try {
        const data = await equipmentService.getById(id);
        if (data.owner_id !== user.id) {
          setError("You do not have permission to edit this listing.");
          setTimeout(() => navigate("/dashboard"), 2000);
          return;
        }
        setForm({
          ...data,
          last_service_date: data.last_service_date ? data.last_service_date.split('T')[0] : "",
        });
        setSearchText(data.location || "");
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchEquipment();
  }, [id, isEdit, user.id, navigate]);

  const autocompleteRef = useRef(null);
  
  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setForm((prev) => ({
      ...prev,
      location: place.formatted_address,
      latitude: lat,
      longitude: lng,
    }));
    setSearchText(place.formatted_address);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
              const address = results[0].formatted_address;
              setForm((prev) => ({ ...prev, latitude: lat, longitude: lng, location: address }));
              setSearchText(address);
            }
          });
        } catch (err) { console.error(err); }
      },
      () => setError("Unable to retrieve location.")
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.latitude === null || form.longitude === null) {
      setError("Please pin the exact location on the map.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });

      if (isEdit) {
        await equipmentService.updateEquipment(id, formData);
        navigate(`/equipment/${id}/photos`);
      } else {
        const data = await equipmentService.createEquipment(formData);
        navigate(`/equipment/${data.id}/photos`);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save equipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
        <p className="text-slate-500 font-bold">Loading listing data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 page-fade-in">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-primary mb-2 transition-colors"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEdit ? "Edit Your Listing" : "List New Equipment"}
          </h1>
          <p className="text-slate-500 mt-1">Provide details about your machinery for potential renters.</p>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3 animate-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-bold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1: BASIC INFO */}
        <div className="bg-white rounded-3xl p-8 shadow-card border border-slate-100">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="bg-primary/10 p-2 rounded-xl text-primary"><Tractor size={20} /></div>
            <h2 className="text-xl font-bold text-slate-900">General Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Equipment Name</label>
              <input
                name="name"
                placeholder="e.g. John Deere 5050D Tractor"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Category</label>
              <div className="relative group">
                <select
                  name="equipment_type"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium appearance-none"
                  value={form.equipment_type}
                  onChange={handleChange}
                >
                  {EQUIPMENT_TYPES.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><Info size={18} /></div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Tell renters about the equipment, performance, and any attachments included..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: PRICING & SPECS */}
        <div className="bg-white rounded-3xl p-8 shadow-card border border-slate-100">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="bg-amber-50 p-2 rounded-xl text-amber-600"><IndianRupee size={20} /></div>
            <h2 className="text-xl font-bold text-slate-900">Pricing & Condition</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Hourly Rate (₹)</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"><IndianRupee size={18} /></div>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  name="hourly_rate"
                  placeholder="0.00"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold"
                  value={form.hourly_rate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Current Condition</label>
              <div className="relative">
                <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  name="condition"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold appearance-none capitalize"
                  value={form.condition}
                  onChange={handleChange}
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Last Service Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  name="last_service_date"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold"
                  value={form.last_service_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-4 cursor-pointer group bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full hover:bg-emerald-50 transition-colors">
                <input
                  type="checkbox"
                  className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-slate-300"
                  checked={form.is_available}
                  onChange={(e) => setForm((prev) => ({ ...prev, is_available: e.target.checked }))}
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">Available for Booking</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Show listing in search</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 3: LOCATION */}
        <div className="bg-white rounded-3xl p-8 shadow-card border border-slate-100">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-50 pb-4">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><MapPin size={20} /></div>
            <h2 className="text-xl font-bold text-slate-900">Precise Location</h2>
          </div>
          
          <p className="text-sm text-slate-500 mb-6">Pinned location ensures farmers can find equipment near them.</p>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                {isLoaded ? (
                  <Autocomplete onLoad={(a) => (autocompleteRef.current = a)} onPlaceChanged={onPlaceChanged}>
                    <input
                      type="text"
                      placeholder="Search village, city, farm..."
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </Autocomplete>
                ) : (
                  <div className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 animate-pulse">Loading maps...</div>
                )}
              </div>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-2xl font-bold transition-all whitespace-nowrap active:scale-95"
                disabled={!isLoaded}
              >
                <Navigation size={18} /> Use My Current Location
              </button>
            </div>

            <div className="h-80 rounded-3xl overflow-hidden border-2 border-slate-100 shadow-inner relative">
              {isLoaded && (
                <GoogleMap
                  center={{ lat: form.latitude ?? 20.5937, lng: form.longitude ?? 78.9629 }}
                  zoom={form.latitude !== null ? 16 : 5}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  onClick={(e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode({ location: { lat, lng } }, (res, status) => {
                      if (status === "OK" && res[0]) {
                        setForm(prev => ({ ...prev, location: res[0].formatted_address }));
                        setSearchText(res[0].formatted_address);
                      }
                    });
                  }}
                  options={{ streetViewControl: false, mapTypeControl: false, zoomControl: true }}
                >
                  {form.latitude && form.longitude && (
                    <Marker 
                      draggable={true} 
                      position={{ lat: form.latitude, lng: form.longitude }} 
                      onDragEnd={(e) => {
                        const lat = e.latLng.lat();
                        const lng = e.latLng.lng();
                        const geocoder = new window.google.maps.Geocoder();
                        geocoder.geocode({ location: { lat, lng } }, (res, status) => {
                          const addr = (status === "OK" && res[0]) ? res[0].formatted_address : "";
                          setForm(prev => ({ ...prev, latitude: lat, longitude: lng, location: addr }));
                          setSearchText(addr);
                        });
                      }}
                    />
                  )}
                </GoogleMap>
              )}
            </div>

            {form.latitude && (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
                <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                <div>
                  <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">Location Confirmed</p>
                  <p className="text-sm text-emerald-700 leading-tight mt-0.5">{form.location}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-grow bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                {isEdit ? "Update Details & Continue" : "Create Listing & Add Photos"}
                <ArrowRight size={20} />
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-10 py-4 bg-white text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all border border-slate-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EquipmentForm;