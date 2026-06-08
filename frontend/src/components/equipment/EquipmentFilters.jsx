import { useState } from "react";
import { 
  Search, 
  MapPin, 
  IndianRupee, 
  SlidersHorizontal, 
  X,
  Filter,
  Tractor,
  Pickaxe,
  Waves,
  Truck,
  Settings2,
  ChevronDown
} from "lucide-react";

const EQUIPMENT_TYPES = [
  { id: 'tractor', label: 'Tractor', icon: Tractor },
  { id: 'harvester', label: 'Harvester', icon: Settings2 },
  { id: 'rotavator', label: 'Rotavator', icon: Settings2 },
  { id: 'cultivator', label: 'Cultivator', icon: Settings2 },
  { id: 'plough', label: 'Plough', icon: Pickaxe },
  { id: 'seeder', label: 'Seeder', icon: Settings2 },
  { id: 'sprayer', label: 'Sprayer', icon: Waves },
  { id: 'thresher', label: 'Thresher', icon: Settings2 },
  { id: 'trailer', label: 'Trailer', icon: Truck },
  { id: 'water_tanker', label: 'Water Tanker', icon: Waves },
  { id: 'power_tiller', label: 'Power Tiller', icon: Tractor },
  { id: 'baler', label: 'Baler', icon: Settings2 },
  { id: 'transplanter', label: 'Rice Transplanter', icon: Settings2 },
  { id: 'other', label: 'Other', icon: Filter },
];

const EquipmentFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    min_price: "",
    max_price: "",
    equipment_type: "",
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };
    setFilters(newFilters);
    
    // Auto-apply if it's the category dropdown for faster UX
    if (e.target.name === 'equipment_type') {
      onFilter(newFilters);
    }
  };

  const handleCategoryClick = (typeId) => {
    const newValue = filters.equipment_type === typeId ? "" : typeId;
    const newFilters = { ...filters, equipment_type: newValue };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const applyFilters = () => {
    onFilter(filters);
  };

  const handleClear = () => {
    const cleared = {
      search: "",
      location: "",
      min_price: "",
      max_price: "",
      equipment_type: "",
    };
    setFilters(cleared);
    onFilter(cleared);
  };

  return (
    <div className="space-y-6 mb-10">
      {/* Main Search Bar Card */}
      <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-2">
        <div className="flex flex-col lg:flex-row items-center gap-2">
          
          {/* Search Input */}
          <div className="relative flex-grow w-full lg:w-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              name="search"
              value={filters.search}
              placeholder="Search tractors, harvesters..."
              className="w-full pl-12 pr-4 py-4 bg-transparent rounded-2xl focus:outline-none text-slate-900 font-medium placeholder:text-slate-400"
              onChange={handleChange}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
            />
          </div>

          <div className="hidden lg:block h-8 w-px bg-slate-100" />

          {/* Location Input */}
          <div className="relative flex-grow w-full lg:w-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <MapPin size={18} />
            </div>
            <input
              name="location"
              value={filters.location}
              placeholder="Anywhere"
              className="w-full pl-12 pr-4 py-4 bg-transparent rounded-2xl focus:outline-none text-slate-900 font-medium placeholder:text-slate-400"
              onChange={handleChange}
            />
          </div>

          <div className="hidden lg:block h-8 w-px bg-slate-100" />

          {/* Category Dropdown (Mobile Friendly Select) */}
          <div className="relative flex-grow w-full lg:w-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <Filter size={18} />
            </div>
            <select
              name="equipment_type"
              value={filters.equipment_type}
              onChange={handleChange}
              className="w-full pl-12 pr-10 py-4 bg-transparent rounded-2xl focus:outline-none text-slate-900 font-medium appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {EQUIPMENT_TYPES.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <ChevronDown size={18} />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto p-2 lg:p-0">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-2 px-4 py-3.5 rounded-xl border transition-all ${
                isExpanded 
                  ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary"
              }`}
            >
              <SlidersHorizontal size={18} />
            </button>

            <button
              onClick={applyFilters}
              className="flex-grow lg:flex-grow-0 bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
            >
              Search
            </button>
          </div>
        </div>

        {/* Expanded Price Filters */}
        {isExpanded && (
          <div className="px-6 pb-6 pt-4 animate-in slide-in-from-top-2 duration-300">
            <div className="h-px bg-slate-100 mb-6" />
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Price per Hour</label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                      <IndianRupee size={14} />
                    </div>
                    <input
                      name="min_price"
                      type="number"
                      value={filters.min_price}
                      placeholder="Min"
                      className="w-32 pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm transition-all font-semibold"
                      onChange={handleChange}
                    />
                  </div>
                  <span className="text-slate-300 font-bold">—</span>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                      <IndianRupee size={14} />
                    </div>
                    <input
                      name="max_price"
                      type="number"
                      value={filters.max_price}
                      placeholder="Max"
                      className="w-32 pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm transition-all font-semibold"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleClear}
                className="text-sm font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors ml-auto self-end pb-2"
              >
                <X size={16} />
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default EquipmentFilters;