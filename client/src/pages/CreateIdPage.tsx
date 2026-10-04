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
} from 'lucide-react';

export const CreateIdPage: React.FC = () => {
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const [entityType, setEntityType] = useState<'NGO' | 'SKILLED_WORKER' | 'INDIVIDUAL'>('NGO');

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState('+91 98260 77112');
  const [city, setCity] = useState('Indore');
  const [locality, setLocality] = useState('Old Palasia, Indore');

  // WhatsApp Alert Preferences
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('+91 98260 77112');

  // NGO Specific Fields
  const [ngoCategory, setNgoCategory] = useState('OLD_AGE_HOME');
  const [wishlistTags, setWishlistTags] = useState<string[]>([
    'Winter Clothes',
    'Blankets',
    'Walking Sticks',
  ]);
  const [contactPerson, setContactPerson] = useState('Dr. Meenakshi Joshi');

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
      setEmail(`aastha.${Date.now()}@openhand.org`);
      setContactPerson('Dr. Meenakshi Joshi');
      setPhone('+91 98260 77112');
      setWhatsappNumber('+91 98260 77112');
      setLocality('14/2 Old Palasia, Indore');
      setNgoCategory('OLD_AGE_HOME');
      setWishlistTags(['Winter Clothes', 'Blankets & Quilts', 'Walking Sticks', 'Medical Supplies']);
    } else if (type === 'ELECTRICIAN') {
      setEntityType('SKILLED_WORKER');
      setName('Vikram Sharma');
      setEmail(`vikram.${Date.now()}@openhand.org`);
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
      setEmail(`rameshwar.${Date.now()}@openhand.org`);
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
      // Immediately navigate to the personalized matched opportunities feed!
      navigate('/my-matches');
    } catch (err: any) {
      setError(err.message || 'Failed to create OpenHand ID. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>OpenHand Civic Identity & Automated Alert Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Create Your OpenHand ID
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Register as an <strong>NGO / Shelter</strong> or a <strong>Skilled Technician</strong>.
            We will match suitable items and work orders for you, and automatically ping you on{' '}
            <strong>WhatsApp</strong> whenever something is listed!
          </p>
        </div>

        {/* Quick Demo Pre-fill Bar */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-medium">
            <HeartHandshake className="w-4 h-4 text-emerald-700" />
            <span>Need a quick test? Pre-fill verified Indore profiles:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoFill('NGO')}
              className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 rounded-md transition-colors"
            >
              🏢 Aastha Vriddhashram (NGO)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('ELECTRICIAN')}
              className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 rounded-md transition-colors"
            >
              ⚡ Vikram Sharma (Electrician)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('PLUMBER')}
              className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 rounded-md transition-colors"
            >
              🔧 Rameshwar (Plumber)
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* 1. Entity Type Selection */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              1. CHOOSE ID TYPE
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setEntityType('NGO');
                  if (!name) setName('Aastha Vriddhashram (Old Age Home)');
                }}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  entityType === 'NGO'
                    ? 'border-emerald-700 bg-emerald-50/50 ring-2 ring-emerald-700'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-sm text-slate-900">NGO & Shelter</div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Old Age Home, Orphanage, Food Rescue, Warmth Bank
                  </div>
                </div>
                <div className="mt-3 text-[10px] font-mono text-emerald-700 font-bold">
                  ✓ Wishlist Matches
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEntityType('SKILLED_WORKER');
                  if (!name) setName('Vikram Sharma');
                }}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  entityType === 'SKILLED_WORKER'
                    ? 'border-emerald-700 bg-emerald-50/50 ring-2 ring-emerald-700'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-2 font-bold">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-sm text-slate-900">Skilled Technician</div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Plumber, Electrician, PC Tech, Carpenter, AC/Cooler
                  </div>
                </div>
                <div className="mt-3 text-[10px] font-mono text-blue-700 font-bold">
                  ✓ Work Order Alerts
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEntityType('INDIVIDUAL');
                  if (!name) setName('Rahul Sharma');
                }}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  entityType === 'INDIVIDUAL'
                    ? 'border-emerald-700 bg-emerald-50/50 ring-2 ring-emerald-700'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center mb-2 font-bold">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-sm text-slate-900">Student / Citizen</div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Buy/sell college books, donate surplus, peer support
                  </div>
                </div>
                <div className="mt-3 text-[10px] font-mono text-slate-700 font-bold">
                  ✓ Campus Mesh
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            {/* 2. Specific Configurations Based on Type */}
            {entityType === 'NGO' && (
              <div className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-4">
                <div className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>NGO / Shelter Profile Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aastha Vriddhashram"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={ngoCategory}
                      onChange={(e) => setNgoCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-700"
                    >
                      <option value="OLD_AGE_HOME">Old Age Home (Vriddhashram)</option>
                      <option value="ORPHANAGE">Orphanage & Children Home</option>
                      <option value="FOOD_RESCUE">Food Rescue & Meal Distribution</option>
                      <option value="CLOTH_BANK">Clothes & Warmth Bank</option>
                      <option value="EDUCATION">Student Book Bank & Trust</option>
                    </select>
                  </div>
                </div>

                {/* Wishlist Tags */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    What items does your home/NGO need? (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableWishlistOptions.map((opt) => {
                      const selected = wishlistTags.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleToggleWishlist(opt)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                            selected
                              ? 'bg-emerald-700 text-white border-emerald-700'
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
              <div className="p-4 bg-blue-50/40 border border-blue-200 rounded-xl space-y-4">
                <div className="font-bold text-xs uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-blue-700" />
                  <span>Technician & Trade Skills Profile</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rameshwar Kumar"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Profession / Trade *
                    </label>
                    <select
                      value={primarySkill}
                      onChange={(e) => setPrimarySkill(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                    >
                      <option value="PLUMBER">Plumber & Sanitary (Nal Mistri)</option>
                      <option value="ELECTRICIAN">Certified Electrician (Bijli Mistri)</option>
                      <option value="HARDWARE">PC, Laptop & Hardware Diagnostics</option>
                      <option value="CARPENTER">Carpenter & Woodwork (Badhai Mistri)</option>
                      <option value="APPLIANCE">Cooler & AC Technician</option>
                      <option value="TUTOR">Engineering Peer Tutor / Lab Tinkerer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Standard Inspection / Visit Fee (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-slate-500 font-bold">₹</span>
                      <input
                        type="number"
                        value={visitFee}
                        onChange={(e) => setVisitFee(Number(e.target.value))}
                        placeholder="150"
                        className="w-full pl-7 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Experience / Years Active
                    </label>
                    <input
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g. 10 years in Indore"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specializations & Common Fixes
                  </label>
                  <input
                    type="text"
                    value={workerSpecialization}
                    onChange={(e) => setWorkerSpecialization(e.target.value)}
                    placeholder="e.g. MCB tripping, Havells wiring, fan regulators, geyser valves"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>
            )}

            {/* 3. Common Account & Location Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@openhand.org"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-700"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone / Mobile Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98260 12345"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Indore Locality / Base Area *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Old Palasia / Geeta Bhawan / Bhawarkua / SGSITS Campus"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-700"
                  required
                />
              </div>
            </div>

            {/* 4. WHATSAPP ALERT OPT-IN MODULE (CORE USER REQUIREMENT) */}
            <div className="p-4 bg-emerald-50/80 border-2 border-emerald-600/40 rounded-xl space-y-3">
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
                    <span>Send Me Automated WhatsApp Alerts For Matching Items & Work</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {entityType === 'NGO'
                      ? 'Whenever a donor posts items matching your wishlist (clothes, food, medicine), OpenHand will ping your WhatsApp instantly so you can claim them.'
                      : entityType === 'SKILLED_WORKER'
                      ? 'Whenever someone in your Indore radius reports an issue matching your trade (plumbing, electrical, hardware), OpenHand will send you a WhatsApp work alert with visit details.'
                      : 'Get alerted on WhatsApp when affordable books, gear, or peer support requests are listed nearby.'}
                  </p>
                </label>
              </div>

              {whatsappNotifications && (
                <div className="pl-7 pt-1">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    WhatsApp Mobile Number (With country code +91):
                  </label>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+91 98260 77112"
                    className="w-full sm:w-72 px-3 py-1.5 text-xs bg-white border border-emerald-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                    required={whatsappNotifications}
                  />
                  <div className="text-[10px] text-emerald-800 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Free service • Zero spam • Direct Indore community connections only</span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                to="/login"
                className="text-xs text-slate-600 hover:text-emerald-800 font-medium"
              >
                Already have an OpenHand ID? Sign In
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Creating OpenHand ID...' : 'Generate ID & View Suitable Matches'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
