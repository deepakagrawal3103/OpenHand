import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  Sliders,
  Check,
  MessageSquare,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, switchPersona } = useAuth();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) {
        setDemoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setProfileOpen(false);
    setDemoOpen(false);
  }, [location.pathname]);

  const isCurrentPersonaPriya = user?.email === 'priya@college.edu';
  const isCurrentPersonaAarav = user?.email === 'aarav@openhand.org' || user?.email === 'aarav@helpgrid.org';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-900 w-full select-none shadow-xs">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* 1. BRAND LOGO & COMPACT LOCATION */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 group-hover:bg-emerald-800 transition-colors flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
              O
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                OpenHand
              </span>
              <span className="text-[10px] font-mono text-emerald-700 tracking-wider uppercase font-semibold leading-tight mt-0.5">
                Indore Mesh
              </span>
            </div>
          </Link>
        </div>

        {/* 2. ORGANIZED MAIN NAVIGATION (SINGLE LINE, ZERO WRAPPING) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 text-xs font-semibold text-slate-600">
          <Link
            to="/marketplace"
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              location.pathname === '/marketplace'
                ? 'text-slate-900 bg-slate-100 font-bold'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Buy, Sell & Rent
          </Link>

          <Link
            to="/donate"
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              location.pathname === '/donate'
                ? 'text-slate-900 bg-slate-100 font-bold'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Donations & NGOs
          </Link>

          <Link
            to="/services"
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              location.pathname === '/services'
                ? 'text-slate-900 bg-slate-100 font-bold'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Services & Workers
          </Link>

          {user && (
            <Link
              to="/my-matches"
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                location.pathname === '/my-matches'
                  ? 'text-emerald-900 bg-emerald-100/70 font-bold border border-emerald-300/80'
                  : 'text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/60 border border-emerald-200/60 font-semibold'
              }`}
            >
              <span>🎯 For You</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </Link>
          )}

          <Link
            to="/live"
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 text-slate-500 ${
              location.pathname === '/live'
                ? 'text-slate-900 font-bold bg-slate-100'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Radar</span>
          </Link>
        </nav>

        {/* 3. PROFESSIONAL RIGHT ACTIONS (STREAMLINED & ORGANIZED) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Subtle Compact Demo Switcher Dropdown (No Clutter) */}
          <div className="relative hidden xl:block" ref={demoRef}>
            <button
              type="button"
              onClick={() => setDemoOpen(!demoOpen)}
              className="px-2.5 py-1.5 text-[11px] font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <span className="text-slate-400">Demo:</span>
              <strong className="text-slate-800">
                {isCurrentPersonaPriya ? 'Priya (Requester)' : isCurrentPersonaAarav ? 'Aarav (Helper)' : 'Custom User'}
              </strong>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {demoOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 text-xs">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  SWITCH CANONICAL PERSONA
                </div>
                <button
                  type="button"
                  onClick={() => {
                    switchPersona('priya');
                    setDemoOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <div>
                    <div className="font-bold">Priya Sharma</div>
                    <div className="text-[11px] text-slate-500">Student Requester (Lab 3)</div>
                  </div>
                  {isCurrentPersonaPriya && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchPersona('aarav');
                    setDemoOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <div>
                    <div className="font-bold">Aarav Patel</div>
                    <div className="text-[11px] text-slate-500">Hardware Helper (SGSITS)</div>
                  </div>
                  {isCurrentPersonaAarav && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <Link
            to="/app/create"
            className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap active:scale-[0.98]"
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
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-slate-800 transition-colors whitespace-nowrap"
              >
                <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[70px] sm:max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs divide-y divide-slate-100">
                  <div className="px-2.5 py-2 space-y-0.5">
                    <div className="font-bold text-slate-900 truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    <div className="pt-1 flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{user.city} Campus Mesh • Trust {user.trustScore}%</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/my-matches"
                      className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      <span>🎯 Matched For You</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">
                        New
                      </span>
                    </Link>
                    <Link
                      to="/create-id"
                      className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      <span>⚙️ My ID & WhatsApp Alerts</span>
                    </Link>
                    {user.role === 'HELPER' && (
                      <Link
                        to="/helper"
                        className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors"
                      >
                        <span>🛠️ Helper Cockpit</span>
                      </Link>
                    )}
                  </div>

                  {/* Quick Persona Switch inside dropdown for smaller screens */}
                  <div className="py-1">
                    <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      QUICK DEMO SWITCH
                    </div>
                    <div className="grid grid-cols-2 gap-1 px-1">
                      <button
                        type="button"
                        onClick={() => switchPersona('priya')}
                        className={`px-2 py-1 rounded text-[11px] font-medium border text-center transition-all ${
                          isCurrentPersonaPriya
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Priya
                      </button>
                      <button
                        type="button"
                        onClick={() => switchPersona('aarav')}
                        className={`px-2 py-1 rounded text-[11px] font-medium border text-center transition-all ${
                          isCurrentPersonaAarav
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Aarav
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 font-semibold transition-colors flex items-center gap-1.5"
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
                className="px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors whitespace-nowrap"
              >
                Create ID
              </Link>
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
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
