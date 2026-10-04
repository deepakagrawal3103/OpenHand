import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, CheckCircle2, User, Clock, ArrowRight } from 'lucide-react';

export const RadarHeroMap: React.FC = () => {
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner flex flex-col justify-between p-4">
      {/* Background Stylized Campus Grid */}
      <div 
        className="absolute inset-0 opacity-[0.45] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #CBD5E1 1px, transparent 1px),
            linear-gradient(to bottom, #CBD5E1 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Campus Blocks / Landmarks illustration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* SGSITS Academic Block Outline */}
        <div className="absolute top-6 left-8 w-44 h-24 bg-white/70 border border-slate-300 rounded-lg shadow-xs flex flex-col justify-center px-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic Block</span>
          <span className="text-xs font-semibold text-slate-700">CS & IT Dept</span>
        </div>

        {/* Central Library Outline */}
        <div className="absolute bottom-10 right-8 w-40 h-20 bg-white/70 border border-slate-300 rounded-lg shadow-xs flex flex-col justify-center px-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reading Hall</span>
          <span className="text-xs font-semibold text-slate-700">Central Library</span>
        </div>

        {/* Workshop Block */}
        <div className="absolute bottom-6 left-12 w-36 h-16 bg-white/50 border border-dashed border-slate-300 rounded-lg flex flex-col justify-center px-3">
          <span className="text-[10px] font-semibold text-slate-500">Makers Workshop</span>
        </div>

        {/* Dotted Route Connection between Library & Lab 3 */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
          <path
            d="M 120 75 Q 240 120 320 200"
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
        </svg>

        {/* Distance Badge on route */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-semibold text-emerald-800 shadow-sm flex items-center gap-1">
          <Navigation className="w-3 h-3 text-emerald-600" />
          <span>800m • 6 min walk</span>
        </div>
      </div>

      {/* Top Header Badge */}
      <div className="relative z-20 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full text-xs font-medium text-slate-700 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SGSITS Indore Campus Live Feed</span>
        </div>

        <span className="text-[11px] font-mono font-medium text-slate-500 bg-white/80 px-2.5 py-0.5 rounded border border-slate-200">
          Radius: ~800m
        </span>
      </div>

      {/* Interactive Active Node Pin 1: Lab 3 Request */}
      <div className="relative z-20 self-start max-w-[230px] bg-white border border-slate-200 rounded-xl p-3 shadow-md mt-1 transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
            URGENT REPORT
          </span>
          <span className="text-[10px] text-slate-400 font-mono">10:14 AM</span>
        </div>
        <h4 className="text-xs font-bold text-slate-900 leading-tight">Lab 3 PCs won't boot</h4>
        <p className="text-[11px] text-slate-500 mt-0.5">14 students blocked before term test</p>
      </div>

      {/* Interactive Active Node Pin 2: Aarav Patel Volunteer Helper */}
      <div className="relative z-20 self-end max-w-[240px] bg-white border border-emerald-200 rounded-xl p-3 shadow-md mb-1 transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
            <User className="w-2.5 h-2.5 text-emerald-700" />
            PEER HELPER
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold">92% Match</span>
        </div>
        <h4 className="text-xs font-bold text-slate-900 leading-tight">Aarav Patel (3rd Year)</h4>
        <p className="text-[11px] text-slate-500 mt-0.5">Has diagnostic tools & CMOS cells in bag</p>
      </div>

      {/* Bottom Bar: Action link */}
      <div className="relative z-20 flex items-center justify-between pt-2 border-t border-slate-200/60 bg-white/70 backdrop-blur-xs -mx-4 -mb-4 p-3 px-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Status: Resolved in 18 minutes</span>
        </div>
        <Link
          to="/live"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
        >
          <span>Fullscreen Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
