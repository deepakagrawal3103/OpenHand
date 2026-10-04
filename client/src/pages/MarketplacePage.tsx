import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Plus,
  BookOpen,
  Laptop,
  Bike,
  Armchair,
  Wrench,
  Tag,
  MapPin,
  MessageCircle,
  Phone,
  Filter,
  CheckCircle2,
  X,
  Sparkles,
  ShoppingBag,
  Lock,
  UserCheck,
  Repeat,
  HeartPulse,
  Calendar,
  ShieldCheck,
  Clock,
  Video,
} from 'lucide-react';

export interface MarketItem {
  id: string;
  title: string;
  category: 'BOOKS' | 'ELECTRONICS' | 'MOBILITY' | 'HOSTEL' | 'TOOLS' | 'MEDICAL_RENTAL' | 'EVENT_GEAR';
  listingType: 'SALE' | 'RENT'; // Buy/Sell vs Community Rental
  price: number; // Purchase price OR Rental rate
  rentalPeriod?: 'day' | 'week' | 'month'; // e.g. /day, /month
  securityDeposit?: number; // Refundable deposit
  originalPrice?: number;
  condition: 'Like New' | 'Good' | 'Fair';
  description: string;
  sellerName: string;
  sellerContact: string;
  location: string;
  distance: string;
  imageUrl: string;
  postedAt: string;
  isSold?: boolean;
}

