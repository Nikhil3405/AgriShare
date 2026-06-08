import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Settings, 
  Trash2, 
  Eye, 
  Tractor, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  PackageSearch
} from "lucide-react";
import equipmentService from "../../services/equipmentService";

const MyEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getMyEquipment();
      setEquipment(data.results || []);
    } catch (err) {
      console.error("Error fetching my equipment:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this listing? This action cannot be undone.")) return;

    try {
      setDeletingId(id);
      await equipmentService.deleteEquipment(id);
      setEquipment((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete equipment. It may have active bookings.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <section className="space-y-8 animate-in fade-in duration-500">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manage Inventory</h2>
          <p className="text-slate-500 text-sm font-medium">Manage and update your listed machinery</p>
        </div>

        <Link
          to="/equipment/create"
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          <Plus size={18} />
          Add Equipment
        </Link>
      </div>

      {equipment.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] py-20 px-6 text-center">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageSearch size={40} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No listings found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium leading-relaxed">
            You haven't listed any equipment yet. Start earning by sharing your tools with the community.
          </p>
          <Link
            to="/equipment/create"
            className="inline-flex items-center gap-2 text-primary font-bold hover:underline underline-offset-4"
          >
            Create your first listing <Plus size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {equipment.map((item) => (
            <div key={item.id} className="group bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden hover-lift transition-all">
              {/* Image Section */}
              <div className="relative aspect-video overflow-hidden bg-slate-200">
                <img
                  src={item.images?.length > 0 ? item.images[0].image : "/placeholder.jpg"}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                />
                
                {/* Status Overlay */}
                <div className="absolute top-3 left-3">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md border ${
                    item.is_available 
                    ? "bg-emerald-500/90 text-white border-emerald-400" 
                    : "bg-slate-800/90 text-white border-slate-700"
                  }`}>
                    {item.is_available ? (
                      <><CheckCircle2 size={12} /> Live Listing</>
                    ) : (
                      <><AlertCircle size={12} /> Hidden</>
                    )}
                  </div>
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur shadow-sm px-3 py-1 rounded-xl">
                   <p className="text-sm font-black text-slate-900">₹{item.hourly_rate}<span className="text-[10px] text-slate-400">/hr</span></p>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.equipment_type || 'Machinery'}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-4 truncate">{item.name}</h3>

                {/* Management Actions */}
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    to={`/equipment/${item.id}`}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-50 text-slate-600 hover:bg-primary/5 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                  >
                    <Eye size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">View</span>
                  </Link>

                  <Link
                    to={`/equipment/edit/${item.id}`}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                  >
                    <Settings size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Edit</span>
                  </Link>

                  <button
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item.id)}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100 disabled:opacity-50"
                  >
                    {deletingId === item.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyEquipment;