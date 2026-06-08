import { useEffect, useState } from "react";
import { 
  Tractor, 
  Calendar, 
  Inbox, 
  BarChart3, 
  Plus, 
  Search, 
  Loader2, 
  LayoutDashboard,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

import bookingService from "../services/bookingService";
import BookingCard from "../components/booking/BookingCard";
import MyEquipment from "../components/dashboard/MyEquipment";
import Analytics from "../components/dashboard/Analytics";

const Dashboard = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [incomingBookings, setIncomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rentals");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [farmerData, ownerData] = await Promise.all([
        bookingService.getMyBookings(),
        bookingService.getOwnerBookings()
      ]);
console.log("Dashboard Data:", { farmerData, ownerData });
      setMyBookings(farmerData.results || []);
      setIncomingBookings(ownerData.results || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      // Small delay for smooth transition
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl" />)}
        </div>
        <div className="h-12 w-full bg-slate-50 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => <div key={i} className="h-64 bg-slate-50 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  const pendingRequests = incomingBookings.filter(b => b.status === "pending");
  const activeBookings = myBookings.filter(b => ["approved", "in_use"].includes(b.status));

  const TABS = [
    { id: "rentals", label: "My Rentals", icon: Calendar },
    { id: "requests", label: "Incoming Requests", icon: Inbox, badge: pendingRequests.length },
    { id: "equipment", label: "My Equipment", icon: Tractor },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 page-fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold mb-1">
            <LayoutDashboard size={18} />
            <span className="uppercase tracking-widest text-[10px]">Command Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Track your agricultural fleet and rental activities.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            to="/equipment"
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-slate-50 shadow-sm"
          >
            <Search size={18} />
            Rent Equipment
          </Link>
          <Link
            to="/equipment/create"
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            Add New
          </Link>
        </div>
      </div>

      {/* KPI STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card hover-lift transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Calendar size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{myBookings.length}</p>
          <p className="text-sm text-slate-500 mt-1 font-medium">Lifetime rentals</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card hover-lift transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Status</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{activeBookings.length}</p>
          <p className="text-sm text-emerald-600 mt-1 font-bold">Currently in use</p>
        </div>

        <div className={`p-6 rounded-3xl border transition-all shadow-card hover-lift relative overflow-hidden ${
          pendingRequests.length > 0 
            ? "bg-amber-50 border-amber-200" 
            : "bg-white border-slate-100"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${
              pendingRequests.length > 0 ? "bg-amber-500 text-white animate-pulse" : "bg-slate-100 text-slate-400"
            }`}>
              <Inbox size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Requests</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{pendingRequests.length}</p>
          <p className={`text-sm mt-1 font-bold ${pendingRequests.length > 0 ? "text-amber-700" : "text-slate-500"}`}>
            Needs your attention
          </p>
        </div>
      </div>

      {/* MODERN TAB NAVIGATION */}
      <div className="flex items-center p-1.5 bg-slate-100/80 backdrop-blur rounded-2xl overflow-x-auto no-scrollbar max-w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap relative ${
                isActive 
                  ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              <Icon size={18} />
              {tab.label}
              {tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-100">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[400px]">
        {/* MY RENTALS TAB */}
        {activeTab === "rentals" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {myBookings.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-16 px-4 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No rentals yet</h3>
                <p className="text-slate-500 max-w-xs mx-auto mb-6 text-sm">
                  Once you book some equipment, your active rentals will appear here.
                </p>
                <Link to="/equipment" className="text-primary font-bold hover:underline">Browse Marketplace →</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onRefresh={fetchDashboardData}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* INCOMING REQUESTS TAB */}
        {activeTab === "requests" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {incomingBookings.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-16 px-4 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Inbox size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Zero incoming requests</h3>
                <p className="text-slate-500 max-w-xs mx-auto mb-6 text-sm">
                  We'll notify you when someone wants to rent your listed equipment.
                </p>
                <Link to="/equipment/create" className="text-primary font-bold hover:underline">List more gear →</Link>
              </div>
            ) : (
              <div className="space-y-6">
                {incomingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onRefresh={fetchDashboardData}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* SUB-COMPONENTS */}
        {activeTab === "equipment" && (
          <div className="animate-in fade-in duration-300">
            <MyEquipment />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="animate-in fade-in duration-300">
            <Analytics />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;