import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CivicRequest } from '../types';
import { StatusChip } from '../components/ui/StatusChip';
import { UrgencyBadge } from '../components/ui/UrgencyBadge';
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
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [quickInput, setQuickInput] = useState('');
  const [requests, setRequests] = useState<CivicRequest[]>([]);

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

  return (
    <div className="bg-[#FAF9F6] text-slate-900 min-h-screen font-sans w-full flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. FULL-WIDTH CINEMATIC HERO BANNER COVERING WHOLE SCREEN */}
      <section className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden border-b border-slate-200">
        {/* AUTHENTIC HELPING HAND / OPENHAND CONNECTION IMAGE */}
        <img
          src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=2000&auto=format&fit=crop&q=85"
          alt="Two hands reaching out to help and support each other"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.52] contrast-[1.08]"
        />

        {/* REFINED BALANCED OVERLAY FOR MAXIMUM TYPOGRAPHY LEGIBILITY */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/45" />

        {/* HERO CONTENT CONTAINER */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 py-12 lg:py-20 flex flex-col items-center text-center max-w-7xl mx-auto">
          {/* Subtle Location Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-emerald-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SGSITS & Indore Campus Network • Free Peer Help</span>
          </div>

          {/* Bold Impactful Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[1.08] drop-shadow-sm">
            BUY & SELL • DONATE •
            <br />
            <span className="text-emerald-400">FIND LOCAL SERVICES</span>
          </h1>

          {/* Accurate, Direct 1-Sentence Motive */}
          <p className="mt-5 text-base sm:text-xl text-slate-200 max-w-2xl font-normal leading-relaxed">
            Indore's community helping hand. Sell or buy old college books & gear at low prices, donate surplus to nearest Old Age Homes & NGOs, or hire trusted local plumbers, electricians and technicians.
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full max-w-2xl">
            <Link
              to="/marketplace"
              className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Buy & Sell Stuff</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/donate"
              className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Donate to NGOs & Homes</span>
            </Link>
            <Link
              to="/services"
              className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 backdrop-blur-md"
            >
              <span>Find Services & Handymen</span>
            </Link>
          </div>

          {/* Clean 4 Key Numbers Strip */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 border-t border-white/15 pt-8 text-center text-white w-full max-w-3xl">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">₹50 - ₹500</div>
              <div className="text-xs text-slate-300 mt-0.5">Average Book & Item Price</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">5+ Homes</div>
              <div className="text-xs text-slate-300 mt-0.5">Verified Indore NGOs</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">Under 1 km</div>
              <div className="text-xs text-slate-300 mt-0.5">Hyper-Local Radius</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100% Direct</div>
              <div className="text-xs text-slate-300 mt-0.5">Zero Brokerage Fee</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE COMMUNITY SPACES (SELL & BUY, DONATION, SERVICES) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-16 lg:py-20 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-[1560px] mx-auto w-full">
          {/* Authentic Human Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Indore Community Mesh • Direct Peer Exchange</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What would you like to do today?
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Three dedicated community spaces for Indore students, verified shelters, and neighborhood technicians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Sell & Buy */}
            <div className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-600/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group">
              <div>
                {/* Visual Cover Photo with Real Indian Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
                    alt="Pre-owned college books and engineering stationery"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[11px] font-bold text-slate-900 shadow-sm flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Buy, Sell & Rent from ₹30/day</span>
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <ShoppingBag className="w-4 h-4 text-emerald-700" />
                    <span>MARKETPLACE & RENTAL HUB</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                    Buy, Sell & Rent Pre-Owned Gear
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sell used college books, cycles, and calculators—or rent uncommon items like <strong>wheelchairs, walkers, hospital gear, heavy hammer drills, and projectors</strong> at nominal daily rates.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[11px] bg-indigo-50 border border-indigo-200 text-indigo-800 font-semibold">
                      ♿ Rent Wheelchair & Walker
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                      🛠️ Rent Drills & Projectors
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                      📚 Buy & Sell Books
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to="/marketplace"
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Explore Items & Rentals</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 2: Donation */}
            <div className="bg-white rounded-2xl border border-slate-200 hover:border-red-500/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group">
              <div>
                {/* Visual Cover Photo with Real Indian Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80"
                    alt="Warm clothing donation and food rescue for shelters"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[11px] font-bold text-slate-900 shadow-sm flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                    <span>5+ Verified Indore Shelters</span>
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-700">
                    <Heart className="w-4 h-4 text-red-600" />
                    <span>COMMUNITY GIVING</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-900 transition-colors">
                    Donate to Vriddhashram & NGOs
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Donate clean winter clothes, surplus event food, blankets, or elderly walking sticks to verified old age homes and orphanages with urgent wishlists.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                      🏠 Aastha Vriddhashram
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                      🍲 Surplus Food Rescue
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                      🧥 Goonj Cloth Bank
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to="/donate"
                  className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <span>View Shelters & Wishlists</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 3: Services */}
            <div className="bg-white rounded-2xl border border-slate-200 hover:border-blue-500/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group">
              <div>
                {/* Visual Cover Photo with Real Indian Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80"
                    alt="Professional Indian electrician and technician at work"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[11px] font-bold text-slate-900 shadow-sm flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-blue-700" />
                    <span>Verified Mistri • From ₹150 Visit Fee</span>
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                    <Wrench className="w-4 h-4 text-blue-700" />
                    <span>LOCAL SERVICES & REPAIR</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                    Hire Trusted Local Technicians
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Need someone for a leaking hostel tap, burnt fan regulator, or dead PC before practical exams? Hire verified local workers with zero commission markup.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                      🚰 Nal Mistri (Plumber)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                      ⚡ Bijli Mistri
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                      💻 PC Hardware Tech
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to="/services"
                  className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Find Handymen Nearby</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* NEW: OPENHAND ID & AUTOMATED WHATSAPP ALERTS CALLOUT */}
          <div className="mt-12 bg-gradient-to-r from-emerald-900 to-emerald-950 rounded-2xl p-6 sm:p-10 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-700/60 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Automated Indore Alert Network</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Are you an NGO, Shelter, or Skilled Worker?
              </h3>
              <p className="text-sm text-emerald-100 leading-relaxed">
                Create your OpenHand ID with your wishlist or trade skills. We match suitable items and work orders for you, and automatically ping you on <strong>WhatsApp</strong> the moment someone lists them in Indore!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <Link
                to="/create-id"
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Create ID with WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/my-matches"
                className="w-full sm:w-auto px-5 py-3.5 bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-600/40 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>View Suitable For You</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW OPENHAND WORKS (DIRECT, 3-STEP CIVIC PROCESS) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-16 lg:py-20 bg-white border-b border-slate-200">
        <div className="max-w-[1560px] mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>HYPERLOCAL CIVIC NETWORK</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                How OpenHand Works
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#FAF9F6] border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    01
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                    STEP ONE
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                  List Item, Donation, or Need
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Post old books or cycles for low-cost student sale, list warm blankets and food for shelter donation, or post a repair request for a local plumber or electrician.
                </p>
                <div className="pt-2 text-xs text-slate-500 space-y-1.5 border-t border-slate-200">
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
              <div className="pt-6">
                <Link
                  to="/marketplace"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Explore Marketplace & Listings →</span>
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF9F6] border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    02
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                    STEP TWO
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                  Automated Match & WhatsApp Ping
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Our match engine instantly notifies verified Indore NGOs (like <em>Aastha Vriddhashram</em>) if donations match their wishlist, and alerts nearby technicians via WhatsApp.
                </p>
                <div className="pt-2 text-xs text-slate-500 space-y-1.5 border-t border-slate-200">
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
              <div className="pt-6">
                <Link
                  to="/create-id"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Turn on WhatsApp Alerts →</span>
                </Link>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF9F6] border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    03
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                    STEP THREE
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                  Direct Handshake & 0% Commission
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Call or WhatsApp directly. Meet at your college gate, hostel, or home. Hand over items, verify repairs on-site, and pay directly with zero platform cut.
                </p>
                <div className="pt-2 text-xs text-slate-500 space-y-1.5 border-t border-slate-200">
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
              <div className="pt-6">
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

      {/* 4. VERIFIED INDORE DIRECTORY PREVIEW (REAL ORGANIZATIONS & WORKERS) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-16 lg:py-20 bg-[#FAF9F6] border-b border-slate-200">
        <div className="max-w-[1560px] mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>INDORE CIVIC DIRECTORY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Verified Shelters, Technicians & Campus Deals
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Active community nodes operating daily across Indore.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/donate"
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                View All Shelters
              </Link>
              <Link
                to="/services"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Browse Technicians
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Verified Shelters */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-600" />
                    <h3 className="font-bold text-sm text-slate-900">Shelters & Old Age Homes</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    VERIFIED
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Aastha Vriddhashram</span>
                      <span className="text-[10px] text-slate-500">Old Palasia</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Home to 18 elderly residents without immediate family.</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700">
                        Blankets & Shawls
                      </span>
                      <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700">
                        Walking Sticks
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Snehalaya Bal Sadan</span>
                      <span className="text-[10px] text-slate-500">Vijay Nagar</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Care and schooling for 42 destitute and orphaned children.</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700">
                        School Bags
                      </span>
                      <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700">
                        Winter Sweaters
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Annapurna Roti Bank</span>
                      <span className="text-[10px] text-slate-500">Chhappan Dukan</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Collecting safe surplus food from hostels & family events.</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700">
                        Fresh Cooked Meals
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/donate"
                className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center justify-between pt-3 border-t border-slate-100"
              >
                <span>Donate to Shelters</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Column 2: Verified Local Technicians */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-emerald-700" />
                    <h3 className="font-bold text-sm text-slate-900">Verified Technicians</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    DIRECT CALL
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Rameshwar "Ramesh" Kumar</span>
                      <span className="text-[11px] font-mono font-bold text-slate-900">₹150 visit</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Nal Mistri (Plumber) • 12 yrs in Indore • Palasia</p>
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-bold">
                      <span>⭐ 4.9 (128 reviews)</span>
                      <span>•</span>
                      <span>Tank valves, tap leakage</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Vikram Sharma</span>
                      <span className="text-[11px] font-mono font-bold text-slate-900">₹200 visit</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Bijli Mistri (Electrician) • 9 yrs • Bhawarkua</p>
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-bold">
                      <span>⭐ 4.8 (94 reviews)</span>
                      <span>•</span>
                      <span>Tripping MCB, fan regulator</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Sunil Patidar</span>
                      <span className="text-[11px] font-mono font-bold text-slate-900">₹250 visit</span>
                    </div>
                    <p className="text-[11px] text-slate-600">PC Hardware & Diagnostics • Geeta Bhawan</p>
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-bold">
                      <span>⭐ 4.9 (67 reviews)</span>
                      <span>•</span>
                      <span>SMPS, motherboard, OS recovery</span>
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

            {/* Column 3: Campus Marketplace Deals */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-700" />
                    <h3 className="font-bold text-sm text-slate-900">Campus Marketplace Deals</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    LOW PRICES
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">3rd Year B.Tech CSE Books</span>
                      <span className="text-[11px] font-mono font-bold text-emerald-800">₹350</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Galvin OS, Korth DBMS, Tanenbaum CN • SGSITS Hostel 2</p>
                    <div className="text-[10px] text-slate-400">Original price ₹1,800 • Saved ₹1,450</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Hero Sprint 26T Cycle</span>
                      <span className="text-[11px] font-mono font-bold text-emerald-800">₹1,200</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Single speed, good brakes, front basket • Bhawarkua</p>
                    <div className="text-[10px] text-slate-400">Passing out 4th year senior sale</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Kenstar Room Desert Cooler</span>
                      <span className="text-[11px] font-mono font-bold text-emerald-800">₹1,500</span>
                    </div>
                    <p className="text-[11px] text-slate-600">Submersible pump & motor working • Vijay Nagar</p>
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
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-12 bg-white">
        <div className="max-w-[1560px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="p-4 rounded-xl border border-slate-100 bg-[#FAF9F6] space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Zero Commission</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                100% of money stays directly with students and local workers. No transaction fees.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-[#FAF9F6] space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Direct WhatsApp Alerts</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant pings to registered NGOs and workers when matching items are listed nearby.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-[#FAF9F6] space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Hyperlocal Radius</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect within 0.5 to 3 km inside Indore (Bhawarkua, Palasia, Vijay Nagar, SGSITS).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-[#FAF9F6] space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Verified Identities</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Civic ID verification for shelters, NGOs, and technicians to prevent scams and spam.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
