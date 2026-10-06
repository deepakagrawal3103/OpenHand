import React, { useState } from 'react';
import {
  Wrench,
  Zap,
  Droplets,
  Laptop,
  Hammer,
  Wind,
  Sparkles,
  Phone,
  MessageCircle,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  Plus,
  CheckCircle2,
  X,
  Filter,
  Share2,
  MessageSquare,
} from 'lucide-react';
import { useLocality } from '../context/LocalityContext';
import { WhatsAppShareModal, ShareData } from '../components/ui/WhatsAppShareModal';
import { ReviewModal } from '../components/ui/ReviewModal';

interface ServiceProvider {
  id: string;
  name: string;
  category: 'PLUMBER' | 'ELECTRICIAN' | 'HARDWARE' | 'CARPENTER' | 'APPLIANCE' | 'CLEANING';
  categoryTitle: string;
  rating: number;
  reviewsCount: number;
  visitFee: number;
  experience: string;
  specialization: string;
  phone: string;
  location: string;
  distance: string;
  isAvailableToday: boolean;
  avatarUrl: string;
}

const SERVICE_PROVIDERS: ServiceProvider[] = [
  {
    id: 's-1',
    name: 'Rameshwar "Ramesh" Kumar',
    category: 'PLUMBER',
    categoryTitle: 'Plumber & Sanitary Specialist (Nal Mistri)',
    rating: 4.9,
    reviewsCount: 84,
    visitFee: 150,
    experience: '12 years in Indore',
    specialization: 'Leaking pipe repairs, tap/faucet replacements, geyser inlet connection, overhead Sintex tank valve issues.',
    phone: '+91 98261 78901',
    location: 'Near Geeta Bhawan Square, Indore',
    distance: '0.8 km away',
    isAvailableToday: true,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 's-2',
    name: 'Vikram Sharma',
    category: 'ELECTRICIAN',
    categoryTitle: 'Certified Electrician & Bijli Mistri',
    rating: 4.8,
    reviewsCount: 112,
    visitFee: 200,
    experience: '9 years in Indore',
    specialization: 'MCB breaker tripping, ceiling fan regulator, short circuit diagnosis, Havells/Anchor switchboard wiring.',
    phone: '+91 98263 44556',
    location: 'Palasia Square, Indore',
    distance: '1.2 km away',
    isAvailableToday: true,
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 's-3',
    name: 'Aarav Patel (Campus TechFix)',
    category: 'HARDWARE',
    categoryTitle: 'PC, Laptop & Hardware Diagnostics',
    rating: 5.0,
    reviewsCount: 39,
    visitFee: 150,
    experience: 'SGSITS 3rd Year Student & Hardware Lab Rep',
    specialization: 'PC motherboard boot diagnostics, CMOS cell swap, RAM upgrade, thermal repasting, OS clean installation.',
    phone: '+91 98260 54321',
    location: 'SGSITS Campus & Hostels, Indore',
    distance: '0.3 km away',
    isAvailableToday: true,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 's-4',
    name: 'Mohan Lal Mistri',
    category: 'CARPENTER',
    categoryTitle: 'Carpenter & Furniture Repair (Badhai Mistri)',
    rating: 4.7,
    reviewsCount: 56,
    visitFee: 200,
    experience: '15 years in Navlakha',
    specialization: 'Study table repair, hostel door latch & Godrej lock installation, wooden bed frame reinforcement.',
    phone: '+91 98266 12389',
    location: 'Navlakha Area, Indore',
    distance: '1.9 km away',
    isAvailableToday: false,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 's-5',
    name: 'Sunil Yadav (Indore Climate Care)',
    category: 'APPLIANCE',
    categoryTitle: 'Cooler & AC Technician',
    rating: 4.8,
    reviewsCount: 78,
    visitFee: 250,
    experience: '8 years in Bhawarkua',
    specialization: 'Hostel desert cooler motor rewinding, pump replacement, AC filter deep clean, water leakage fix.',
    phone: '+91 98267 99001',
    location: 'Bhawarkua Square, Indore',
    distance: '2.4 km away',
    isAvailableToday: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
];

interface JobPosting {
  id: string;
  title: string;
  category: string;
  budget: string;
  urgency: 'URGENT_NOW' | 'TODAY' | 'FLEXIBLE';
  requesterName: string;
  requesterContact: string;
  location: string;
  description: string;
  postedAt: string;
}

const INITIAL_JOB_POSTINGS: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Urgent: Washroom sink tap broken & continuous water leakage',
    category: 'PLUMBER',
    budget: '₹200 - ₹300',
    urgency: 'URGENT_NOW',
    requesterName: 'Priya Sharma (Lab Rep)',
    requesterContact: '+91 98260 12345',
    location: 'SGSITS Hostel 3 Ground Floor, Indore',
    description: 'Cold water tap handle broke off and won\'t turn off. Main valve is tight. Need plumber right away.',
    postedAt: '25 min ago',
  },
  {
    id: 'job-2',
    title: 'Ceiling fan making screeching bearing noise in Room 204',
    category: 'ELECTRICIAN',
    budget: '₹250',
    urgency: 'TODAY',
    requesterName: 'Aditya Mehta',
    requesterContact: '+91 98264 55667',
    location: 'Geeta Bhawan Flat #204, Indore',
    description: 'Fan runs very slow with heavy friction sound. Probably needs oiling or capacitor check.',
    postedAt: '1 hour ago',
  },
];

