import { useEffect, useState } from "react";
import equipmentService from "../services/equipmentService";
import EquipmentCard from "../components/equipment/EquipmentCard";
import EquipmentFilters from "../components/equipment/EquipmentFilters";
import EquipmentMap from "../components/map/EquipmentMap";
import { 
  LayoutGrid, 
  Map as MapIcon, 
  SearchX, 
  SlidersHorizontal,
  Tractor,
  RotateCcw
} from "lucide-react";

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});

  const fetchEquipment = async (filters = {}) => {
    setLoading(true);
    setActiveFilters(filters);
    try {
      const data = await equipmentService.getAll(filters);
      // Handle both paginated and non-paginated responses
      setEquipment(data.results || data || []);
    } catch (err) {
      console.error("Error fetching equipment:", err);
    } finally {
      // Adding a tiny delay for smoother skeleton transition
      setTimeout(() => setLoading(false), 400);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleResetFilters = () => {
    fetchEquipment({});
  };

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-2/3 skeleton rounded" />
        <div className="h-6 w-full skeleton rounded" />
        <div className="flex justify-between pt-2">
          <div className="h-5 w-1/4 skeleton rounded" />
          <div className="h-5 w-1/4 skeleton rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto my-15 px-4 sm:px-6 lg:px-8 py-8 page-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold mb-2">
            <Tractor size={20} />
            <span className="uppercase tracking-widest text-xs">Marketplace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Equipment
          </h1>
          <p className="text-slate-500 mt-1">
            {loading ? "Searching for gear..." : `Showing ${equipment.length} equipment`}
          </p>
        </div>

      </div>

      {/* Filter Bar */}
      <div className="mb-8">
        <EquipmentFilters onFilter={fetchEquipment} />
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : equipment.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-20 px-4 text-center">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchX size={40} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No equipment found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8">
            We couldn't find any results matching your current filters. Try adjusting your search or location.
          </p>
          <button 
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
          >
            <RotateCcw size={18} />
            Reset all filters
          </button>
        </div>
      ) :  (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
          {equipment.map((item) => (
            <EquipmentCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Pagination Placeholder (UX Improvement) */}
      {!loading && equipment.length > 0 && (
        <div className="mt-16 flex flex-col items-center border-t border-slate-100 pt-10">
          <p className="text-sm text-slate-400 mb-4">You've reached the end of the results</p>
          <div className="h-1.5 w-12 bg-slate-200 rounded-full" />
        </div>
      )}
    </div>
  );
};

export default EquipmentList;