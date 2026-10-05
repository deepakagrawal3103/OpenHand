import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Code, MapPin, Gift } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand text-white/90 border-t border-brand-hover">
      {/* Guarantees bar */}
      <div className="border-b border-white/10 py-4 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1560px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-emerald-200">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero Data Selling</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Code className="w-4 h-4 text-emerald-400" />
            <span>Open Source Community</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Indore Civic Chapter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-emerald-400" />
            <span>Free Public Utility</span>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/70">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <div className="w-5 h-5 rounded-[4px] bg-white text-brand flex items-center justify-center font-black text-xs">
              O
            </div>
            <span>OpenHand</span>
          </div>
          <span className="font-mono text-white/50">Indore Hyperlocal Community Network</span>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <Link to="/marketplace" className="hover:text-white transition-colors">
            Buy, Sell & Rent
          </Link>
          <Link to="/donate" className="hover:text-white transition-colors">
            Donations
          </Link>
          <Link to="/services" className="hover:text-white transition-colors">
            Local Services
          </Link>
          <Link to="/live" className="hover:text-white transition-colors">
            Live Radar
          </Link>
          <span className="text-white/40">Built for local resilience</span>
        </div>

        <div className="font-mono text-white/50">
          © 2026 OpenHand Community Platform.
        </div>
      </div>
    </footer>
  );
};
