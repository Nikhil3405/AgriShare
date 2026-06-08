import { Link } from "react-router-dom";
import { 
  Search, 
  Calendar, 
  CheckCircle, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  ArrowRight 
} from "lucide-react";

const Landing = () => {
  return (
    <div className="page-fade-in">
      {/* HERO SECTION */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1627920769842-6887c6df05ca?q=80&w=1333&auto=format&fit=crop')",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-r from-black/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Modernizing <span className="text-primary">Farm Equipment</span> Access
            </h1>
            <p className="mt-6 text-xl text-gray-200">
              Rent high-quality machinery or list your own equipment. Join the largest agricultural sharing community.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/equipment"
                className="flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/30"
              >
                Browse Equipment
                <Search className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-xl font-bold transition-all"
              >
                List Your Gear
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">How AgriShare Works</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Our platform makes it easy to find and rent agricultural equipment in just a few clicks.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="text-center group">
            <div className="mb-6 relative mx-auto w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Search className="h-10 w-10" />
              <span className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">1</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Browse Equipment</h3>
            <p className="text-gray-600 leading-relaxed">
              Search by category, location, or price. Find the perfect tractor, harvester, or irrigation tool for your needs.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center group">
            <div className="mb-6 relative mx-auto w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Calendar className="h-10 w-10" />
              <span className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">2</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Book Instantly</h3>
            <p className="text-gray-600 leading-relaxed">
              Select your dates and book through our secure system. Communicate directly with equipment owners.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center group">
            <div className="mb-6 relative mx-auto w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <CheckCircle className="h-10 w-10" />
              <span className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">3</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Get Work Done</h3>
            <p className="text-gray-600 leading-relaxed">
              Pick up the equipment, finish your project, and return it. Simple, efficient, and cost-effective.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="bg-slate-900 rounded-3xl p-12 relative overflow-hidden text-center">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to maximize your farm's potential?</h2>
            <p className="text-gray-400 text-lg mb-10">
              Join thousands of farmers who are already saving money and earning extra income through AgriShare.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/equipment"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all"
              >
                Start Exploring
              </Link>
              <Link
                to="/register"
                className="bg-white hover:bg-gray-100 text-slate-900 px-8 py-3 rounded-xl font-bold transition-all"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2 text-primary font-bold text-2xl">
            <img src="/favicon.svg" alt="AgriShare Logo" className="h-8 w-8" />
            <span>AgriShare</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AgriShare Marketplace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;