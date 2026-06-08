import { useState } from "react";
import { Star, MessageSquare, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import reviewService from "../../services/reviewService";

const ReviewForm = ({ bookingId, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await reviewService.createReview(bookingId, { rating, comment });
      
      setSuccess(true);
      // Let the success message show for a moment before calling onSuccess
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to submit your review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center animate-in zoom-in-95 duration-300">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
        <p className="text-emerald-900 font-bold">Review Submitted!</p>
        <p className="text-emerald-600 text-xs">Thank you for helping our community grow.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-100 rounded-3xl p-6 shadow-card animate-in slide-in-from-top-4 duration-500"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
          <Star size={18} fill="currentColor" />
        </div>
        <h3 className="font-bold text-slate-900 tracking-tight">Share Your Experience</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Star Rating Selector */}
      <div className="mb-6">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
          Your Rating
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform active:scale-90"
              >
                <Star
                  size={32}
                  className={`transition-colors ${
                    star <= (hoverRating || rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            {ratingLabels[hoverRating || rating]}
          </span>
        </div>
      </div>

      {/* Comment Input */}
      <div className="mb-6">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
          Detailed Feedback
        </label>
        <div className="relative group">
          <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <textarea
            rows="3"
            required
            placeholder="How was the equipment? Did the owner provide helpful instructions?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-grow bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <Send size={16} />
              Submit Review
            </>
          )}
        </button>
        
        <button
          type="button"
          onClick={() => onSuccess && onSuccess()}
          className="px-5 py-3 text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;