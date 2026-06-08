import { useEffect, useState } from "react";
import { Star, User, MessageCircle, AlertCircle } from "lucide-react";
import reviewService from "../../services/reviewService";

const EquipmentReviews = ({ equipmentId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewService.getEquipmentReviews(equipmentId);
        // Adapt to your API response structure (checking data.data or direct array)
        setReviews(data.data || data || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [equipmentId]);

  const StarRating = ({ rating, size = 16 }) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse flex gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full shrink-0" />
            <div className="flex-grow space-y-2">
              <div className="h-4 bg-slate-100 rounded w-1/4" />
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Ratings Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-black text-slate-900 leading-none">{averageRating}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Avg Rating</p>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div>
            <StarRating rating={Math.round(averageRating)} size={20} />
            <p className="text-sm text-slate-500 font-medium mt-1">Based on {reviews.length} verified reviews</p>
          </div>
        </div>
        <div className="flex -space-x-3 overflow-hidden">
          {reviews.slice(0, 5).map((rev, i) => (
            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
              {getInitials(rev.reviewer_name)}
            </div>
          ))}
          {reviews.length > 5 && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white bg-slate-800 text-white text-[10px] font-bold">
              +{reviews.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* Individual Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white border-2 border-dashed border-slate-100 rounded-3xl">
          <MessageCircle className="mx-auto h-12 w-12 text-slate-200 mb-3" />
          <h3 className="text-slate-900 font-bold">No reviews yet</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
            Be the first to rent this equipment and share your experience with the community.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group bg-white p-6 rounded-2xl border border-slate-50 shadow-sm hover:shadow-md hover:border-slate-100 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs ring-2 ring-slate-50">
                    {getInitials(review.reviewer_name)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-none">
                      {review.reviewer_name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                      Verified Rental • {new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>

              <div className="relative">
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>
              
              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded uppercase tracking-tight">
                <AlertCircle size={10} />
                Helpful Review
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentReviews;