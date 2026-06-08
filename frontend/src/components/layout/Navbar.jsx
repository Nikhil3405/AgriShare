import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  ChevronDown,
  Tractor
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "/placeholder.jpg";
    if (path.startsWith("http")) return path;
    return `http://127.0.0.1:8000${path}`;
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      setProfileOpen(false);
      navigate("/");
    }
  };

  const navLinkStyles = ({ isActive }) => 
    `px-1 py-2 text-sm font-medium transition-colors border-b-2 ${
      isActive 
        ? "text-primary border-primary" 
        : "text-slate-600 border-transparent hover:text-primary hover:border-primary/30"
    }`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50  transition-all duration-300 ${
      scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-2" : "bg-white py-4"
    } border-b border-slate-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Left: Brand & Desktop Nav */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1.5 rounded-lg transition-transform group-hover:rotate-12">
                <Tractor className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-700 bg-clip-text text-transparent">
                AgriShare
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <NavLink to="/equipment" className={navLinkStyles}>
                Browse Equipment
              </NavLink>
              {user && (
                <NavLink to="/dashboard" className={navLinkStyles}>
                  Dashboard
                </NavLink>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-5">
            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-primary/20"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 md:gap-5">
                <NotificationBell />

                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                  >
                    <img
                      src={getImageUrl(user.profile_image)}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {user.username}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        {user.village || 'Farmer'}
                      </p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)}></div>
                      <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 py-2 animate-in fade-in zoom-in duration-200">
                        <div className="px-4 py-3 border-b border-slate-50">
                          <p className="text-sm text-slate-500">Signed in as</p>
                          <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                        </div>
                        
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <User className="h-4 w-4 text-slate-400" />
                          My Profile
                        </Link>
                        
                        
                        <div className="h-px bg-slate-100 my-1"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 space-y-2 animate-in slide-in-from-top duration-300">
          <NavLink 
            to="/equipment" 
            className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Browse Equipment
          </NavLink>
          {user && (
            <NavLink 
              to="/dashboard" 
              className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
          )}
          {!user && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <Link to="/login" className="text-center py-2 text-slate-600 font-medium">Login</Link>
              <Link to="/register" className="text-center py-2 bg-primary text-white rounded-lg font-medium">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;