import React, { useState } from 'react';
import {
  Heart,
  Building2,
  Users,
  MapPin,
  Phone,
  ArrowRight,
  Plus,
  Gift,
  Search,
  CheckCircle2,
  X,
  Share2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface NGOOrganization {
  id: string;
  name: string;
  type: 'OLD_AGE_HOME' | 'ORPHANAGE' | 'FOOD_RESCUE' | 'CLOTH_BANK' | 'EDUCATION';
  categoryLabel: string;
  location: string;
  distance: string;
  inmatesCount: string;
  contactPerson: string;
  phone: string;
  urgentNeeds: string[];
  description: string;
  imageUrl: string;
  verified: boolean;
}

const NGOS_DATA: NGOOrganization[] = [
  {
    id: 'ngo-1',
    name: 'Aastha Vriddhashram (Old Age Home)',
    type: 'OLD_AGE_HOME',
    categoryLabel: 'Old Age Home',
    location: '14/2 Old Palasia, Near Anand Bazaar, Indore',
    distance: '1.4 km away',
    inmatesCount: '48 Senior Residents',
    contactPerson: 'Dr. Meenakshi Joshi',
    phone: '+91 98260 77112',
    urgentNeeds: ['Winter Shawls & Blankets', 'Adult Incontinence Pads', 'Walking Sticks', 'Digestive Medicines'],
    description: 'Provides loving shelter, free medical monitoring, and geriatric care to abandoned and destitute senior citizens.',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=700&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 'ngo-2',
    name: 'Sneha Bal Sadan Orphanage & Child Care',
    type: 'ORPHANAGE',
    categoryLabel: 'Orphanage & Children',
    location: 'Bhawarkua Main Road, Near IT Park, Indore',
    distance: '2.1 km away',
    inmatesCount: '62 Children (Ages 4-16)',
    contactPerson: 'Father Joseph / Sunita Sister',
    phone: '+91 98262 44990',
    urgentNeeds: ['Notebooks & Geometry Kits', 'School Bags', 'Indoor Board Games', 'Healthy Snacks & Milk Powders'],
    description: 'Nurturing shelter and formal schooling support for orphaned and underprivileged young girls and boys.',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 'ngo-3',
    name: 'Robin Hood Army Indore (Surplus Food Rescue)',
    type: 'FOOD_RESCUE',
    categoryLabel: 'Food Rescue & Feeding',
    location: 'Indore Citywide Volunteers (SGSITS & Regal Square Node)',
    distance: '0.8 km away',
    inmatesCount: 'Serves 400+ daily meals',
    contactPerson: 'Karan Agrawal (Student Lead)',
    phone: '+91 98268 00341',
    urgentNeeds: ['Hostel Mess Surplus Food', 'Cooked Event Catering Food', 'Raw Rice & Wheat Bags'],
    description: 'Volunteer-driven academy that collects untouched surplus food from student messes, weddings, and cafeterias to feed needy children within 90 minutes.',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=700&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 'ngo-4',
    name: 'Goonj Cloth & Warmth Collection Center',
    type: 'CLOTH_BANK',
    categoryLabel: 'Clothes & Warmth Bank',
    location: 'Geeta Bhawan Road, Navlakha Area, Indore',
    distance: '1.2 km away',
    inmatesCount: 'Distributes to 20+ Slum Clusters',
    contactPerson: 'Vikram Choudhary',
    phone: '+91 98264 88771',
    urgentNeeds: ['Clean Woolen Sweaters', 'Jackets & Hoodies', 'Clean Bedsheets', 'Dry Ration Packets'],
    description: 'Channels clean surplus clothes, woolen garments, and essential materials from urban households to families in need with dignity.',
    imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?w=700&auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 'ngo-5',
    name: 'SGSITS Student Book Bank & Library Trust',
    type: 'EDUCATION',
    categoryLabel: 'Education & Student Support',
    location: 'SGSITS Central Campus, Y.N. Road, Indore',
    distance: '0.3 km away',
    inmatesCount: 'Assists 200+ Students Every Semester',
    contactPerson: 'Prof. S.K. Sharma / Student Reps',
    phone: '+91 98260 11998',
    urgentNeeds: ['B.Tech Engineering Reference Books', 'Scientific Calculators', 'Unused Gate / IES Guides'],
    description: 'Circulates technical books, semester textbooks, and reference sets freely to first-generation college students for entire academic terms.',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=700&auto=format&fit=crop&q=80',
    verified: true,
  },
];

interface DonationListing {
  id: string;
  title: string;
  category: string;
  quantity: string;
  donorName: string;
  donorContact: string;
  location: string;
  description: string;
  postedAt: string;
  status: 'AVAILABLE' | 'CLAIMED';
}

const INITIAL_USER_DONATIONS: DonationListing[] = [
  {
    id: 'd-1',
    title: '6 Clean Woolen Sweaters + 2 Quilts',
    category: 'CLOTHES',
    quantity: '8 items',
    donorName: 'Ananya Roy',
    donorContact: '+91 98261 22334',
    location: 'New Palasia, Indore',
    description: 'Gently used winter wear in clean, washed condition. Ready for pickup by any old age home or volunteer.',
    postedAt: '3 hours ago',
    status: 'AVAILABLE',
  },
  {
    id: 'd-2',
    title: 'Surplus 25 Lunch Boxes from Tech Symposium',
    category: 'FOOD',
    quantity: '25 fresh meal packs',
    donorName: 'CSI Student Chapter',
    donorContact: '+91 98269 55667',
    location: 'SGSITS CS Auditorium, Indore',
    description: 'Freshly packed vegetarian pulao, paneer sabzi and roti packs. Need immediate distribution within 2 hours.',
    postedAt: '1 hour ago',
    status: 'AVAILABLE',
  },
  {
    id: 'd-3',
    title: 'Senior Citizen Aluminum Walker with Wheels',
    category: 'MEDICAL',
    quantity: '1 walker',
    donorName: 'Rameshwar Ji',
    donorContact: '+91 98263 88123',
    location: 'Manorama Ganj, Indore',
    description: 'Fully functional, lightweight height-adjustable walker. Willing to donate directly to an elderly resident.',
    postedAt: 'Yesterday',
    status: 'AVAILABLE',
  },
];

export const DonationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'NGOS' | 'DONATE_ITEM'>('NGOS');
  const [selectedNgoFilter, setSelectedNgoFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNgo, setSelectedNgo] = useState<NGOOrganization | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState<boolean>(false);
  const [waToastMessage, setWaToastMessage] = useState<string | null>(null);

  const [donations, setDonations] = useState<DonationListing[]>(() => {
    const saved = localStorage.getItem('openhand_donations_list');
    return saved ? JSON.parse(saved) : INITIAL_USER_DONATIONS;
  });

  const [newDonation, setNewDonation] = useState({
    title: '',
    category: 'CLOTHES',
    quantity: '',
    donorName: '',
    donorContact: '',
    location: 'SGSITS Campus, Indore',
    description: '',
  });

  const handlePostDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonation.title || !newDonation.quantity) return;

    const created: DonationListing = {
      id: `d-${Date.now()}`,
      title: newDonation.title,
      category: newDonation.category,
      quantity: newDonation.quantity,
      donorName: newDonation.donorName || 'Generous Citizen',
      donorContact: newDonation.donorContact || '+91 98260 00000',
      location: newDonation.location || 'Indore City',
      description: newDonation.description || 'Donated with care for those in need.',
      postedAt: 'Just now',
      status: 'AVAILABLE',
    };

    const updated = [created, ...donations];
    setDonations(updated);
    localStorage.setItem('openhand_donations_list', JSON.stringify(updated));
    setIsDonateModalOpen(false);
    setWaToastMessage(`📲 Automated WhatsApp Alerts Dispatched! 2 verified Indore shelters (Aastha Vriddhashram & Goonj Collection Center) with matching wishlists have been notified.`);
    setTimeout(() => setWaToastMessage(null), 8000);
    setNewDonation({
      title: '',
      category: 'CLOTHES',
      quantity: '',
      donorName: '',
      donorContact: '',
      location: 'SGSITS Campus, Indore',
      description: '',
    });
  };

  const filteredNgos = NGOS_DATA.filter((ngo) => {
    const matchesFilter = selectedNgoFilter === 'ALL' || ngo.type === selectedNgoFilter;
    const matchesSearch =
      ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.urgentNeeds.some((need) => need.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-[#FAF9F6] text-slate-900 min-h-screen font-sans w-full">
      {/* Automated WhatsApp Alert Toast */}
      {waToastMessage && (
        <div className="sticky top-16 z-40 bg-[#075E54] text-white py-3 px-4 shadow-md flex items-center justify-between">
          <div className="max-w-7xl mx-auto flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
            <span className="text-lg">📲</span>
            <span>{waToastMessage}</span>
          </div>
          <button
            onClick={() => setWaToastMessage(null)}
            className="text-white/80 hover:text-white text-xs px-2 py-1 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. HEADER BANNER */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1560px] w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-3">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>OpenHand Community Giving & Care</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Donate What You Have & Support Nearest Homes
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              Connect directly with verified Old Age Homes, Orphanages, and food rescue volunteers across Indore. Hand over surplus items to people who genuinely need them.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" />
              <span>Donate Surplus Items</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MODE SELECTOR TABS */}
      <div className="sticky top-16 z-30 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-slate-200/80 py-4 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1560px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('NGOS')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'NGOS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Nearest Old Age Homes & NGOs ({NGOS_DATA.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('DONATE_ITEM')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'DONATE_ITEM'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-emerald-700" />
              <span>Community Donation Offers ({donations.length})</span>
            </button>
          </div>

          {activeTab === 'NGOS' && (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shelter, needs..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
                />
              </div>

              <select
                value={selectedNgoFilter}
                onChange={(e) => setSelectedNgoFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="ALL">All Shelters</option>
                <option value="OLD_AGE_HOME">Old Age Homes</option>
                <option value="ORPHANAGE">Children Orphanages</option>
                <option value="FOOD_RESCUE">Food Rescue</option>
                <option value="CLOTH_BANK">Clothes Bank</option>
                <option value="EDUCATION">Student Books</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 3. TAB 1: NEAREST NGOS & OLD AGE HOMES */}
      {activeTab === 'NGOS' && (
        <div className="max-w-[1560px] w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-900">
              Verified Organizations & Homes in Indore accepting direct drop-offs
            </span>
            <span className="text-emerald-700 font-semibold">100% Direct • No Middlemen</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNgos.map((ngo) => (
              <div
                key={ngo.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/8] overflow-hidden bg-slate-100">
                    <img
                      src={ngo.imageUrl}
                      alt={ngo.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md rounded-md text-[10px] font-mono text-white font-bold">
                        {ngo.categoryLabel}
                      </span>
                      {ngo.verified && (
                        <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded text-slate-900 text-[11px] font-bold shadow-sm">
                      {ngo.distance}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{ngo.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{ngo.location}</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ngo.description}
                    </p>

                    <div className="pt-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-red-600 mb-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span>Urgent Wishlist Needs Right Now:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ngo.urgentNeeds.map((need, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200/80 rounded-md text-[11px] font-medium"
                          >
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Coordinator: <span className="font-bold text-slate-800">{ngo.contactPerson}</span>
                  </div>

                  <button
                    onClick={() => setSelectedNgo(ngo)}
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Donate to this Shelter</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 2: COMMUNITY DONATION OFFERS */}
      {activeTab === 'DONATE_ITEM' && (
        <div className="max-w-[1560px] w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-900">
              Citizens offering surplus food, clothes, and mobility gear for free pickup
            </span>
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="text-emerald-700 font-bold hover:underline"
            >
              + Post New Donation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {donations.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-md uppercase">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.postedAt}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900">{item.title}</h3>

                  <div className="p-2.5 bg-[#FAF9F6] rounded-lg border border-slate-200/80 text-xs">
                    <span className="text-slate-500">Available Quantity: </span>
                    <span className="font-bold text-slate-900">{item.quantity}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{item.location}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    Donor: <span className="font-bold text-slate-800">{item.donorName}</span>
                  </div>
                  <a
                    href={`tel:${item.donorContact}`}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call for Pickup</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. DONATE MODAL */}
      {isDonateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsDonateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-mono text-emerald-800 font-bold uppercase tracking-wider">
                SURPLUS GIVING
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Post an Item for Donation
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Offer clothes, surplus food, blankets, or walkers to nearest shelters & needy people.
              </p>
            </div>

            <form onSubmit={handlePostDonation} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">What are you donating? *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10 Winter Sweaters & Blankets"
                  value={newDonation.title}
                  onChange={(e) => setNewDonation({ ...newDonation, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category *</label>
                  <select
                    value={newDonation.category}
                    onChange={(e) => setNewDonation({ ...newDonation, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-xs font-medium"
                  >
                    <option value="CLOTHES">Clothes & Blankets</option>
                    <option value="FOOD">Surplus Fresh Food / Ration</option>
                    <option value="BOOKS">Textbooks & Stationery</option>
                    <option value="MEDICAL">Medical Gear / Wheelchair</option>
                    <option value="HOUSEHOLD">Utensils & Living Items</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Estimated Quantity *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 blankets / 15 meal boxes"
                    value={newDonation.quantity}
                    onChange={(e) => setNewDonation({ ...newDonation, quantity: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Condition & Details</label>
                <textarea
                  rows={3}
                  placeholder="Is it clean / washed? For food: what time was it prepared?"
                  value={newDonation.description}
                  onChange={(e) => setNewDonation({ ...newDonation, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={newDonation.donorName}
                    onChange={(e) => setNewDonation({ ...newDonation, donorName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98260 XXXXX"
                    value={newDonation.donorContact}
                    onChange={(e) => setNewDonation({ ...newDonation, donorContact: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Pickup Location / Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Palasia Square, Indore"
                  value={newDonation.location}
                  onChange={(e) => setNewDonation({ ...newDonation, location: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsDonateModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Publish Free Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. NGO CONTACT / DONATION MODAL */}
      {selectedNgo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedNgo(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-800 font-bold uppercase">
                <Building2 className="w-3.5 h-3.5" />
                <span>{selectedNgo.categoryLabel}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {selectedNgo.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{selectedNgo.location}</p>
            </div>

            <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-2">
              <span className="text-xs font-bold text-red-800 block">
                Urgent Wishlist For Inmates:
              </span>
              <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
                {selectedNgo.urgentNeeds.map((need, idx) => (
                  <li key={idx}>{need}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Contact Person:</span>
                <span className="font-bold text-slate-900">{selectedNgo.contactPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Direct Phone:</span>
                <span className="font-mono font-bold text-slate-900">{selectedNgo.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Distance:</span>
                <span className="font-bold text-emerald-800">{selectedNgo.distance}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <a
                href={`tel:${selectedNgo.phone}`}
                className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call Center for Drop-off / Pickup</span>
              </a>
              <button
                onClick={() => setSelectedNgo(null)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
