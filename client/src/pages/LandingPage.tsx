import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CivicRequest } from '../types';
import {
  Wrench,
  ArrowRight,
  MapPin,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  Heart,
  Coins,
  Building2,
  MessageSquare,
  Check,
  Zap,
  Radio,
  Star,
  Phone,
  SlidersHorizontal,
  BookOpen,
  Activity,
  AlertTriangle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [quickInput, setQuickInput] = useState('');
  const [requests, setRequests] = useState<CivicRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'MARKETPLACE' | 'DONATION' | 'SERVICES'>('ALL');

  useEffect(() => {
    api
      .getRequests({ radiusKm: 25 })
      .then((data) => setRequests(data))
      .catch(console.error);
  }, []);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    navigate('/app/create/details', {
      state: {
        initialText: quickInput,
      },
    });
  };

  const handlePillClick = (query: string, path: string) => {
    navigate(path);
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-900 min-h-screen font-sans w-full flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* 1. PROFESSIONAL HERO SECTION */}
      <section className="relative w-full min-h-auto sm:min-h-[80vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950 border-b border-slate-800">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-radar-grid opacity-15 pointer-events-none" />

        {/* Authentic background photo overlay with clean dark blending */}
        <img
          src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=2000&auto=format&fit=crop&q=85"
          alt="Community collaboration and civic care"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-15 pointer-events-none"
        />

        {/* Hero content container */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 py-10 sm:py-16 lg:py-20 flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-emerald-950/80 border border-emerald-800/60 text-xs font-semibold text-emerald-300 mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Indore Hyperlocal Network • Verified Community Listings • Zero Platform Fee</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.18] sm:leading-[1.12] max-w-4xl">
            Where Indore Neighbors Share,
            <br />
            <span className="text-emerald-400">
              Donate & Support Local Services.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 sm:mt-5 text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            A free civic platform connecting college students, residential colonies, verified elderly care homes, and local handymen in Indore. Buy and sell textbooks, fulfill shelter wishlists, or book trusted technicians directly without middlemen.
          </p>

          {/* Search Dispatcher */}
          <form
            onSubmit={handleQuickSubmit}
            className="mt-6 sm:mt-8 w-full max-w-2xl bg-slate-900/90 p-1.5 sm:p-2 rounded-lg border border-slate-700/80 shadow-md flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative w-full flex items-center pl-3">
              <Search className="w-5 h-5 text-emerald-400 shrink-0" />
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="What do you need? (e.g. 3rd yr CSE books, rent drill, leak repair...)"
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Post Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Search Chips */}
          <div className="mt-4 flex items-center justify-start sm:justify-center gap-2 text-xs overflow-x-auto no-scrollbar max-w-full pb-1 px-1">
            <span className="text-slate-400 text-[11px] font-mono uppercase tracking-wider shrink-0">Explore:</span>
            <button
              type="button"
              onClick={() => handlePillClick('books', '/marketplace')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>College Books</span>
            </button>
            <button
              type="button"
              onClick={() => handlePillClick('wheelchair', '/marketplace')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rent Wheelchairs & Walkers</span>
            </button>
            <button
              type="button"
              onClick={() => handlePillClick('plumber', '/services')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
              <span>Local Technicians</span>
            </button>
            <button
              type="button"
              onClick={() => handlePillClick('shelter', '/donate')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Shelter Wishlists</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/donate')}
              className="px-2.5 py-1 rounded-md bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/60 text-amber-300 text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Food Rescue</span>
            </button>
          </div>

          {/* Key Metric Tiles */}
          <div className="mt-6 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-4xl">
            <div className="p-3 sm:p-4 rounded-lg bg-slate-900/80 border border-slate-800 text-left">
              <div className="text-base sm:text-lg font-bold text-white">Student Marketplace</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Pre-owned books, cycles & tools</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-1 font-semibold">Direct peer exchange</div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg bg-slate-900/80 border border-slate-800 text-left">
              <div className="text-base sm:text-lg font-bold text-white">Verified Shelters</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Old age homes & child care</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-1 font-semibold">Real-time wishlists</div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg bg-slate-900/80 border border-slate-800 text-left">
              <div className="text-base sm:text-lg font-bold text-white">Local Coverage</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Bhawarkua, Palasia & colleges</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-1 font-semibold">Hyperlocal network</div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg bg-slate-900/80 border border-slate-800 text-left">
              <div className="text-base sm:text-lg font-bold text-emerald-400">Zero Commission</div>
              <div className="text-[11px] text-slate-300 mt-0.5">No platform transaction fees</div>
              <div className="text-[10px] text-emerald-300 font-mono mt-1 font-semibold">100% direct payment</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE COMMUNITY SPACES */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-16 lg:py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14 space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Three Dedicated Community Hubs</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              What would you like to do today?
            </h2>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
              Transparent, verified community spaces designed for Indore students, verified elderly care shelters, and local technicians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {/* Card 1: Marketplace */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
                    alt="Pre-owned college books and engineering stationery"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-white/95 text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Buy, Sell & Rent from ₹30/day</span>
                  </span>
                </div>

                <div className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span>STUDENT MARKETPLACE & RENTAL</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    Buy, Sell & Rent Pre-Owned Gear
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sell used college books, cycles, and calculators, or rent uncommon items like <strong>wheelchairs, walkers, hospital gear, heavy hammer drills, and projectors</strong> at nominal daily rates.
                  </p>

                  <div className="pt-1 sm:pt-2 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                      Rent Wheelchairs & Walkers
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 text-slate-700 font-medium">
                      Rent Heavy Drills
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 text-slate-700 font-medium">
                      Engineering Textbooks
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 pt-0">
                <Link
                  to="/marketplace"
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Explore Items & Rentals</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 2: Donation */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80"
                    alt="Warm clothing donation and food rescue for shelters"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-white/95 text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                    <span>Verified Indore Shelters</span>
                  </span>
                </div>

                <div className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
                    <Heart className="w-4 h-4 text-rose-600" />
                    <span>COMMUNITY GIVING</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-rose-900 transition-colors">
                    Donate to Vriddhashram & NGOs
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Donate clean winter clothes, surplus event food, blankets, or elderly walking sticks to verified old age homes and orphanages with urgent wishlists.
                  </p>

                  <div className="pt-1 sm:pt-2 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[11px] bg-rose-50 border border-rose-200 text-rose-900 font-semibold">
                      Aastha Vriddhashram
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 text-slate-700 font-medium">
                      Surplus Food Rescue
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 text-slate-700 font-medium">
                      Goonj Cloth Bank
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 pt-0">
                <Link
                  to="/donate"
                  className="w-full py-2.5 px-4 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <span>View Shelters & Wishlists</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 3: Services */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80"
                    alt="Professional Indian electrician and technician at work"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-white/95 text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-blue-700" />
                    <span>Verified Mistri • From ₹150 Visit Fee</span>
                  </span>
                </div>

                <div className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    <span>LOCAL SERVICES & REPAIR</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-blue-900 transition-colors">
                    Hire Trusted Local Technicians
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Need someone for a leaking hostel tap, burnt fan regulator, or dead PC before practical exams? Hire verified local workers with zero commission markup.
                  </p>

                  <div className="pt-1 sm:pt-2 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[11px] bg-blue-50 border border-blue-200 text-blue-900 font-semibold">
                      Plumbing (Nal Mistri)
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 text-slate-700 font-medium">
                      Electrical (Bijli Mistri)
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 text-slate-700 font-medium">
                      PC Diagnostics
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 pt-0">
                <Link
                  to="/services"
                  className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Find Handymen Nearby</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* OPENHAND ID & AUTOMATED WHATSAPP ALERTS CALLOUT */}
          <div className="mt-8 sm:mt-14 bg-slate-900 rounded-xl p-5 sm:p-8 lg:p-10 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 border border-slate-800 relative overflow-hidden">
            <div className="space-y-2 sm:space-y-3 max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Automated Indore Alert Radar</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Are you an NGO, Shelter, or Skilled Worker?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Create your OpenHand ID with your wishlist tags or trade skills. We match suitable items and work orders for you, and automatically ping you on <strong>WhatsApp</strong> the moment someone lists them in Indore!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0 relative z-10">
              <Link
                to="/create-id"
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Create ID with WhatsApp Alerts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/my-matches"
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>View Suitable For You</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW OPENHAND WORKS: 3 CRISP CIVIC STEPS */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-16 lg:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2 sm:mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>HYPERLOCAL CIVIC NETWORK</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                How OpenHand Works
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
                Connecting students, residents, verified old age homes, and local technicians across Indore with zero middleman commission.
              </p>
            </div>
            <Link
              to="/create-id"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
            >
              <span>Register an NGO or Worker ID →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {/* Step 1 */}
            <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-5 sm:p-7 flex flex-col justify-between hover:shadow-md transition-all group">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    01
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                    STEP ONE
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-emerald-900 transition-colors">
                  List Item, Donation, or Need
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Post old books or cycles for low-cost student sale, list warm blankets and food for shelter donation, or post a repair request for a local plumber or electrician.
                </p>
                <div className="pt-2 text-xs text-slate-500 space-y-1.5 sm:space-y-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Free photo listing in 30 seconds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Indore locality tagged (Bhawarkua, Palasia...)</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 sm:pt-6">
                <Link
                  to="/marketplace"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Explore Marketplace & Listings →</span>
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-5 sm:p-7 flex flex-col justify-between hover:shadow-md transition-all group">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    02
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                    STEP TWO
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-emerald-900 transition-colors">
                  Automated Match & WhatsApp Ping
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Our match engine instantly notifies verified Indore NGOs (like <em>Aastha Vriddhashram</em>) if donations match their wishlist, and alerts nearby technicians via WhatsApp.
                </p>
                <div className="pt-2 text-xs text-slate-500 space-y-1.5 sm:space-y-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Direct WhatsApp message alert</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Match score based on trade & wishlist</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 sm:pt-6">
                <Link
                  to="/create-id"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Turn on WhatsApp Alerts →</span>
                </Link>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-5 sm:p-7 flex flex-col justify-between hover:shadow-md transition-all group">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    03
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                    STEP THREE
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-emerald-900 transition-colors">
                  Direct Handshake & 0% Commission
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Call or WhatsApp directly. Meet at your college gate, hostel, or home. Hand over items, verify repairs on-site, and pay directly with zero platform cut.
                </p>
                <div className="pt-2 text-xs text-slate-500 space-y-1.5 sm:space-y-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>100% money stays with students/workers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Direct Call & WhatsApp phone links</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 sm:pt-6">
                <Link
                  to="/services"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Hire Verified Technicians →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VERIFIED INDORE DIRECTORY PREVIEW */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-16 lg:py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-1.5 sm:mb-2">
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>INDORE CIVIC DIRECTORY</span>
              </div>
              <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Verified Shelters, Technicians & Campus Deals
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Active neighbors, volunteers & workers operating daily across Indore.
              </p>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Link
                to="/donate"
                className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors shadow-2xs"
              >
                View All Shelters
              </Link>
              <Link
                to="/services"
                className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
              >
                Browse Technicians
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
            {/* Column 1: Shelters */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 sm:space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <Heart className="w-4 h-4 fill-rose-600" />
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900">Shelters & Old Age Homes</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    VERIFIED
                  </span>
                </div>

                <div className="mt-4 space-y-3.5">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Aastha Vriddhashram</span>
                      <span className="text-[10px] text-slate-500 font-medium">Old Palasia</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">Home to 18 elderly residents without immediate family.</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700">
                        Blankets & Shawls
                      </span>
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700">
                        Walking Sticks
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Snehalaya Bal Sadan</span>
                      <span className="text-[10px] text-slate-500 font-medium">Vijay Nagar</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">Care and schooling for 42 destitute and orphaned children.</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700">
                        School Bags
                      </span>
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700">
                        Winter Sweaters
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Annapurna Roti Bank</span>
                      <span className="text-[10px] text-slate-500 font-medium">Chhappan Dukan</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">Collecting safe surplus food from hostels & family events.</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700">
                        Fresh Cooked Meals
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/donate"
                className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center justify-between pt-3 border-t border-slate-100"
              >
                <span>Donate to Shelters</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Column 2: Technicians */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 sm:space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900">Verified Technicians</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    DIRECT CONTACT
                  </span>
                </div>

                <div className="mt-3.5 sm:mt-4 space-y-2.5 sm:space-y-3.5">
                  <div className="p-3 sm:p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 sm:space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Rameshwar "Ramesh" Kumar</span>
                      <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">₹150 visit</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Nal Mistri (Plumber) • 12 yrs in Indore • Palasia</p>
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Local Professional • Tank valves, tap repair</span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 sm:space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Vikram Sharma</span>
                      <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">₹200 visit</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Bijli Mistri (Electrician) • 9 yrs • Bhawarkua</p>
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Certified Electrician • Tripping MCB, fan regulator</span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 sm:space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Sunil Patidar</span>
                      <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">₹250 visit</span>
                    </div>
                    <p className="text-[11px] text-slate-600">PC Hardware & Diagnostics • Geeta Bhawan</p>
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hardware Specialist • SMPS, motherboard, OS recovery</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/services"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-between pt-3 border-t border-slate-100"
              >
                <span>Hire Technicians</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Column 3: Campus Marketplace */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 sm:space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900">Campus Marketplace Deals</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    CAMPUS GEAR
                  </span>
                </div>

                <div className="mt-3.5 sm:mt-4 space-y-2.5 sm:space-y-3.5">
                  <div className="p-3 sm:p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 sm:space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">3rd Year B.Tech CSE Books</span>
                      <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">₹350</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">Galvin OS, Korth DBMS, Tanenbaum CN • SGSITS Hostel 2</p>
                    <div className="text-[10px] text-slate-400">Semester reference set</div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 sm:space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Hero Sprint 26T Cycle</span>
                      <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">₹1,200</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">Single speed, good brakes, front basket • Bhawarkua</p>
                    <div className="text-[10px] text-slate-400">Verified student listing</div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 sm:space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Kenstar Room Desert Cooler</span>
                      <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">₹1,500</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">Submersible pump & motor working • Vijay Nagar</p>
                    <div className="text-[10px] text-slate-400">Tested and verified working</div>
                  </div>
                </div>
              </div>

              <Link
                to="/marketplace"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-between pt-3 border-t border-slate-100"
              >
                <span>Browse Student Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INDORE COMMUNITY TRUST CHARTER */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            <div className="p-4 sm:p-6 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2 sm:space-y-2.5">
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Coins className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Zero Commission</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                100% of money stays directly with students and local workers. No transaction cuts or middleman markups.
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2 sm:space-y-2.5">
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <MessageSquare className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Automated WhatsApp Radar</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant pings to registered NGOs and technicians when matching wishlist items or repair calls are listed nearby.
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2 sm:space-y-2.5">
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <MapPin className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Hyperlocal Radius</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect within 0.5 to 3 km inside Indore (Bhawarkua, Palasia, Vijay Nagar, SGSITS, Rajwada).
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2 sm:space-y-2.5">
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Verified Civic Identities</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Civic ID verification for shelters, NGOs, and technicians to prevent scams, ghost listings, and spam.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
