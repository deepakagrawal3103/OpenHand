import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Wrench,
  User as UserIcon,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  Phone,
  Coins,
  HeartHandshake,
  QrCode,
  Check,
  Star,
  Zap,
} from 'lucide-react';

export const CreateIdPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [entityType, setEntityType] = useState<'NGO' | 'SKILLED_WORKER' | 'INDIVIDUAL'>('NGO');

  // Common Fields
  const [name, setName] = useState('Aastha Vriddhashram (Old Age Home)');
  const [email, setEmail] = useState(`shelter.${Date.now().toString().slice(-4)}@openhand.org`);
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState('+91 98260 77112');
  const [city, setCity] = useState('Indore');
  const [locality, setLocality] = useState('14/2 Old Palasia, Indore');

  // WhatsApp Alert Preferences
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('+91 98260 77112');

  // NGO Specific Fields
  const [ngoCategory, setNgoCategory] = useState('OLD_AGE_HOME');
  const [wishlistTags, setWishlistTags] = useState<string[]>([
    'Winter Clothes',
    'Blankets & Quilts',
    'Walking Sticks',
  ]);

  // Skilled Worker Specific Fields
  const [primarySkill, setPrimarySkill] = useState('PLUMBER');
  const [visitFee, setVisitFee] = useState<number>(150);
  const [experience, setExperience] = useState('10 years in Indore');
  const [workerSpecialization, setWorkerSpecialization] = useState(
    'Leaking pipes, tap replacements, Sintex tank valves'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableWishlistOptions = [
    'Winter Clothes',
    'Blankets & Quilts',
    'Cooked Food / Ration',
    'Walking Sticks',
    'Medical Supplies',
    'Engineering Books',
    'School Bags',
    'Wheelchairs',
  ];

  const handleToggleWishlist = (tag: string) => {
    if (wishlistTags.includes(tag)) {
      setWishlistTags(wishlistTags.filter((t) => t !== tag));
    } else {
      setWishlistTags([...wishlistTags, tag]);
    }
  };

  const handleQuickDemoFill = (type: 'NGO' | 'ELECTRICIAN' | 'PLUMBER') => {
    if (type === 'NGO') {
      setEntityType('NGO');
      setName('Aastha Vriddhashram (Old Age Home)');
      setEmail(`aastha.${Date.now().toString().slice(-4)}@openhand.org`);
      setPhone('+91 98260 77112');
      setWhatsappNumber('+91 98260 77112');
      setLocality('14/2 Old Palasia, Indore');
      setNgoCategory('OLD_AGE_HOME');
      setWishlistTags(['Winter Clothes', 'Blankets & Quilts', 'Walking Sticks', 'Medical Supplies']);
    } else if (type === 'ELECTRICIAN') {
      setEntityType('SKILLED_WORKER');
      setName('Vikram Sharma');
      setEmail(`vikram.${Date.now().toString().slice(-4)}@openhand.org`);
      setPhone('+91 98263 44556');
      setWhatsappNumber('+91 98263 44556');
      setLocality('Palasia Square, Indore');
      setPrimarySkill('ELECTRICIAN');
      setVisitFee(200);
      setExperience('9 years in Indore');
      setWorkerSpecialization('MCB breaker tripping, Havells wiring, fan regulators, short circuits');
    } else {
      setEntityType('SKILLED_WORKER');
      setName('Rameshwar "Ramesh" Kumar');
      setEmail(`rameshwar.${Date.now().toString().slice(-4)}@openhand.org`);
      setPhone('+91 98261 78901');
      setWhatsappNumber('+91 98261 78901');
      setLocality('Near Geeta Bhawan, Indore');
      setPrimarySkill('PLUMBER');
      setVisitFee(150);
      setExperience('12 years in Indore');
      setWorkerSpecialization('Leaking pipes, tap replacements, Sintex tank valves, geyser inlets');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        name: name.trim() || (entityType === 'NGO' ? 'Indore Community Care' : 'OpenHand Member'),
        email: email.trim() || `user.${Date.now()}@openhand.org`,
        password,
        phone,
        city,
        entityType,
        whatsappNotifications,
        whatsappNumber: whatsappNotifications ? (whatsappNumber || phone) : undefined,
      };

      if (entityType === 'NGO') {
        payload.role = 'ORGANIZATION';
        payload.ngoCategory = ngoCategory;
        payload.wishlistTags = wishlistTags.join(', ');
        payload.bio = `${name} • Verified Shelter/NGO in ${locality}. Wishlist: ${wishlistTags.join(', ')}`;
      } else if (entityType === 'SKILLED_WORKER') {
        payload.role = 'HELPER';
        payload.primarySkill = primarySkill;
        payload.visitFee = Number(visitFee) || 150;
        payload.bio = `${primarySkill} specialist (${experience}). ${workerSpecialization}`;
        payload.skills = [primarySkill, 'General Diagnostics'];
      } else {
        payload.role = 'USER';
        payload.bio = `Indore campus student & community member (${locality})`;
      }

      await signup(payload);
      navigate('/my-matches');
    } catch (err: any) {
      setError(err.message || 'Failed to create OpenHand ID. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-6 sm:py-10 px-3.5 sm:px-6 lg:px-8 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-6xl mx-auto space-y-5 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Indore Civic Directory & Direct WhatsApp Notifications</span>
          </div>
          <h1 className="text-2xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Create Your Indore Civic ID
          </h1>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            Register as a <strong>Verified NGO/Shelter</strong> or a <strong>Skilled Technician</strong>.
            We match incoming donation items or repair orders and ping your phone directly on{' '}
            <strong className="text-emerald-800">WhatsApp</strong> in real-time.
          </p>
        </div>

        {/* Quick Demo Pre-fill Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 text-xs">
          <div className="flex items-center gap-2 sm:gap-2.5 text-slate-700 font-medium">
            <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <span><strong>1-Click Indore Pre-fills:</strong> Test instantaneous matching without typing</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoFill('NGO')}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold border border-emerald-200 rounded-xl transition-all shadow-2xs flex items-center gap-1 text-[11px] sm:text-xs"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Aastha Vriddhashram (NGO)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('ELECTRICIAN')}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold border border-blue-200 rounded-xl transition-all shadow-2xs flex items-center gap-1 text-[11px] sm:text-xs"
            >
              <Zap className="w-3.5 h-3.5 text-blue-700" />
              <span>Vikram Sharma (Electrician)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('PLUMBER')}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200 rounded-xl transition-all shadow-2xs flex items-center gap-1 text-[11px] sm:text-xs"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-700" />
              <span>Rameshwar (Plumber)</span>
            </button>
          </div>
        </div>

        {/* 2-Column Suite: Left Form + Right Live Holographic ID Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
          {/* Left Form: 7 cols */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
                {error}
              </div>
            )}

            {/* Entity Type Selection */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
                1. SELECT IDENTITY PROFILE
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEntityType('NGO');
                    if (!name) setName('Aastha Vriddhashram (Old Age Home)');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    entityType === 'NGO'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-600/30'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2.5 font-bold">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-sm text-slate-900">Shelter / NGO</div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Old Age Home, Children Shelter, Food Bank
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Wishlist Alerts</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEntityType('SKILLED_WORKER');
                    if (!name) setName('Vikram Sharma');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    entityType === 'SKILLED_WORKER'
                      ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-600/30'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-2.5 font-bold">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-sm text-slate-900">Technician</div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Plumber, Electrician, Hardware Tech
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] font-mono text-blue-700 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Work Orders</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEntityType('INDIVIDUAL');
                    if (!name) setName('Rahul Sharma');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    entityType === 'INDIVIDUAL'
                      ? 'border-slate-800 bg-slate-100 shadow-sm ring-2 ring-slate-800/30'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center mb-2.5 font-bold">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-sm text-slate-900">Student / Citizen</div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                      College peer exchange & local lending
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] font-mono text-slate-700 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Peer Network</span>
                  </div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type-Specific Fields */}
              {entityType === 'NGO' && (
                <div className="p-4 sm:p-5 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-4">
                  <div className="font-bold text-xs uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <span>Shelter Profile & Urgent Wishlist</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Shelter / NGO Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aastha Vriddhashram"
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Shelter Category
                      </label>
                      <select
                        value={ngoCategory}
                        onChange={(e) => setNgoCategory(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      >
                        <option value="OLD_AGE_HOME">Old Age Home (Vriddhashram)</option>
                        <option value="ORPHANAGE">Orphanage & Children Home</option>
                        <option value="FOOD_RESCUE">Food Rescue & Meal Bank</option>
                        <option value="CLOTH_BANK">Clothes & Warmth Bank</option>
                        <option value="EDUCATION">Student Book Bank & Trust</option>
                      </select>
                    </div>
                  </div>

                  {/* Wishlist Chips */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Needed Item Tags (OpenHand will ping your WhatsApp when these are listed):
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {availableWishlistOptions.map((opt) => {
                        const selected = wishlistTags.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleToggleWishlist(opt)}
                            className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
                              selected
                                ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs font-semibold'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {selected ? '✓ ' : '+ '}
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {entityType === 'SKILLED_WORKER' && (
                <div className="p-4 sm:p-5 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-4">
                  <div className="font-bold text-xs uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-blue-700" />
                    <span>Technician Trade & Rates</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Technician Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rameshwar Kumar"
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Primary Trade / Specialty *
                      </label>
                      <select
                        value={primarySkill}
                        onChange={(e) => setPrimarySkill(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      >
                        <option value="PLUMBER">Plumber (Nal Mistri)</option>
                        <option value="ELECTRICIAN">Certified Electrician (Bijli Mistri)</option>
                        <option value="HARDWARE">PC, Laptop & Hardware Diagnostics</option>
                        <option value="CARPENTER">Carpenter (Badhai Mistri)</option>
                        <option value="APPLIANCE">Cooler & Geyser Repair</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Standard Inspection Fee (₹)
                      </label>
                      <input
                        type="number"
                        value={visitFee}
                        onChange={(e) => setVisitFee(Number(e.target.value))}
                        placeholder="150"
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Experience
                      </label>
                      <input
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g. 10 years in Indore"
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Key Repair Capabilities
                    </label>
                    <input
                      type="text"
                      value={workerSpecialization}
                      onChange={(e) => setWorkerSpecialization(e.target.value)}
                      placeholder="e.g. MCB tripping, Havells wiring, Sintex tank valves"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* Common Location & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Indore Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operating Locality / Indore Sector *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Old Palasia / Bhawarkua / SGSITS Campus"
                    className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    required
                  />
                </div>
              </div>

              {/* Automated WhatsApp Opt-In Module */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 border-2 border-emerald-500/40 rounded-2xl space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="wa_opt_in"
                    checked={whatsappNotifications}
                    onChange={(e) => setWhatsappNotifications(e.target.checked)}
                    className="mt-1 w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600"
                  />
                  <label htmlFor="wa_opt_in" className="cursor-pointer">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-base">📲</span>
                      <span>Instant Automated WhatsApp Alerts</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Receive immediate ping whenever a matching item or request is published in your Indore sector.
                    </p>
                  </label>
                </div>

                {whatsappNotifications && (
                  <div className="pl-7 pt-1">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      WhatsApp Mobile Number:
                    </label>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+91 98260 77112"
                      className="w-full sm:w-72 px-3 py-1.5 text-xs bg-white border border-emerald-400 rounded-xl focus:outline-none font-mono"
                      required={whatsappNotifications}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link to="/login" className="text-xs text-slate-500 hover:text-emerald-800 font-medium">
                  Already registered? Sign In
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs rounded-xl shadow-[0_4px_14px_rgba(4,120,87,0.3)] transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <span>{loading ? 'Generating OpenHand ID...' : 'Generate Civic ID & View Live Matches'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Preview: 5 cols - Live Hologram Civic ID Card */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>LIVE DIGITAL IDENTITY PREVIEW</span>
            </div>

            {/* Premium Digital ID Card */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-6 text-white border border-slate-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all">
              {/* Background ambient mesh */}
              <div className="absolute inset-0 bg-radar-grid opacity-25 pointer-events-none" />
              <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold text-sm">
                    🤝
                  </div>
                  <div>
                    <div className="font-extrabold text-sm tracking-tight text-white">OPENHAND CIVIC ID</div>
                    <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                      Indore Verified Member
                    </div>
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono font-bold text-emerald-300">
                  VERIFIED
                </div>
              </div>

              {/* Card Body */}
              <div className="relative z-10 py-5 space-y-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {entityType === 'NGO' ? 'ORGANIZATION NAME' : entityType === 'SKILLED_WORKER' ? 'VERIFIED TECHNICIAN' : 'COMMUNITY MEMBER'}
                  </div>
                  <div className="text-lg font-black text-white truncate">
                    {name || 'Your Profile Name'}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{locality || 'Indore'}</span>
                </div>

                {entityType === 'NGO' && (
                  <div className="pt-2">
                    <div className="text-[10px] font-mono uppercase text-slate-400 mb-1.5">
                      ACTIVE WISHLIST ITEMS
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {wishlistTags.length > 0 ? (
                        wishlistTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-semibold text-emerald-200"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">No tags selected</span>
                      )}
                    </div>
                  </div>
                )}

                {entityType === 'SKILLED_WORKER' && (
                  <div className="pt-2 flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/10">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">TRADE</div>
                      <div className="text-xs font-bold text-white">{primarySkill}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-slate-400">VISIT FEE</div>
                      <div className="text-xs font-bold text-emerald-400">₹{visitFee}</div>
                    </div>
                  </div>
                )}

                {whatsappNotifications && (
                  <div className="pt-2 flex items-center justify-between text-[11px] text-emerald-300 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/30">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span>📲 WhatsApp Alert:</span>
                      <span className="font-mono">{whatsappNumber}</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Card Footer: Identity verification badge */}
              <div className="relative z-10 pt-3 border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Civic Verified</span>
                </div>
                <span>ID: OH-{Math.abs(locality.length * 8274).toString().padStart(6, '0')}</span>
              </div>
            </div>

            {/* Trust badge below card */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1.5 shadow-2xs">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Brokerage Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                OpenHand never charges commission on trades or donations. Registered IDs receive priority matching and direct contact buttons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
