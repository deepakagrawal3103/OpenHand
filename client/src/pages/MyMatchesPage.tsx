import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Building2,
  Wrench,
  User as UserIcon,
  MessageSquare,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Bell,
  Sliders,
  Send,
  X,
  Copy,
  ChevronRight,
} from 'lucide-react';

interface MatchedOpportunity {
  id: string;
  type: 'DONATION' | 'WORK_ORDER' | 'MARKETPLACE';
  title: string;
  category: string;
  matchScore: number;
  matchReason: string;
  location: string;
  distance: string;
  contactPerson: string;
  contactPhone: string;
  urgency?: 'HIGH' | 'MEDIUM' | 'LOW';
  fee?: number;
  description: string;
  postedAt: string;
}

export const MyMatchesPage: React.FC = () => {
  const { user, switchPersona } = useAuth();
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState<MatchedOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('ALL');

  // WhatsApp Alert Modal State
  const [selectedAlertItem, setSelectedAlertItem] = useState<MatchedOpportunity | null>(null);
  const [waModalOpen, setWaModalOpen] = useState<boolean>(false);
  const [waAlertSuccess, setWaAlertSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Profile preferences state
  const [waEnabled, setWaEnabled] = useState<boolean>(user?.whatsappNotifications ?? true);
  const [waPhone, setWaPhone] = useState<string>(user?.whatsappNumber || user?.phone || '+91 98260 77112');
  const [updatingSettings, setUpdatingSettings] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setWaEnabled(user.whatsappNotifications ?? true);
      setWaPhone(user.whatsappNumber || user.phone || '+91 98260 77112');
    }
  }, [user]);

  // Generate canonical matched items based on logged in user's profile
  useEffect(() => {
    setLoading(true);

    const isNgo = user?.entityType === 'NGO' || user?.role === 'ORGANIZATION';
    const isWorker = user?.entityType === 'SKILLED_WORKER' || user?.role === 'HELPER';

    let matched: MatchedOpportunity[] = [];

    if (isNgo) {
      matched = [
        {
          id: 'match-ngo-1',
          type: 'DONATION',
          title: '6 Clean Woolen Sweaters + 2 Quilts',
          category: 'CLOTHES & WARMTH',
          matchScore: 98,
          matchReason: 'Matches your wishlist: Winter Shawls, Blankets & Quilts',
          location: 'New Palasia, Indore',
          distance: '1.2 km away',
          contactPerson: 'Ananya Roy',
          contactPhone: '+91 98261 22334',
          urgency: 'HIGH',
          description: 'Gently used winter wear in clean, washed condition. Ready for pickup by any old age home or shelter volunteer.',
          postedAt: '3 hours ago',
        },
        {
          id: 'match-ngo-2',
          type: 'DONATION',
          title: 'Surplus 25 Fresh Lunch Boxes from Tech Symposium',
          category: 'FOOD RESCUE',
          matchScore: 95,
          matchReason: 'Matches your wishlist: Cooked Meal Rescue & Rations',
          location: 'SGSITS CS Auditorium, Indore',
          distance: '0.8 km away',
          contactPerson: 'CSI Student Chapter (Karan)',
          contactPhone: '+91 98269 55667',
          urgency: 'HIGH',
          description: 'Freshly packed vegetarian pulao, paneer sabzi and roti packs. Need immediate pickup within 90 minutes.',
          postedAt: '1 hour ago',
        },
        {
          id: 'match-ngo-3',
          type: 'DONATION',
          title: 'Senior Citizen Aluminum Walker with Wheels',
          category: 'GERIATRIC MEDICAL',
          matchScore: 94,
          matchReason: 'Matches your wishlist: Walking Sticks & Elderly Mobility Aids',
          location: 'Manorama Ganj, Indore',
          distance: '1.8 km away',
          contactPerson: 'Rameshwar Ji',
          contactPhone: '+91 98263 88123',
          urgency: 'MEDIUM',
          description: 'Fully functional, lightweight height-adjustable walker. Willing to donate directly to an elderly resident.',
          postedAt: 'Yesterday',
        },
      ];
    } else if (isWorker) {
      const skill = user?.primarySkill || 'HARDWARE';
      matched = [
        {
          id: 'match-work-1',
          type: 'WORK_ORDER',
          title: '12 Lab PCs Won’t Boot Before Term Practical Exam',
          category: 'HARDWARE & DIAGNOSTICS',
          matchScore: 96,
          matchReason: 'Matches your verified skill: Hardware, Motherboard & CMOS Diagnostics',
          location: 'College Lab 3, SGSITS CS Wing, Indore',
          distance: '0.4 km away',
          contactPerson: 'Priya Sharma (Lab Rep)',
          contactPhone: '+91 98260 12345',
          urgency: 'HIGH',
          fee: 150,
          description: 'Fans spin for 2 seconds and shut off. 14 students blocked. Suspected CMOS battery swap and BIOS reset needed.',
          postedAt: '18 mins ago',
        },
        {
          id: 'match-work-2',
          type: 'WORK_ORDER',
          title: 'Hostel 2 4th Floor Overhead Water Pipe Leaking Continuously',
          category: 'PLUMBING & SANITARY',
          matchScore: 92,
          matchReason: 'Matches your trade: Plumber (Nal Mistri) & Sintex Tank Valve Fixes',
          location: 'SGSITS Hostel 2, Indore',
          distance: '0.5 km away',
          contactPerson: 'Hostel Warden / Student Rep',
          contactPhone: '+91 98261 78901',
          urgency: 'HIGH',
          fee: 200,
          description: 'Water dripping heavily from ceiling joint onto electrical conduit. Need pipe sealing and washer replacement.',
          postedAt: '45 mins ago',
        },
        {
          id: 'match-work-3',
          type: 'WORK_ORDER',
          title: 'Electronics Lab Main MCB Tripping Under Load',
          category: 'ELECTRICAL & WIRING',
          matchScore: 91,
          matchReason: 'Matches your trade: Electrician (Bijli Mistri) & Short Circuit Diagnosis',
          location: 'ECE Department, SGSITS, Indore',
          distance: '0.6 km away',
          contactPerson: 'Prof. Verma / Lab Staff',
          contactPhone: '+91 98263 44556',
          urgency: 'MEDIUM',
          fee: 200,
          description: '32A MCB trips every time 4 soldering stations are turned on together. Neutral line check required.',
          postedAt: '2 hours ago',
        },
      ];
    } else {
      // General Student / Citizen
      matched = [
        {
          id: 'match-item-1',
          type: 'MARKETPLACE',
          title: 'Casio fx-991ES Plus 2nd Edition Scientific Calculator',
          category: 'COLLEGE ELECTRONICS',
          matchScore: 94,
          matchReason: 'Discounted student gear (₹499 vs ₹1495 original) near your hostel',
          location: 'Geeta Bhawan Square, Indore',
          distance: '1.1 km away',
          contactPerson: 'Neha Sen',
          contactPhone: '+91 98263 11223',
          urgency: 'LOW',
          fee: 499,
          description: 'Used for 1 semester in SGSITS. Fresh battery installed. Approved for RGPV exams and GATE preparation.',
          postedAt: '4 hours ago',
        },
        {
          id: 'match-item-2',
          type: 'MARKETPLACE',
          title: 'Complete 3rd Year B.Tech CS Books (Operating Systems, DBMS, CN)',
          category: 'ACADEMIC BOOKS',
          matchScore: 92,
          matchReason: 'Affordable semester bundle with previous year question papers',
          location: 'SGSITS Hostel 2, Indore',
          distance: '0.4 km away',
          contactPerson: 'Rahul Verma',
          contactPhone: '+91 98261 45678',
          urgency: 'MEDIUM',
          fee: 350,
          description: 'Galvin OS, Korth DBMS, and Tanenbaum Computer Networks. Highlighted with exam notes and previous year question bank included.',
          postedAt: '2 hours ago',
        },
      ];
    }

    setOpportunities(matched);
    setLoading(false);
  }, [user]);

  const handleToggleWhatsApp = async () => {
    setUpdatingSettings(true);
    const newVal = !waEnabled;
    setWaEnabled(newVal);
    try {
      await api.updateProfile({
        whatsappNotifications: newVal,
        whatsappNumber: waPhone,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingSettings(false);
    }
  };

  const handleOpenWhatsAppAlert = (item: MatchedOpportunity) => {
    setSelectedAlertItem(item);
    setWaModalOpen(true);
    setWaAlertSuccess(true);
    setCopied(false);
  };

  const generateWhatsAppMessage = (item: MatchedOpportunity) => {
    const isNgo = user?.entityType === 'NGO' || user?.role === 'ORGANIZATION';
    const isWorker = user?.entityType === 'SKILLED_WORKER' || user?.role === 'HELPER';

    if (isNgo) {
      return `🙏 *OpenHand Indore Alert*\nNamaste ${user?.name || 'Director Ji'},\nA new donation matching your NGO wishlist has been posted!\n\n📦 *Item:* ${item.title}\n📍 *Location:* ${item.location} (${item.distance})\n👤 *Donor:* ${item.contactPerson} (${item.contactPhone})\n💡 *Why Matched:* ${item.matchReason}\n\n👉 OpenHand Details: http://localhost:5173/donate\nPlease claim or coordinate pickup directly.`;
    } else if (isWorker) {
      return `🔧 *OpenHand Work Alert*\nNamaste ${user?.name || 'Mistri Ji'},\nA new repair job matching your skills was just posted nearby!\n\n🔨 *Task:* ${item.title}\n📍 *Location:* ${item.location} (${item.distance})\n💰 *Visit Fee:* ₹${item.fee || 150}\n👤 *Requester:* ${item.contactPerson} (${item.contactPhone})\n\n👉 Accept or view ticket: http://localhost:5173/services\nCall or reply to confirm visit!`;
    } else {
      return `📢 *OpenHand Community Alert*\nNamaste ${user?.name || 'Friend'},\nA new listing matching your interests was posted nearby:\n🏷️ *${item.title}*\n📍 *Location:* ${item.location}\n💰 *Price:* ₹${item.fee || 'Free'}\n👤 *Contact:* ${item.contactPerson} (${item.contactPhone})\n\n👉 View listing: http://localhost:5173/marketplace`;
    }
  };

  const cleanWaNumber = (waPhone || '+919826077112').replace(/[^0-9]/g, '');

  if (!user) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen py-16 px-4 flex items-center justify-center font-sans">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-md text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-2xl font-bold">
            🎯
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Sign In to View Your Matched Feed</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your personalized feed shows donations matching your NGO wishlist or repair jobs matching your trade skills.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              ONE-CLICK DEMO SIGN IN
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => switchPersona('priya')}
                className="py-2 px-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-800 rounded-lg transition-colors"
              >
                Priya (Student)
              </button>
              <button
                type="button"
                onClick={() => switchPersona('aarav')}
                className="py-2 px-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-800 rounded-lg transition-colors"
              >
                Aarav (Tech Helper)
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Link
              to="/login"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
            >
              Sign In with Account
            </Link>
            <Link
              to="/create-id"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
            >
              Create New OpenHand ID
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 font-sans">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
        {/* Top Breadcrumb & Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Link to="/" className="hover:text-emerald-800">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Personalized Feed</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Quick Test Personas:</span>
            <button
              onClick={() => switchPersona('priya')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded font-semibold text-slate-700 transition-colors"
            >
              Priya (Requester)
            </button>
            <button
              onClick={() => switchPersona('aarav')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded font-semibold text-slate-700 transition-colors"
            >
              Aarav (Tech Helper)
            </button>
            <Link
              to="/create-id"
              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold transition-colors"
            >
              + Create New ID
            </Link>
          </div>
        </div>

        {/* 1. CIVIC ID CARD HEADER */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-2xl shrink-0">
                {user?.entityType === 'NGO' || user?.role === 'ORGANIZATION' ? (
                  <Building2 className="w-7 h-7" />
                ) : user?.entityType === 'SKILLED_WORKER' || user?.role === 'HELPER' ? (
                  <Wrench className="w-7 h-7" />
                ) : (
                  <UserIcon className="w-7 h-7" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900">
                    {user?.name || 'Aastha Vriddhashram (Old Age Home)'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {user?.entityType === 'NGO' || user?.role === 'ORGANIZATION'
                      ? '🏢 Verified Indore NGO'
                      : user?.entityType === 'SKILLED_WORKER' || user?.role === 'HELPER'
                      ? `🔧 Certified ${user?.primarySkill || 'Technician'}`
                      : '👤 Campus Member'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user?.city || 'Indore'} Area</span>
                  </span>
                  <span>•</span>
                  <span>{user?.email || 'aastha@openhand.org'}</span>
                  <span>•</span>
                  <span>Trust Score: <strong>{user?.trustScore || 95}%</strong></span>
                </div>

                {user?.wishlistTags && (
                  <div className="pt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-500">Active Wishlist:</span>
                    {user.wishlistTags.split(',').map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[11px]"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Edit / Switch Profile Button */}
            <Link
              to="/create-id"
              className="px-4 py-2 border border-slate-300 hover:border-slate-400 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Change ID or Skills</span>
            </Link>
          </div>

          {/* WHATSAPP ALERTS STATUS BANNER */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>Automated WhatsApp Alerts:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      waEnabled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {waEnabled ? 'ACTIVE & MONITORED' : 'DISABLED'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  {waEnabled ? (
                    <>
                      Alerts will be dispatched to <strong>{waPhone}</strong> when matching items are listed.
                    </>
                  ) : (
                    'Turn on WhatsApp alerts so you don’t miss urgent items or work orders.'
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleToggleWhatsApp}
                disabled={updatingSettings}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                {waEnabled ? 'Turn Off Alerts' : 'Turn On Alerts'}
              </button>

              {waEnabled && (
                <button
                  type="button"
                  onClick={() => opportunities[0] && handleOpenWhatsAppAlert(opportunities[0])}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>Test WhatsApp Dispatch</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. MATCHED OPPORTUNITIES STREAM */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>REAL-TIME MATCH ENGINE</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Suitable For You in Indore ({opportunities.length})
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              Filtered specifically by your skills, trade, or NGO wishlist. WhatsApp alerts fire automatically when these appear.
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              Matching opportunities nearby...
            </div>
          ) : opportunities.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              No matching listings in your immediate radius right now. Check back shortly!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="bg-white border border-slate-200 hover:border-emerald-500/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-800 border border-slate-200">
                          {opp.category}
                        </span>
                        {opp.urgency === 'HIGH' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">
                            Urgent Needed
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                          🎯 {opp.matchScore}% Compatibility
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">{opp.title}</h3>

                      <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                        {opp.description}
                      </p>
                    </div>

                    {opp.fee !== undefined && (
                      <div className="text-right sm:shrink-0 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                          {opp.type === 'WORK_ORDER' ? 'Visit / Service Fee' : 'Offered Price'}
                        </div>
                        <div className="text-xl font-black text-slate-900">₹{opp.fee}</div>
                      </div>
                    )}
                  </div>

                  {/* Why Matched Tag */}
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-900 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>
                      <strong>Why matched:</strong> {opp.matchReason}
                    </span>
                  </div>

                  {/* Footer Bar with Action & WhatsApp Preview */}
                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{opp.location}</span>
                        <span className="text-slate-400">({opp.distance})</span>
                      </span>
                      <span>•</span>
                      <span>Contact: <strong>{opp.contactPerson}</strong></span>
                      <span>•</span>
                      <span className="text-slate-400">{opp.postedAt}</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {/* WhatsApp Alert Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenWhatsAppAlert(opp)}
                        className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                        <span>📲 WhatsApp Alert</span>
                      </button>

                      {/* Direct Phone / Claim Button */}
                      <a
                        href={`tel:${opp.contactPhone}`}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>
                          {opp.type === 'DONATION'
                            ? 'Claim Donation'
                            : opp.type === 'WORK_ORDER'
                            ? 'Accept Work'
                            : 'Call Seller'}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. INTERACTIVE WHATSAPP DISPATCH PREVIEW MODAL */}
      {waModalOpen && selectedAlertItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            {/* WhatsApp Green Top Header */}
            <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  📱
                </div>
                <div>
                  <h3 className="font-bold text-sm">OpenHand Automated WhatsApp Engine</h3>
                  <p className="text-[11px] text-emerald-100">
                    Real-time community notification dispatch
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWaModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 bg-[#EFEAE2]">
              <div className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-200">
                To: <strong>{user?.name}</strong> at WhatsApp Number{' '}
                <strong className="text-emerald-800">{waPhone}</strong>
              </div>

              {/* Chat Bubble Presentation */}
              <div className="bg-white rounded-xl rounded-tl-none p-4 shadow-sm border border-slate-200 space-y-2 text-xs text-slate-800 leading-relaxed font-sans">
                <div className="whitespace-pre-line">
                  {generateWhatsAppMessage(selectedAlertItem)}
                </div>
                <div className="text-right text-[10px] text-slate-400 pt-1 font-mono">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                </div>
              </div>

              <div className="text-[11px] text-slate-600 text-center">
                This automated WhatsApp ping is dispatched immediately whenever an item matching your parameters is posted anywhere in Indore.
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generateWhatsAppMessage(selectedAlertItem));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied Text!' : 'Copy Alert Text'}</span>
              </button>

              <a
                href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                  generateWhatsAppMessage(selectedAlertItem)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Open in Real WhatsApp (wa.me)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
