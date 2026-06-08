import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Phone, 
  User, 
  Wrench, 
  Clock,
  Info,
  Calendar,
  ChevronRight
} from "lucide-react";

import equipmentService from "../services/equipmentService";
import BookingForm from "../components/booking/BookingForm";
import EquipmentLocationMap from "../components/map/EquipmentLocationMap";
import { useAuth } from "../context/AuthContext";
import EquipmentReviews from "../components/reviews/EquipmentReviews";
import EquipmentGallery from "../components/equipment/EquipmentGallery";

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await equipmentService.getById(id);
        console.log("Fetched equipment details:", data);
        setEquipment(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading equipment details...</p>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-slate-50 rounded-3xl p-12 border-2 border-dashed border-slate-200">
          <Info className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900">Equipment not found</h2>
          <p className="text-slate-500 mt-2 mb-6">The listing you are looking for might have been removed or is no longer available.</p>
          <button onClick={() => navigate('/equipment')} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold transition-all">
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === equipment?.owner_id;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 page-fade-in">
      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-30 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to results
          </button>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Marketplace</span>
            <ChevronRight size={14} />
            <span className="text-slate-900">{equipment.equipment_type}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* LEFT COLUMN: Images & Info */}
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery Wrapper */}
            <div className="rounded-3xl overflow-hidden shadow-card border border-white">
              <EquipmentGallery equipment={equipment} />
            </div>

            {/* Header Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {equipment.equipment_type || 'Machinery'}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                    {equipment.name}
                  </h1>
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={18} className="text-primary" />
                    <span className="text-lg">{equipment.location || "Location not specified"}</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Key Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-primary mb-2"><Wrench size={20} /></div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Condition</p>
                <p className="text-sm font-bold text-slate-900 capitalize">{equipment.condition}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-primary mb-2"><Clock size={20} /></div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pricing</p>
                <p className="text-sm font-bold text-slate-900">Hourly Basis</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-primary mb-2"><ShieldCheck size={20} /></div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Verified</p>
                <p className="text-sm font-bold text-slate-900">AgriShare Pro</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-primary mb-2"><Calendar size={20} /></div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Availability</p>
                <p className="text-sm font-bold text-slate-900">Instant Book</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">About this equipment</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {equipment.description || "No description provided for this listing."}
              </p>
            </div>

            {/* Map Section */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="text-primary" />
                Equipment Location
              </h3>
              <div className="rounded-2xl  h-100 border border-slate-100">
                <EquipmentLocationMap equipment={equipment} />
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-4">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">User Reviews</h3>
              <EquipmentReviews equipmentId={equipment.id} />
            </div>
          </div>

          {/* RIGHT COLUMN: Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              {/* Pricing & Booking Card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                <div className="p-6 bg-slate-900 text-white">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black">₹{equipment.hourly_rate}</span>
                    <span className="text-slate-400 font-medium">/ hour</span>
                  </div>
                </div>

                <div className="p-6">
                  {isOwner ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                      <div className="flex items-center gap-2 text-amber-700 font-bold mb-2">
                        <Info size={18} />
                        <h4>Listing Management</h4>
                      </div>
                      <p className="text-sm text-amber-600/80 mb-4">
                        You are the owner of this equipment. To update details or pricing, visit your dashboard.
                      </p>
                      <Link 
                        to="/dashboard" 
                        className="block text-center bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl font-bold transition-all shadow-md shadow-amber-200"
                      >
                        Edit Listing
                      </Link>
                    </div>
                  ) : (
                    <BookingForm
                      equipmentId={equipment.id}
                      hourlyRate={equipment.hourly_rate}
                      isAvailable={equipment.is_available}
                    />
                  )}
                </div>
              </div>

              {/* Owner Info Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-xs">Equipment Owner</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center text-primary border-2 border-primary/20">
                    <User size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg leading-tight">{equipment.owner_name}</p>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {equipment.owner_village}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <a 
                    href={`tel:${equipment.owner_phone}`} 
                    className="flex items-center justify-center gap-2 w-full py-3 border-2 border-slate-100 hover:border-primary hover:text-primary rounded-2xl font-bold text-slate-600 transition-all"
                  >
                    <Phone size={18} />
                    {equipment.owner_phone}
                  </a>
                </div>
                
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;