export const ServicesPage: React.FC = () => {
  const {
    selectedLocality,
    radiusKm,
    setRadiusKm,
    currentLocalityInfo,
    getDistanceLabel,
    isWithinRadius,
  } = useLocality();

  const [activeTab, setActiveTab] = useState<'PROVIDERS' | 'POSTED_JOBS'>('PROVIDERS');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState<boolean>(false);
  const [shareModalData, setShareModalData] = useState<ShareData | null>(null);
  const [reviewTarget, setReviewTarget] = useState<{ id: string; name: string; role: string } | null>(null);

  const [waJobToast, setWaJobToast] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>(() => {
    const saved = localStorage.getItem('openhand_service_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOB_POSTINGS;
  });

  const [newJob, setNewJob] = useState({
    title: '',
    category: 'PLUMBER',
    budget: '₹200',
    urgency: 'TODAY' as JobPosting['urgency'],
    requesterName: '',
    requesterContact: '',
    location: 'SGSITS Hostel, Indore',
    description: '',
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title) return;

    const created: JobPosting = {
      id: `job-${Date.now()}`,
      title: newJob.title,
      category: newJob.category,
      budget: newJob.budget || 'Negotiable',
      urgency: newJob.urgency,
      requesterName: newJob.requesterName || 'Indore Resident',
      requesterContact: newJob.requesterContact || '+91 98260 00000',
      location: newJob.location || 'Indore Campus',
      description: newJob.description || 'Service needed as described.',
      postedAt: 'Just now',
    };

    const updated = [created, ...jobs];
    setJobs(updated);
    localStorage.setItem('openhand_service_jobs', JSON.stringify(updated));
    setIsPostJobModalOpen(false);
    setWaJobToast(`WhatsApp Alert Dispatched: Nearby verified ${newJob.category} technicians in Indore have been notified with your work order.`);
    setTimeout(() => setWaJobToast(null), 8000);
    setNewJob({
      title: '',
      category: 'PLUMBER',
      budget: '₹200',
      urgency: 'TODAY',
      requesterName: '',
      requesterContact: '',
      location: 'SGSITS Hostel, Indore',
      description: '',
    });
  };

  const filteredProviders = SERVICE_PROVIDERS.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesLocality = isWithinRadius(p.location);
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLocality && matchesSearch;
  });

  return (
    <div className="bg-[#F8FAFC] text-slate-900 min-h-screen font-sans w-full">
      {/* Automated WhatsApp Alert Toast */}
      {waJobToast && (
        <div className="sticky top-16 z-40 bg-[#075E54] text-white py-3 px-4 shadow-md flex items-center justify-between">
          <div className="max-w-7xl mx-auto flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
            <MessageSquare className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{waJobToast}</span>
          </div>
          <button
            onClick={() => setWaJobToast(null)}
            className="text-white/80 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. HEADER BANNER */}
      <div className="bg-white border-b border-slate-200 py-4 sm:py-8 px-3.5 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1560px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-1.5 sm:mb-3">
              <Wrench className="w-3.5 h-3.5 text-emerald-700" />
              <span>OpenHand Verified Local Services</span>
            </div>
            <h1 className="text-xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Find Trusted Plumbers, Electricians & Technicians
            </h1>
            <p className="text-xs sm:text-base text-slate-600 mt-1 sm:mt-2 max-w-3xl leading-relaxed">
              Tap leaking in hostel? Fan not spinning? PC not booting before exams? Hire verified local workers and technicians nearby with transparent visit fees and zero commission markup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Post a Work Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY TABS & SEARCH */}
      <div className="sticky top-16 z-30 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-slate-200/80 py-3 sm:py-4 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1560px] mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setActiveTab('PROVIDERS')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'PROVIDERS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Verified Mistri ({SERVICE_PROVIDERS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('POSTED_JOBS')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'POSTED_JOBS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Work Requests ({jobs.length})</span>
            </button>
          </div>

          {activeTab === 'PROVIDERS' && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 justify-end">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search plumber, electrician, PC..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-2.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs shrink-0">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Radius:</span>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="accent-emerald-700 cursor-pointer w-16"
                  />
                  <span className="font-bold text-slate-900">{radiusKm} km</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold border border-emerald-200 truncate max-w-[110px]">
                  {currentLocalityInfo.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full">
                {[
                  { id: 'ALL', label: 'All Services' },
                  { id: 'PLUMBER', label: 'Plumber' },
                  { id: 'ELECTRICIAN', label: 'Electrician' },
                  { id: 'HARDWARE', label: 'PC & Tech Fix' },
                  { id: 'CARPENTER', label: 'Carpenter' },
                  { id: 'APPLIANCE', label: 'Cooler & AC' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. TAB 1: SERVICE PROVIDERS LIST */}
      {activeTab === 'PROVIDERS' && (
        <div className="max-w-[1560px] mx-auto px-3.5 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-10 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-900">
              Trusted Local Handymen & Specialists in Indore (~0.5 - 2.5 km)
            </span>
            <span className="hidden sm:inline-block text-emerald-700 font-semibold">Verified ID & Phone • Direct Connect</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 sm:space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={provider.avatarUrl}
                        alt={provider.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h3 className="font-bold text-base text-slate-900 leading-tight">
                          {provider.name}
                        </h3>
                        <span className="text-xs font-semibold text-emerald-800">
                          {provider.categoryTitle}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-900">
                        ₹{provider.visitFee}
                      </div>
                      <span className="text-[10px] text-slate-400 block">Inspection Fee</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-3 mt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Verified Professional</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {provider.experience}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-2">
                    {provider.specialization}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                      {provider.location}
                    </span>
                    <span className="font-bold text-emerald-800 shrink-0 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {getDistanceLabel(provider.location)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShareModalData({
                      title: provider.name,
                      type: 'SERVICE_PROVIDER',
                      price: provider.visitFee,
                      location: provider.location,
                      details: `${provider.categoryTitle} • ${provider.specialization}`,
                      sellerOrContact: provider.phone,
                    })}
                    className="p-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl transition-colors border border-slate-200 shrink-0"
                    title="Share to Hostel or Society WhatsApp Group"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <a
                    href={`tel:${provider.phone}`}
                    className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={`https://wa.me/${provider.phone.replace(/[^0-9]/g, '')}?text=Hi+${encodeURIComponent(provider.name)}%2C+I+found+your+profile+on+OpenHand+Services+and+need+assistance.`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-700" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 2: POSTED WORK REQUESTS */}
      {activeTab === 'POSTED_JOBS' && (
        <div className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-900">
              Citizens and students looking for immediate assistance
            </span>
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="text-emerald-700 font-bold hover:underline"
            >
              + Post New Work Request
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-md uppercase">
                      {job.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{job.postedAt}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900">{job.title}</h3>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      Budget: {job.budget}
                    </span>
                    <span className="text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-200 text-[10px] font-bold uppercase">
                      {job.urgency.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{job.location}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    Posted by: <span className="font-bold text-slate-800">{job.requesterName}</span>
                  </div>
                  <a
                    href={`tel:${job.requesterContact}`}
                    className="px-4 py-2 bg-slate-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Contact / Accept Work</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. POST WORK REQUEST MODAL */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsPostJobModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-mono text-emerald-800 font-bold uppercase tracking-wider">
                COMMUNITY TASK ASSISTANCE
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Post a Work Request
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Describe what you need fixed (plumber, electrician, technician) and connect with someone nearby.
              </p>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">What work do you need? *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Need plumber for bathroom water leakage"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Service Type *</label>
                  <select
                    value={newJob.category}
                    onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-xs font-medium"
                  >
                    <option value="PLUMBER">Plumber / Water</option>
                    <option value="ELECTRICIAN">Electrician / Wiring</option>
                    <option value="HARDWARE">PC / Electronics Repair</option>
                    <option value="CARPENTER">Carpenter / Woodwork</option>
                    <option value="APPLIANCE">Cooler & AC Fix</option>
                    <option value="CLEANING">Cleaning & Maid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Expected Budget</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹200"
                    value={newJob.budget}
                    onChange={(e) => setNewJob({ ...newJob, budget: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Urgency</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['URGENT_NOW', 'TODAY', 'FLEXIBLE'] as const).map((urg) => (
                    <button
                      type="button"
                      key={urg}
                      onClick={() => setNewJob({ ...newJob, urgency: urg })}
                      className={`py-2 rounded-lg text-[11px] font-bold border transition-all ${
                        newJob.urgency === urg
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {urg.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Details & Problem Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue, room number, or specific tools required..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newJob.requesterName}
                    onChange={(e) => setNewJob({ ...newJob, requesterName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98260 XXXXX"
                    value={newJob.requesterContact}
                    onChange={(e) => setNewJob({ ...newJob, requesterContact: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Exact Address / Campus Area</label>
                <input
                  type="text"
                  placeholder="e.g. SGSITS Hostel 2, Room 108, Indore"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPostJobModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Post Work Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Community Share Modal */}
      {shareModalData && (
        <WhatsAppShareModal
          isOpen={!!shareModalData}
          onClose={() => setShareModalData(null)}
          data={shareModalData}
        />
      )}

      {/* Trust Endorsement Review Modal */}
      {reviewTarget && (
        <ReviewModal
          isOpen={!!reviewTarget}
          onClose={() => setReviewTarget(null)}
          targetId={reviewTarget.id}
          targetName={reviewTarget.name}
          targetRole={reviewTarget.role}
        />
      )}
    </div>
  );
};
