import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CheckSquare, 
  Activity, 
  BarChart3, 
  Calendar,
  AlertCircle,
  IndianRupee
} from "lucide-react";
import bookingService from "../../services/bookingService";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from "recharts";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const result = await bookingService.getAnalytics();
      setData(result);
    } catch (err) {
      console.error("Analytics Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs font-bold">
          <p className="mb-1 text-slate-400">{label}</p>
          <p className="text-primary text-sm">
            ₹{Number(payload[0].value).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl" />)}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2].map(i => <div key={i} className="h-80 bg-slate-50 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] py-20 px-6 text-center">
        <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-900">No Analytics Data</h3>
        <p className="text-slate-500 mt-2">Complete your first booking to unlock financial insights.</p>
      </div>
    );
  }

  const earningsData = data.monthly_earnings.map(item => ({
    month: item.month,
    amount: item.total,
  }));

  const spendingData = data.monthly_spending.map(item => ({
    month: item.month,
    amount: item.total,
  }));

  return (
    <div className="space-y-10 page-fade-in">
      {/* Financial Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Earnings Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card hover-lift transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Earnings</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              ₹{Number(data.total_earned || 0).toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <Activity size={12} /> Total revenue generated
          </p>
        </div>

        {/* Spending Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card hover-lift transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <TrendingDown size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Spending</span>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">
            ₹{Number(data.total_spent || 0).toLocaleString()}
          </p>
          <p className="text-xs text-rose-500 font-bold mt-2 flex items-center gap-1">
            <Wallet size={12} /> Rental expenses
          </p>
        </div>

        {/* Volume: Completed */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card hover-lift transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <CheckSquare size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Volume</span>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">
            {data.completed_rentals || 0}
          </p>
          <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-tight">Completed Rentals</p>
        </div>

        {/* Active: Current */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card hover-lift transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Activity size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ongoing</span>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">
            {data.active_rentals || 0}
          </p>
          <p className="text-xs text-indigo-600 font-bold mt-2 uppercase tracking-tight">Active Bookings</p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earnings Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Monthly Revenue</h3>
            </div>
            <BarChart3 className="text-slate-300" size={20} />
          </div>

          {earningsData.length === 0 ? (
            <div className="h-72 flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
               <p className="text-slate-400 font-medium">Insufficient data for revenue trends</p>
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#16a34a" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorEarnings)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Spending Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Monthly Spending</h3>
            </div>
            <Calendar className="text-slate-300" size={20} />
          </div>

          {spendingData.length === 0 ? (
            <div className="h-72 flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
               <p className="text-slate-400 font-medium">Insufficient data for spending trends</p>
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingData}>
                  <defs>
                    <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#0f172a" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSpending)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Analytics;