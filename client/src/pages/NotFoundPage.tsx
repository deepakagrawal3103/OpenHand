import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, Heart, Wrench, Activity, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-xl p-8 sm:p-10 shadow-sm text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-slate-100 text-slate-700 font-mono text-2xl font-bold">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            The page you are looking for does not exist or may have moved. You can navigate back to one of the main community hubs below.
          </p>
        </div>

        {/* Quick Hub Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-left">
          <Link
            to="/marketplace"
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-700 mb-1" />
            <div className="text-xs font-semibold text-slate-900 group-hover:text-emerald-800">Marketplace</div>
            <div className="text-[10px] text-slate-500">Rentals & sales</div>
          </Link>

          <Link
            to="/donate"
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group"
          >
            <Heart className="w-4 h-4 text-emerald-700 mb-1" />
            <div className="text-xs font-semibold text-slate-900 group-hover:text-emerald-800">Donations</div>
            <div className="text-[10px] text-slate-500">Direct wishlists</div>
          </Link>

          <Link
            to="/services"
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group"
          >
            <Wrench className="w-4 h-4 text-emerald-700 mb-1" />
            <div className="text-xs font-semibold text-slate-900 group-hover:text-emerald-800">Services</div>
            <div className="text-[10px] text-slate-500">Local technicians</div>
          </Link>

          <Link
            to="/radar"
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group"
          >
            <Activity className="w-4 h-4 text-emerald-700 mb-1" />
            <div className="text-xs font-semibold text-slate-900 group-hover:text-emerald-800">Live Radar</div>
            <div className="text-[10px] text-slate-500">Real-time status</div>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
