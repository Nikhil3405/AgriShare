import { Link } from "react-router-dom";
import { 
  MapPin, 
  Star, 
  Clock, 
  ChevronRight, 
  ShieldCheck,
  Zap
} from "lucide-react";

const EquipmentCard = ({ item }) => {
  if (!item) return null;

  // Formatting price with Indian locale
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(item.hourly_rate);

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover-lift shadow-sm hover:shadow-xl transition-all duration-300">
      <Link to={`/equipment/${item.id}`} className="block relative">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.images?.[0]?.image || "/placeholder.jpg"}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badge: Category */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/20">
              {item.equipment_type || "Machinery"}
            </span>
            {item.is_verified && (
              <span className="bg-primary/90 backdrop-blur-sm text-white p-1 rounded-full shadow-sm">
                <ShieldCheck size={14} />
              </span>
            )}
          </div>

        </div>

        {/* Content Section */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {item.name}
            </h2>
          </div>

          <div className="flex items-center gap-1 text-slate-500 mb-4">
            <MapPin size={14} className="shrink-0" />
            <span className="text-xs truncate">{item.location || "Location not specified"}</span>
          </div>


          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hourly Rate</p>
              <p className="text-xl font-black text-slate-900">
                {formattedPrice}<span className="text-sm font-medium text-slate-500">/hr</span>
              </p>
            </div>
            
            <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors shadow-lg shadow-slate-200">
              <ChevronRight size={20} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EquipmentCard;