const INITIAL_ITEMS: MarketItem[] = [
  // --- UNCOMMON ITEMS FOR RENT (WHEELCHAIR, WALKER, MEDICAL & HEAVY GEAR) ---
  {
    id: 'rent-1',
    title: 'Senior Folding Mobility Walker (With Wheels & Comfort Grips)',
    category: 'MEDICAL_RENTAL',
    listingType: 'RENT',
    price: 30,
    rentalPeriod: 'day',
    securityDeposit: 400,
    condition: 'Like New',
    description: 'Height-adjustable reciprocal aluminium walker with dual front glide wheels and comfort handgrips. Fully disinfected and cleaned. Ideal for temporary fracture or post-surgery recovery without buying full price.',
    sellerName: 'Sunita Agrawal',
    sellerContact: '+91 98262 33441',
    location: 'Geeta Bhawan Square, Indore',
    distance: '0.8 km away',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=700&auto=format&fit=crop&q=80',
    postedAt: '1 hour ago',
  },
  {
    id: 'rent-2',
    title: 'Karma Lightweight Folding Wheelchair (With Brakes & Footrest)',
    category: 'MEDICAL_RENTAL',
    listingType: 'RENT',
    price: 60,
    rentalPeriod: 'day',
    securityDeposit: 1000,
    condition: 'Like New',
    description: 'Compact foldable wheelchair with companion handbrakes, calf support strap, and solid rubber puncture-proof wheels. Easily fits inside any auto rickshaw or car trunk for hospital OPD visits.',
    sellerName: 'Dr. Neeraj Kulkarni',
    sellerContact: '+91 98260 77112',
    location: 'Old Palasia, Indore',
    distance: '1.2 km away',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=700&auto=format&fit=crop&q=80',
    postedAt: '3 hours ago',
  },
  {
    id: 'rent-3',
    title: 'Philips EverFlo 5L Medical Oxygen Concentrator (Tested & Serviced)',
    category: 'MEDICAL_RENTAL',
    listingType: 'RENT',
    price: 180,
    rentalPeriod: 'day',
    securityDeposit: 2500,
    condition: 'Like New',
    description: 'Continuous medical oxygen purity up to 5 LPM with built-in purity indicator alarm. Quiet motor suitable for home care. Fresh sealed cannula and bubble humidifier bottle included.',
    sellerName: 'Rajesh Malviya',
    sellerContact: '+91 98264 55667',
    location: 'Anand Bazaar, Indore',
    distance: '1.7 km away',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=700&auto=format&fit=crop&q=80',
    postedAt: '5 hours ago',
  },
  {
    id: 'rent-4',
    title: 'Bosch Professional 800W Rotary Hammer Drill + 12pc SDS Bit Set',
    category: 'TOOLS',
    listingType: 'RENT',
    price: 120,
    rentalPeriod: 'day',
    securityDeposit: 800,
    condition: 'Good',
    description: 'Heavy-duty 800W hammer drill for concrete wall anchoring, cooler stand fabrication, and TV mount drilling. Includes 6mm, 8mm, 10mm SDS bits and chuck adapter. Don’t buy a ₹5,000 drill for a 2-hour job.',
    sellerName: 'Vikram Sharma',
    sellerContact: '+91 98263 44556',
    location: 'Bhawarkua Square, Indore',
    distance: '0.9 km away',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&auto=format&fit=crop&q=80',
    postedAt: 'Today',
  },
  {
    id: 'rent-5',
    title: 'Epson Full HD 1080p LED Projector (3600 Lumens + HDMI Cable)',
    category: 'EVENT_GEAR',
    listingType: 'RENT',
    price: 250,
    rentalPeriod: 'day',
    securityDeposit: 1500,
    condition: 'Like New',
    description: 'High-brightness digital projector with 5m HDMI wire, power extension cord, and tripod stand. Perfect for student club events, final year thesis project defense, or weekend hostel movie night.',
    sellerName: 'Aarav Patel',
    sellerContact: '+91 98260 54321',
    location: 'SGSITS CS Department, Indore',
    distance: '0.3 km away',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=700&auto=format&fit=crop&q=80',
    postedAt: 'Yesterday',
  },
  {
    id: 'rent-6',
    title: 'Quechua 4-Person Waterproof Camping Tent + Dual Groundsheet',
    category: 'EVENT_GEAR',
    listingType: 'RENT',
    price: 150,
    rentalPeriod: 'day',
    securityDeposit: 600,
    condition: 'Good',
    description: '2-minute pitching dome tent with ventilation flaps and mosquito netting. Kept clean and dry. Great for weekend student trips to Choral Dam, Mandu, or Patalpani waterfalls.',
    sellerName: 'Deepak Verma',
    sellerContact: '+91 98261 88772',
    location: 'Vijay Nagar, Indore',
    distance: '2.1 km away',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=700&auto=format&fit=crop&q=80',
    postedAt: '2 days ago',
  },

  // --- POPULAR ITEMS FOR PERMANENT SALE ---
  {
    id: 'm-1',
    title: 'Complete 3rd Year B.Tech CS Books (Operating Systems, DBMS, CN)',
    category: 'BOOKS',
    listingType: 'SALE',
    price: 350,
    originalPrice: 1800,
    condition: 'Good',
    description: 'Galvin OS, Korth DBMS, and Tanenbaum Computer Networks. Highlighted with exam notes and previous year question bank included.',
    sellerName: 'Rahul Verma',
    sellerContact: '+91 98261 45678',
    location: 'SGSITS Hostel 2, Indore',
    distance: '0.4 km away',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=700&auto=format&fit=crop&q=80',
    postedAt: '2 hours ago',
  },
  {
    id: 'm-2',
    title: 'Casio fx-991ES Plus 2nd Edition Scientific Calculator',
    category: 'ELECTRONICS',
    listingType: 'SALE',
    price: 499,
    originalPrice: 1495,
    condition: 'Like New',
    description: 'Used for 1 semester in SGSITS. Fresh battery installed. Approved for RGPV exams and GATE preparation.',
    sellerName: 'Neha Sen',
    sellerContact: '+91 98263 11223',
    location: 'Geeta Bhawan Square, Indore',
    distance: '1.1 km away',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=700&auto=format&fit=crop&q=80',
    postedAt: '4 hours ago',
  },
  {
    id: 'm-3',
    title: 'Hero Sprint Campus Bicycle (With lock & front basket)',
    category: 'MOBILITY',
    listingType: 'SALE',
    price: 1800,
    originalPrice: 6500,
    condition: 'Good',
    description: 'Both tyres replaced 2 months ago. Smooth chain and working brakes. Moving out of campus next week, urgent sale.',
    sellerName: 'Aman Joshi',
    sellerContact: '+91 98265 99887',
    location: 'SGSITS Main Gate, Indore',
    distance: '0.6 km away',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=700&auto=format&fit=crop&q=80',
    postedAt: 'Today',
  },
  {
    id: 'm-4',
    title: 'Engineering Mini Drafter + Drawing Board (Rotring / Omega)',
    category: 'TOOLS',
    listingType: 'SALE',
    price: 250,
    originalPrice: 950,
    condition: 'Good',
    description: 'Used for 1st year Engineering Graphics. Unbroken scale, smooth pivot clamping knob, canvas carry case included.',
    sellerName: 'Priya Sharma',
    sellerContact: '+91 98260 12345',
    location: 'SGSITS CS Dept, Indore',
    distance: '0.2 km away',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700&auto=format&fit=crop&q=80',
    postedAt: 'Yesterday',
  },
  {
    id: 'm-5',
    title: 'Room Cooler (Desert Plastic Body, High Air Throw)',
    category: 'HOSTEL',
    listingType: 'SALE',
    price: 1200,
    originalPrice: 4200,
    condition: 'Good',
    description: 'Submersible pump in perfect condition, new honeycomb cooling pads installed. Very low power consumption.',
    sellerName: 'Kunal Patel',
    sellerContact: '+91 98264 33445',
    location: 'New Palasia, Indore',
    distance: '1.8 km away',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&auto=format&fit=crop&q=80',
    postedAt: '1 day ago',
  },
  {
    id: 'm-6',
    title: 'Arduino Uno R3 + Sensor Starter Kit (37 Sensors + Jumper bundle)',
    category: 'ELECTRONICS',
    listingType: 'SALE',
    price: 600,
    originalPrice: 2200,
    condition: 'Like New',
    description: 'Used once for IoT minor project. Includes Ultrasonic sensor, DHT11 temp/humidity, OLED display, and breadboard.',
    sellerName: 'Aarav Patel',
    sellerContact: '+91 98260 54321',
    location: 'Central Library, Indore',
    distance: '0.8 km away',
    imageUrl: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=700&auto=format&fit=crop&q=80',
    postedAt: '2 days ago',
  },
];

