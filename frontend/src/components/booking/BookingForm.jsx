import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Info,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  X,
  ShieldCheck,
} from "lucide-react";
import bookingService from "../../services/bookingService";

const BookingForm = ({ equipmentId, hourlyRate, isAvailable }) => {
  const [form, setForm] = useState({
    start_time: "",
    end_time: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Persistence Logic
  useEffect(() => {
    const saved = localStorage.getItem(`booking_${equipmentId}`);
    if (saved) {
      setForm(JSON.parse(saved));
    }
  }, [equipmentId]);

  useEffect(() => {
    localStorage.setItem(`booking_${equipmentId}`, JSON.stringify(form));
  }, [form, equipmentId]);

  const validate = () => {
    if (!form.start_time || !form.end_time) {
      return "Please select both start and end times.";
    }
    if (new Date(form.end_time) <= new Date(form.start_time)) {
      return "End time must be after the start time.";
    }
    const now = new Date();
    if (new Date(form.start_time) < now) {
      return "Start time cannot be in the past.";
    }
    return null;
  };

  const durationHours =
    form.start_time && form.end_time
      ? Math.max(
          0,
          (new Date(form.end_time) - new Date(form.start_time)) /
            (1000 * 60 * 60),
        ).toFixed(1)
      : 0;

  const estimatedTotal = durationHours * Number(hourlyRate || 0);

  // Triggered by the main form button
  const handleInitiateBooking = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setShowConfirm(true); // Open the custom confirm dialog
  };

  // Final API call
  const processBooking = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    try {
      await bookingService.createBooking({
        equipment: equipmentId,
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString(),
      });

      setSuccess("Your booking request has been sent to the owner!");
      localStorage.removeItem(`booking_${equipmentId}`);
      setForm({ start_time: "", end_time: "" });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          "Failed to create booking. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getLocalDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const formatDisplayDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-emerald-900 mb-2">
          Request Sent!
        </h3>
        <p className="text-emerald-700 text-sm leading-relaxed mb-6">
          The owner has been notified. You can track this request in your
          dashboard.
        </p>
        <button
          onClick={() => setSuccess("")}
          className="text-emerald-700 font-bold text-sm hover:underline"
        >
          Make another booking
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-slate-900">Reserve Now</h2>
          <div className="flex items-center gap-1 text-xs font-bold  bg-primary/10 px-2 py-1 rounded-md uppercase tracking-wider">
            {isAvailable ? (
              <>
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <p className="text-xs text-primary">Available</p>
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <p className="text-xs text-red-500">Not Available</p>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleInitiateBooking} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative group">
              <label className="absolute -top-2.5 left-3 px-1 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest z-10">
                Start Time
              </label>
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary">
                <Calendar size={18} />
              </div>
              <input
                type="datetime-local"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-slate-700"
                value={form.start_time}
                min={getLocalDateTime()}
                onChange={(e) =>
                  setForm({ ...form, start_time: e.target.value })
                }
              />
            </div>

            <div className="relative group">
              <label className="absolute -top-2.5 left-3 px-1 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest z-10">
                End Time
              </label>
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary">
                <Clock size={18} />
              </div>
              <input
                type="datetime-local"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-slate-700"
                value={form.end_time}
                min={form.start_time || getLocalDateTime()}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                ₹{hourlyRate} x {durationHours} hours
              </span>
              <span className="font-bold text-slate-700">
                ₹{(hourlyRate * durationHours).toFixed(2)}
              </span>
            </div>
            <div className="h-px bg-slate-200 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-slate-900">
                Total Estimate
              </span>
              <span className="text-xl font-black text-primary">
                ₹{estimatedTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <ArrowRight size={20} /> Reserve Equipment
              </>
            )}
          </button>
        </form>
      </div>

      {/* CUSTOM CONFIRMATION DIALOG */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] mt-26 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                  <ShieldCheck size={28} />
                </div>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Confirm Booking
              </h3>
              <p className="text-slate-500 text-sm mb-8">
                Please review your rental schedule before sending the request to
                the owner.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Schedule
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700">
                      {formatDisplayDate(form.start_time)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                      to
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {formatDisplayDate(form.end_time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="text-xs font-bold text-primary uppercase tracking-widest">
                    Estimated Total
                  </div>
                  <div className="text-xl font-black text-primary">
                    ₹{estimatedTotal.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={processBooking}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  Confirm & Send Request
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full bg-white text-slate-500 font-bold py-3 hover:text-slate-800 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
            <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                No immediate payment required
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingForm;
