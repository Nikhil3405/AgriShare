import { useEffect, useState } from "react";
import authService from "../services/authService";
import ChangePassword from "../components/profile/ChangePassword";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck
} from "lucide-react";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone_number: "",
    village: "",
    profile_image: null,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setFetching(true);
      const data = await authService.getProfile();

      setProfile({
        username: data.username || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        village: data.village || "",
        profile_image: null,
        current_image: data.profile_image,
      });
    } catch (err) {
      setError("Failed to load profile settings.");
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    // Reset success/error states when user starts typing again
    setUpdateSuccess(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      
      const formData = new FormData();
      formData.append("username", profile.username);
      formData.append("email", profile.email);
      formData.append("phone_number", profile.phone_number);
      formData.append("village", profile.village);

      if (profile.profile_image instanceof File) {
        formData.append("profile_image", profile.profile_image);
      }

      await authService.updateProfile(formData);
      setUpdateSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "/placeholder.jpg";
    if (path.startsWith("http")) return path;
    return `http://127.0.0.1:8000${path}`;
  };

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 h-64 bg-slate-100 animate-pulse rounded-3xl" />
          <div className="md:col-span-2 h-96 bg-slate-100 animate-pulse rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 page-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900">Account Settings</h1>
        <p className="text-slate-500 mt-2">Manage your personal information and security preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-card border border-slate-100 text-center">
            <div className="relative inline-block group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                <img
                  src={
                    profile.profile_image
                      ? URL.createObjectURL(profile.profile_image)
                      : getImageUrl(profile.current_image)
                  }
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <label className="absolute bottom-1 right-1 bg-primary hover:bg-primary-dark text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-all hover:scale-110 active:scale-95">
                <Camera size={18} />
                <input
                  type="file"
                  name="profile_image"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
                    if (!allowedTypes.includes(file.type)) {
                      setError("Only JPG, PNG and WEBP images are allowed.");
                      return;
                    }
                    if (file.size > 5 * 1024 * 1024) {
                      setError("Image size must be less than 5 MB.");
                      return;
                    }
                    setProfile(prev => ({ ...prev, profile_image: file }));
                  }}
                />
              </label>
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">{profile.username}</h3>
            <p className="text-sm text-slate-500">{profile.village || 'Member since 2024'}</p>
            
          </div>

          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
            <div className="flex items-center gap-3 text-emerald-700 font-bold mb-2">
              <ShieldCheck size={20} />
              <h4>Trust & Safety</h4>
            </div>
            <p className="text-xs text-emerald-600/80 leading-relaxed">
              Your contact details are only shared with owners when a booking is confirmed.
            </p>
          </div>
        </div>

        {/* Right Column: Information Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Profile Form */}
          <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
              {updateSuccess && (
                <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-bold animate-in fade-in slide-in-from-right-4">
                  <CheckCircle2 size={16} />
                  Changes saved
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Username</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      name="username"
                      value={profile.username}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      name="phone_number"
                      value={profile.phone_number}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Village/Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      name="village"
                      value={profile.village}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-50 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Security & Password</h2>
            </div>
            <div className="p-8">
              <ChangePassword />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;