export const MarketplacePage: React.FC = () => {
  const { user, switchPersona } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState<MarketItem[]>(() => {
    const saved = localStorage.getItem('openhand_marketplace_items_v2');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [modeFilter, setModeFilter] = useState<'ALL' | 'SALE' | 'RENT'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<MarketItem | null>(null);

  // Form State
  const [newItem, setNewItem] = useState<{
    title: string;
    category: MarketItem['category'];
    listingType: 'SALE' | 'RENT';
    price: string;
    rentalPeriod: 'day' | 'month';
    securityDeposit: string;
    condition: MarketItem['condition'];
    description: string;
    sellerName: string;
    sellerContact: string;
    location: string;
    imageUrl: string;
  }>({
    title: '',
    category: 'MEDICAL_RENTAL',
    listingType: 'RENT',
    price: '',
    rentalPeriod: 'day',
    securityDeposit: '',
    condition: 'Like New',
    description: '',
    sellerName: user?.name || '',
    sellerContact: user?.phone || '+91 98260 12345',
    location: 'Geeta Bhawan, Indore',
    imageUrl: '',
  });

  const handleOpenListModal = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setNewItem((prev) => ({
      ...prev,
      sellerName: user.name || prev.sellerName,
      sellerContact: user.phone || prev.sellerContact,
    }));
    setIsModalOpen(true);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.price) return;

    let defaultImage = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=700&auto=format&fit=crop&q=80';
    if (newItem.category === 'BOOKS') {
      defaultImage = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=700&auto=format&fit=crop&q=80';
    } else if (newItem.category === 'ELECTRONICS') {
      defaultImage = 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=700&auto=format&fit=crop&q=80';
    } else if (newItem.category === 'TOOLS') {
      defaultImage = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&auto=format&fit=crop&q=80';
    } else if (newItem.category === 'EVENT_GEAR') {
      defaultImage = 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=700&auto=format&fit=crop&q=80';
    } else if (newItem.category === 'MOBILITY') {
      defaultImage = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=700&auto=format&fit=crop&q=80';
    } else if (newItem.category === 'MEDICAL_RENTAL') {
      defaultImage = 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=700&auto=format&fit=crop&q=80';
    }

    const created: MarketItem = {
      id: `${newItem.listingType.toLowerCase()}-${Date.now()}`,
      title: newItem.title,
      category: newItem.category,
      listingType: newItem.listingType,
      price: Number(newItem.price),
      rentalPeriod: newItem.listingType === 'RENT' ? newItem.rentalPeriod : undefined,
      securityDeposit: newItem.securityDeposit ? Number(newItem.securityDeposit) : undefined,
      condition: newItem.condition,
      description: newItem.description || (newItem.listingType === 'RENT' ? 'Available for immediate rental in clean condition.' : 'Pre-owned item in good working order.'),
      sellerName: newItem.sellerName || 'Indore Resident',
      sellerContact: newItem.sellerContact || '+91 98260 00000',
      location: newItem.location || 'Indore',
      distance: '0.4 km away',
      imageUrl: newItem.imageUrl || defaultImage,
      postedAt: 'Just now',
    };

    const updated = [created, ...items];
    setItems(updated);
    localStorage.setItem('openhand_marketplace_items_v2', JSON.stringify(updated));
    setIsModalOpen(false);
    setNewItem({
      title: '',
      category: 'MEDICAL_RENTAL',
      listingType: 'RENT',
      price: '',
      rentalPeriod: 'day',
      securityDeposit: '',
      condition: 'Like New',
      description: '',
      sellerName: '',
      sellerContact: '',
      location: 'Geeta Bhawan, Indore',
      imageUrl: '',
    });
  };

  const saleCount = items.filter((i) => i.listingType === 'SALE').length;
  const rentCount = items.filter((i) => i.listingType === 'RENT').length;

  const filteredItems = items.filter((item) => {
    const matchesMode =
      modeFilter === 'ALL' || item.listingType === modeFilter;
    const matchesCategory =
      selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesPrice = item.price <= maxPrice;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMode && matchesCategory && matchesPrice && matchesSearch;
  });

  return (
    <div className="bg-[#FAF9F6] text-slate-900 min-h-screen font-sans w-full">
      {/* 1. HEADER BANNER */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1560px] w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-3">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
              <span>OpenHand Community Marketplace & Rental Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Buy, Sell & Rent Pre-Owned Gear
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl">
              Buy or sell used books, calculators, and cycles—or <strong>rent uncommon equipment</strong> like <strong>wheelchairs, walkers, medical gear, rotary drills, and projectors</strong> from neighbours for a few days at nominal rates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenListModal}
              className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 self-start md:self-center"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ List for Sale or Rent</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MODE SWITCHER (ALL / FOR SALE / FOR RENT) & HIGHLIGHT BAR */}
      <div className="bg-emerald-50/50 border-b border-emerald-100 py-3 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1560px] w-full mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setModeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                modeFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setModeFilter('RENT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                modeFilter === 'RENT'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>🔄 Available For Rent ({rentCount})</span>
            </button>
            <button
              onClick={() => setModeFilter('SALE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                modeFilter === 'SALE'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>🏷️ For Sale ({saleCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-emerald-950 font-medium text-[11px] sm:text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Rent instead of buying:</strong> Wheelchairs, walkers, and heavy tools available for ₹30 – ₹150/day.
            </span>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & CATEGORY FILTER BAR */}
      <div className="sticky top-16 z-30 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-slate-200/80 py-4 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1560px] w-full mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wheelchairs, walkers, tools, books, cycles, projectors..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 shadow-2xs font-medium"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: 'All Categories' },
              { id: 'MEDICAL_RENTAL', label: '♿ Wheelchair & Walker (Rent)' },
              { id: 'TOOLS', label: '🛠️ Heavy Tools & Drills' },
              { id: 'EVENT_GEAR', label: '📽️ Projector & Camping' },
              { id: 'BOOKS', label: '📚 Books & Notes' },
              { id: 'ELECTRONICS', label: '⚡ Electronics' },
              { id: 'MOBILITY', label: '🚲 Bicycles' },
              { id: 'HOSTEL', label: '🛏️ Hostel Stuff' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Price Slider */}
          <div className="hidden xl:flex items-center gap-3 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
            <span>Max Budget:</span>
            <input
              type="range"
              min="50"
              max="5000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-emerald-700 cursor-pointer w-24"
            />
            <span className="font-bold text-slate-900">₹{maxPrice}</span>
          </div>
        </div>
      </div>

      {/* 4. LISTINGS GRID */}
      <div className="max-w-[1560px] w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10">
        <div className="flex items-center justify-between mb-6 text-xs text-slate-600">
          <span className="font-semibold text-slate-900">
            Showing {filteredItems.length} {modeFilter === 'RENT' ? 'rental' : modeFilter === 'SALE' ? 'for-sale' : 'active'} items in Indore
          </span>
          <span className="text-slate-500">Zero commission • Direct neighbourhood handoff</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center font-bold">
              ?
            </div>
            <h3 className="text-base font-bold text-slate-900">No items found</h3>
            <p className="text-xs text-slate-600">
              Try adjusting your search query, category, or rental filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setModeFilter('ALL');
                setMaxPrice(5000);
              }}
              className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      {item.listingType === 'RENT' ? (
                        <span className="px-2.5 py-1 bg-indigo-900/90 backdrop-blur-md rounded-md text-[10px] font-mono text-white font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <Repeat className="w-3 h-3 text-indigo-300" />
                          <span>FOR RENT</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-900/90 backdrop-blur-md rounded-md text-[10px] font-mono text-white font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <Tag className="w-3 h-3 text-emerald-300" />
                          <span>FOR SALE</span>
                        </span>
                      )}

                      <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white rounded text-[10px] font-bold">
                        {item.condition}
                      </span>
                    </div>

                    {/* Price Pill */}
                    <div className={`absolute bottom-3 right-3 px-2.5 py-1 backdrop-blur-md rounded-lg text-white font-black text-sm shadow-sm ${
                      item.listingType === 'RENT' ? 'bg-indigo-900/95' : 'bg-emerald-900/95'
                    }`}>
                      {item.listingType === 'RENT' ? (
                        <span>₹{item.price} <span className="text-[10px] font-normal text-indigo-200">/{item.rentalPeriod || 'day'}</span></span>
                      ) : (
                        <span>₹{item.price}</span>
                      )}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    {/* Rent Specific Info: Deposit */}
                    {item.listingType === 'RENT' && item.securityDeposit && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10px] font-semibold">
                        <ShieldCheck className="w-3 h-3 text-indigo-600" />
                        <span>Refundable Deposit: ₹{item.securityDeposit}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{item.location}</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-800 font-semibold shrink-0">
                        {item.distance}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Owner: <span className="font-bold text-slate-800">{item.sellerName}</span>
                  </div>

                  <button
                    onClick={() => setActiveItem(item)}
                    className={`px-3.5 py-2 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 ${
                      item.listingType === 'RENT'
                        ? 'bg-indigo-700 hover:bg-indigo-800'
                        : 'bg-emerald-700 hover:bg-emerald-800'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{item.listingType === 'RENT' ? 'Rent Item' : 'Buy Item'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. POST ITEM MODAL (SALE OR RENT) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-mono text-emerald-800 font-bold uppercase tracking-wider">
                COMMUNITY MARKETPLACE & RENTAL
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                List an Item for Sale or Rent
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Sell your old books and cycles, or put uncommon items like walkers, wheelchairs, tools, and projectors on rent.
              </p>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs font-medium">
              {/* Listing Purpose Switcher */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">What would you like to do? *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewItem({ ...newItem, listingType: 'RENT', category: 'MEDICAL_RENTAL' })}
                    className={`py-2.5 px-3 rounded-xl border text-left font-bold transition-all flex items-center gap-2 ${
                      newItem.listingType === 'RENT'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Repeat className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <div className="text-xs">🔄 Put On Rent</div>
                      <div className="text-[10px] text-slate-500 font-normal">Wheelchair, Walker, Tools...</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewItem({ ...newItem, listingType: 'SALE', category: 'BOOKS' })}
                    className={`py-2.5 px-3 rounded-xl border text-left font-bold transition-all flex items-center gap-2 ${
                      newItem.listingType === 'SALE'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs">🏷️ Sell Item</div>
                      <div className="text-[10px] text-slate-500 font-normal">Books, Calculator, Cycles...</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  placeholder={
                    newItem.listingType === 'RENT'
                      ? 'e.g. Folding Senior Walker with Wheels OR Rotary Hammer Drill'
                      : 'e.g. 3rd Year B.Tech CS Books OR Hero Sprint Bicycle'
                  }
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category *</label>
                  <select
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value as MarketItem['category'] })
                    }
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-xs font-medium"
                  >
                    <option value="MEDICAL_RENTAL">♿ Medical & Mobility (Wheelchair/Walker)</option>
                    <option value="TOOLS">🛠️ Heavy Tools & Workshop</option>
                    <option value="EVENT_GEAR">📽️ Projector & Camping</option>
                    <option value="BOOKS">📚 Books & Exam Notes</option>
                    <option value="ELECTRONICS">⚡ Electronics & Kits</option>
                    <option value="MOBILITY">🚲 Bicycles / Transport</option>
                    <option value="HOSTEL">🛏️ Hostel Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {newItem.listingType === 'RENT' ? 'Rental Rate (₹) *' : 'Selling Price (₹) *'}
                  </label>
                  <input
                    type="number"
                    required
                    placeholder={newItem.listingType === 'RENT' ? 'e.g. 50' : 'e.g. 350'}
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white outline-none focus:border-emerald-600 font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Rent-Specific Inputs */}
              {newItem.listingType === 'RENT' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-50/60 rounded-xl border border-indigo-200">
                  <div>
                    <label className="block text-indigo-900 font-bold mb-1">Rental Period</label>
                    <select
                      value={newItem.rentalPeriod}
                      onChange={(e) => setNewItem({ ...newItem, rentalPeriod: e.target.value as 'day' | 'month' })}
                      className="w-full p-2 border border-indigo-200 rounded-lg bg-white text-xs font-semibold text-indigo-950"
                    >
                      <option value="day">Per Day (Daily Rate)</option>
                      <option value="month">Per Month (Monthly Rate)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-indigo-900 font-bold mb-1">Refundable Deposit (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={newItem.securityDeposit}
                      onChange={(e) => setNewItem({ ...newItem, securityDeposit: e.target.value })}
                      className="w-full p-2 border border-indigo-200 rounded-lg bg-white text-xs font-semibold text-indigo-950"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">Condition</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Like New', 'Good', 'Fair'] as const).map((cond) => (
                    <button
                      type="button"
                      key={cond}
                      onClick={() => setNewItem({ ...newItem, condition: cond })}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        newItem.condition === cond
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder={
                    newItem.listingType === 'RENT'
                      ? 'Mention item condition, cleanliness, sanitize status, accessories included, and return terms...'
                      : 'Details about edition, scratches, accessories included...'
                  }
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aman Sharma"
                    value={newItem.sellerName}
                    onChange={(e) => setNewItem({ ...newItem, sellerName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98260 XXXXX"
                    value={newItem.sellerContact}
                    onChange={(e) => setNewItem({ ...newItem, sellerContact: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Pickup Campus / Area in Indore</label>
                <input
                  type="text"
                  placeholder="e.g. Geeta Bhawan, Old Palasia, or SGSITS Campus"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. CONTACT OWNER / SELLER POPUP */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                  activeItem.listingType === 'RENT'
                    ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}>
                  {activeItem.listingType === 'RENT' ? '🔄 AVAILABLE FOR RENT' : '🏷️ FOR SALE'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">#{activeItem.id}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                {activeItem.title}
              </h3>
              <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
                <span>₹{activeItem.price}</span>
                {activeItem.listingType === 'RENT' && (
                  <span className="text-xs font-normal text-slate-500">/{activeItem.rentalPeriod || 'day'}</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              {activeItem.listingType === 'RENT' && activeItem.securityDeposit && (
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Security Deposit:</span>
                  <span className="font-bold text-indigo-800">₹{activeItem.securityDeposit} (Refundable)</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">{activeItem.listingType === 'RENT' ? 'Owner:' : 'Seller:'}</span>
                <span className="font-bold text-slate-900">{activeItem.sellerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-bold text-slate-900">{activeItem.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Distance:</span>
                <span className="font-bold text-emerald-700">{activeItem.distance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone / WhatsApp:</span>
                <span className="font-mono font-bold text-slate-900">{activeItem.sellerContact}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
              {activeItem.description}
            </p>

            <div className="flex gap-2 pt-1">
              <a
                href={`https://wa.me/${activeItem.sellerContact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  activeItem.listingType === 'RENT'
                    ? `Hi ${activeItem.sellerName}, I saw your listing for RENT on OpenHand: "${activeItem.title}" at ₹${activeItem.price}/${activeItem.rentalPeriod || 'day'}. Is it currently available for rental?`
                    : `Hi ${activeItem.sellerName}, I am interested in buying your OpenHand listing: "${activeItem.title}" for ₹${activeItem.price}. Is it still available?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className={`flex-1 py-3 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors ${
                  activeItem.listingType === 'RENT'
                    ? 'bg-indigo-700 hover:bg-indigo-800'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{activeItem.listingType === 'RENT' ? 'Rent via WhatsApp' : 'Message on WhatsApp'}</span>
              </a>
              <a
                href={`tel:${activeItem.sellerContact}`}
                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center"
                title="Call Directly"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 7. LOGIN REQUIRED MODAL DIALOG */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 mx-auto flex items-center justify-center shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Login Required to List
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                To keep our community marketplace trusted and scam-free, you must be signed in before posting items for sale or rent.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigate('/login', { state: { from: '/marketplace' } })}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Go to Sign In Page</span>
                <span className="text-emerald-300">→</span>
              </button>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold text-center">
                  Or Instant Demo Sign-In
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={async () => {
                      await switchPersona('priya');
                      setAuthModalOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-white hover:bg-emerald-50 text-slate-900 rounded-lg border border-slate-200 text-left transition-colors flex items-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <div>
                      <div className="text-xs font-bold leading-tight">Priya Sharma</div>
                      <div className="text-[10px] text-slate-400">Student</div>
                    </div>
                  </button>

                  <button
                    onClick={async () => {
                      await switchPersona('aarav');
                      setAuthModalOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-white hover:bg-emerald-50 text-slate-900 rounded-lg border border-slate-200 text-left transition-colors flex items-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <div>
                      <div className="text-xs font-bold leading-tight">Aarav Patel</div>
                      <div className="text-[10px] text-slate-400">Helper</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="text-center text-xs text-slate-500 pt-1">
                Don't have an account?{' '}
                <Link to="/signup" className="text-emerald-700 font-bold hover:underline">
                  Sign up for free
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
