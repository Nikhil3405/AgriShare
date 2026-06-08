import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  User, 
  Check, 
  X, 
  Truck, 
  RotateCcw, 
  Star, 
  Loader2,
  Info,
  Phone,
  MessageCircle // For WhatsApp
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import bookingService from "../../services/bookingService";
import ReviewForm from "../reviews/ReviewForm";

const BookingCard = ({ booking, onRefresh }) => {
  if (!booking) return null;
  const [showReview, setShowReview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action) => {
    try {
      setIsProcessing(true);
      await action(booking.id);
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Action failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden transition-all hover:shadow-lg page-fade-in">
      {/* Context Header */}
      <div className="px-5 py-2 flex justify-between items-center bg-slate-50/50 border-b border-slate-50">
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
          booking.is_owner ? "text-indigo-600" : "text-primary"
        }`}>
          {booking.is_owner ? "Lending Activity" : "Renting Activity"}
        </span>
        <span className="text-[10px] text-slate-400 font-mono">ID: #{booking.id.toString().padStart(5, '0')}</span>
      </div>

      <div className="p-5">
        <div className="flex gap-4">
          {/* Equipment Image Thumbnail */}
          <div className="h-20 w-20 rounded-2xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-100">
            <img 
              src={booking.equipment_image || "/placeholder.jpg"} 
              alt={booking.equipment_name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Core Info */}
          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h2 className="font-bold text-slate-900 truncate text-lg group-hover:text-primary transition-colors">
                {booking.equipment_name}
              </h2>
              <StatusBadge status={booking.status} />
            </div>
            
            <div className="space-y-1 mt-1">
              <div className="flex items-center gap-2 text-slate-500">
                <User size={14} className="shrink-0" />
                <p className="text-xs font-medium truncate">
                  {booking.is_owner ? `Farmer: ${booking.farmer_name}` : `Owner: ${booking.owner_name}`}
                </p>
              </div>

              {/* OWNER VIEW: Farmer Contact Details */}
              {booking.is_owner && booking.farmer_phone && (
                <div className="flex items-center gap-3 mt-2">
                  <a 
                    href={`tel:${booking.farmer_phone}`}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Phone size={12} />
                    Call +91 {booking.farmer_phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline & Financials Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-slate-50 rounded-2xl">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Calendar size={14} className="text-primary mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Pickup</p>
                <p className="text-xs font-bold text-slate-700 mt-1">{formatDate(booking.start_time)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 mt-1"> 
              <Calendar size={14} className="text-primary mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Return</p>
                <p className="text-xs font-bold text-slate-700 mt-1">{formatDate(booking.end_time)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={14} className="text-primary mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Duration</p>
                <p className="text-xs font-bold text-slate-700 mt-1">{Number(booking.duration_hours || 0).toFixed(1)} Hours</p>
              </div>
            </div>
          </div>
          
          <div className="border-l border-slate-200 pl-4 flex flex-col justify-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Total Payment</p>
            <div className="flex items-baseline gap-1 mt-1 text-primary">
              <span className="text-lg font-black tracking-tight">₹{booking.total_price}</span>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-6">
          {/* OWNER SPECIFIC ACTIONS */}
          {booking.is_owner && booking.status === "pending" && (
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={isProcessing}
                onClick={() => handleAction(bookingService.approveBooking)}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Approve
              </button>
              <button
                disabled={isProcessing}
                onClick={() => handleAction(bookingService.rejectBooking)}
                className="flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              >
                <X size={16} />
                Reject
              </button>
            </div>
          )}

          {booking.is_owner && booking.status === "approved" && (
            <button
              disabled={isProcessing}
              onClick={() => handleAction(bookingService.handOverBooking)}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              <Truck size={18} />
              Hand Over Equipment
            </button>
          )}

          {booking.is_owner && booking.status === "return_requested" && (
            <button
              disabled={isProcessing}
              onClick={() => handleAction(bookingService.confirmReturn)}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
            >
              <RotateCcw size={18} />
              Confirm Return & Finish
            </button>
          )}

          {/* FARMER SPECIFIC ACTIONS */}
          {booking.is_farmer && booking.status === "approved" && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl">
              <Info size={18} className="shrink-0" />
              <p className="text-xs font-bold leading-snug">
                Waiting for owner to hand over equipment. Check pickup details.
              </p>
            </div>
          )}

          {booking.is_farmer && booking.status === "in_use" && (
            <button
              disabled={isProcessing}
              onClick={() => handleAction(bookingService.requestReturn)}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-200 disabled:opacity-50"
            >
              <RotateCcw size={18} />
              Request to Return
            </button>
          )}

          {booking.is_farmer && booking.status === "completed" && (
            <div className="space-y-4">
              <button
                onClick={() => setShowReview(!showReview)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                  showReview 
                    ? "bg-slate-100 border-slate-200 text-slate-600" 
                    : "bg-white border-primary text-primary hover:bg-primary/5"
                }`}
              >
                <Star size={18} className={showReview ? "fill-slate-400" : "fill-primary"} />
                {showReview ? "Close Review" : "Leave a Review"}
              </button>

              {showReview && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                  <ReviewForm
                    bookingId={booking.id}
                    onSuccess={() => {
                      setShowReview(false);
                      if (onRefresh) onRefresh();
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;