import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocality, INDORE_LOCALITIES } from '../../context/LocalityContext';
import {
  Plus,
  Radio,
  User as UserIcon,
  LogOut,
  MapPin,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Building2,
  Wrench,
  Check,
  ShoppingBag,
  Heart,
  Layers,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, switchPersona } = useAuth();
  const { selectedLocality, setSelectedLocality, currentLocalityInfo } = useLocality();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [localityOpen, setLocalityOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const localityRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) {
        setDemoOpen(false);
      }
      if (localityRef.current && !localityRef.current.contains(e.target as Node)) {
        setLocalityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setProfileOpen(false);
    setDemoOpen(false);
    setLocalityOpen(false);
  }, [location.pathname]);

  const isCurrentPersonaPriya = user?.email === 'priya@college.edu';
  const isCurrentPersonaAarav = user?.email === 'aarav@openhand.org' || user?.email === 'aarav@helpgrid.org';

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 text-slate-900 w-full select-none shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* 1. BRAND LOGO & LOCALITY SELECTOR */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 group-hover:from-emerald-500 group-hover:to-emerald-800 transition-all duration-300 flex items-center justify-center text-white font-extrabold text-base shadow-[0_4px_12px_rgba(4,120,87,0.3)]">
              <span>🤝</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none group-hover:text-emerald-800 transition-colors">
                OpenHand
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                  Indore Mesh
                </span>
                <span className="hidden sm:inline-block text-[10px] text-slate-400 font-medium">
                  • 0% fee
                </span>
              </div>
            </div>
          </Link>

          {/* Hyperlocal Ward / Locality Selector */}
          <div className="relative" ref={localityRef}>
            <button
              type="button"
              onClick={() => setLocalityOpen(!localityOpen)}
              className="px-2.5 py-1.5 text-xs font-semibold bg-emerald-50/80 hover:bg-emerald-100/70 border border-emerald-200/80 rounded-xl text-emerald-950 flex items-center gap-1.5 transition-colors shadow-2xs whitespace-nowrap"
              title="Filter by Indore Ward / Mohalla"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="max-w-[80px] xs:max-w-[110px] sm:max-w-[140px] truncate">{currentLocalityInfo.name}</span>
              <ChevronDown className="w-3 h-3 text-emerald-600 shrink-0" />
            </button>

            {localityOpen && (
              <div className="absolute left-0 mt-2 w-72 max-w-[calc(100vw-24px)] bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 mb-1 flex items-center justify-between">
                  <span>SELECT INDORE MOHALLA / WARD</span>
                  <span className="text-emerald-700">HYPERLOCAL</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-0.5">
                  {INDORE_LOCALITIES.map((loc) => {
                    const isSelected = selectedLocality === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => {
                          setSelectedLocality(loc.id);
                          setLocalityOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>{loc.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({loc.hindiName})</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 truncate">{loc.landmark}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. REFINED NAVIGATION BAR */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60 text-xs font-semibold text-slate-600">
          <Link
            to="/marketplace"
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
              location.pathname === '/marketplace'
                ? 'text-slate-900 bg-white shadow-xs font-bold'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Marketplace</span>
          </Link>

          <Link
            to="/donate"
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
              location.pathname === '/donate'
                ? 'text-slate-900 bg-white shadow-xs font-bold'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            <span>Shelters & NGOs</span>
          </Link>

          <Link
            to="/services"
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
              location.pathname === '/services'
                ? 'text-slate-900 bg-white shadow-xs font-bold'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-blue-600" />
            <span>Services & Mistri</span>
          </Link>

          {user && (
            <Link
              to="/my-matches"
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
                location.pathname === '/my-matches'
                  ? 'text-emerald-950 bg-emerald-100 font-bold border border-emerald-300'
                  : 'text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100/70 border border-emerald-200/70 font-semibold'
              }`}
            >
              <span>🎯 For You</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </Link>
          )}

          <Link
            to="/live"
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
              location.pathname === '/live'
                ? 'text-slate-900 font-bold bg-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Live Radar</span>
          </Link>
        </nav>

        {/* 3. RIGHT CONTROLS: DEMO SWITCHER, CTAS, ACCOUNT */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* VIP Demo Switcher */}
          <div className="relative hidden xl:block" ref={demoRef}>
            <button
              type="button"
              onClick={() => setDemoOpen(!demoOpen)}
              className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-400 font-normal">Demo:</span>
              <strong className="text-slate-900">
                {isCurrentPersonaPriya ? 'Priya (Requester)' : isCurrentPersonaAarav ? 'Aarav (Helper)' : 'Custom User'}
              </strong>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {demoOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 mb-1">
                  SWITCH CANONICAL DEMO PERSONA
                </div>
                <button
                  type="button"
                  onClick={() => {
                    switchPersona('priya');
                    setDemoOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                    isCurrentPersonaPriya ? 'bg-emerald-50 text-emerald-950 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>Priya Sharma</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 rounded font-mono">CS 3rd Yr</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">SGSITS Campus • Lab 3 Requester</div>
                  </div>
                  {isCurrentPersonaPriya && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchPersona('aarav');
                    setDemoOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                    isCurrentPersonaAarav ? 'bg-emerald-50 text-emerald-950 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>Aarav Patel</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 rounded font-mono">Helper 92%</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Hardware & Electrical Tech • Palasia</div>
                  </div>
                  {isCurrentPersonaAarav && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Button (Desktop & Tablet) */}
          <Link
            to="/app/create"
            className="hidden sm:flex px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl transition-all shadow-[0_4px_14px_rgba(4,120,87,0.3)] hover:shadow-[0_6px_20px_rgba(4,120,87,0.4)] items-center gap-1.5 whitespace-nowrap active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Post Problem</span>
          </Link>

          {/* User Account / Profile Menu */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-800 transition-colors whitespace-nowrap shadow-2xs"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-[11px] shadow-2xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[75px] sm:max-w-[110px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-xs divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2.5 space-y-1">
                    <div className="font-bold text-slate-900 truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    <div className="pt-1 flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{user.city} Civic Mesh • Trust {user.trustScore}%</span>
                    </div>
                  </div>

                  <div className="py-1.5">
                    <Link
                      to="/my-matches"
                      className="px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors font-medium"
                    >
                      <span className="flex items-center gap-2">🎯 Matched For You</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                        New
                      </span>
                    </Link>
                    <Link
                      to="/create-id"
                      className="px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors font-medium"
                    >
                      <span>⚙️ My ID & WhatsApp Alerts</span>
                    </Link>
                    {user.role === 'HELPER' && (
                      <Link
                        to="/helper"
                        className="px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors font-medium"
                      >
                        <span>🛠️ Helper Cockpit</span>
                      </Link>
                    )}
                  </div>

                  {/* Quick Persona Switch inside dropdown for mobile/tablet */}
                  <div className="py-2">
                    <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      QUICK DEMO SWITCH
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 px-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => switchPersona('priya')}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-all ${
                          isCurrentPersonaPriya
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-2xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Priya (Student)
                      </button>
                      <button
                        type="button"
                        onClick={() => switchPersona('aarav')}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-all ${
                          isCurrentPersonaAarav
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-2xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Aarav (Tech)
                      </button>
                    </div>
                  </div>

                  <div className="pt-1.5">
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/create-id"
                className="px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors whitespace-nowrap"
              >
                Create ID
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shadow-2xs"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
