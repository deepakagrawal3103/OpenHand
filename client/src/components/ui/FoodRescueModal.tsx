import React, { useState } from 'react';
import { Utensils, Clock, MapPin, Phone, AlertCircle, CheckCircle2, X, Send, Heart } from 'lucide-react';

export interface FoodRescueAlert {
  id: string;
  title: string;
  quantity: string;
  mealType: string;
  cookedTime: string;
  safeUntil: string;
  location: string;
  contactName: string;
  contactPhone: string;
  venueName: string;
  postedAt: string;
}

interface FoodRescueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAlertCreated: (alert: FoodRescueAlert) => void;
}

export const FoodRescueModal: React.FC<FoodRescueModalProps> = ({
  isOpen,
  onClose,
  onAlertCreated,
}) => {
  const [venueName, setVenueName] = useState('');
  const [quantity, setQuantity] = useState('35 Fresh Meals / Thalis');
  const [mealType, setMealType] = useState('Pure Veg');
  const [location, setLocation] = useState('Bypass Road / Vijay Nagar, Indore');
  const [safeUntil, setSafeUntil] = useState('Tonight till 1:30 AM');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('+91 98260 99887');
  const [notes, setNotes] = useState('Hot & untouched banquet food packed in clean steel containers.');
  const [successAlert, setSuccessAlert] = useState<FoodRescueAlert | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const created: FoodRescueAlert = {
      id: `food-${Date.now()}`,
      title: `${quantity} (${mealType})`,
      quantity,
      mealType,
      cookedTime: 'Cooked 2.5 hours ago',
      safeUntil,
      location,
      venueName: venueName || 'Community Hall / Marriage Garden',
      contactName: contactName || 'Banquet Organizer',
      contactPhone,
      postedAt: 'Just now',
    };

    onAlertCreated(created);
    setSuccessAlert(created);
  };

  const handleSendWhatsAppDispatch = () => {
    if (!successAlert) return;
    const msg = `🚨 *URGENT SURPLUS FOOD RESCUE ALERT - INDORE* 🍲\n\n🍱 *Food Available:* ${successAlert.quantity} (${successAlert.mealType})\n📍 *Venue & Area:* ${successAlert.venueName}, ${successAlert.location}\n⏰ *Safe Consumption Window:* ${successAlert.safeUntil}\n📞 *Direct Pickup Contact:* ${successAlert.contactName} (${successAlert.contactPhone})\n\n👉 *Claim via OpenHand Food Rescue:* http://localhost:5173/donate\n\n_Please alert Annapurna Roti Bank, Robin Hood Army, or nearby shelters to collect immediately._`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {successAlert ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold shadow-xs">
              🍲
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                ACTIVE RESCUE DISPATCH
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Surplus Food Broadcasted!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                Emergency alert dispatched to <strong>Annapurna Roti Bank</strong> and Indore volunteer shelters.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-1.5 font-medium">
              <div><strong>Quantity:</strong> {successAlert.quantity} ({successAlert.mealType})</div>
              <div><strong>Pickup Location:</strong> {successAlert.venueName}, {successAlert.location}</div>
              <div><strong>Safe Until:</strong> {successAlert.safeUntil}</div>
              <div><strong>Contact:</strong> {successAlert.contactName} ({successAlert.contactPhone})</div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleSendWhatsAppDispatch}
                className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast on WhatsApp Volunteer Groups</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                <Utensils className="w-3 h-3 text-amber-700" />
                <span>ZERO FOOD WASTAGE • INDORE EMERGENCY ENGINE</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Report Surplus Food for Rescue
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Leftover wedding banquet, hostel mess, or function food? Alert nearest food banks & shelters before it spoils.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Venue / Hall / Hostel Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shubh Labh Garden, Bypass OR SGSITS Hostel 2 Mess"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none focus:border-amber-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Quantity / Servings *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 35-40 Plates / Thalis"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Diet Type *</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                  >
                    <option value="Pure Veg">Pure Veg (शाकाहारी)</option>
                    <option value="Jain / Swaminarayan">Jain (बिना प्याज लहसुन)</option>
                    <option value="Rice & Dal Bundle">Rice, Dal & Sabji Packets</option>
                    <option value="Mixed Feast">Mixed Feast & Sweets</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Safe Consumption Window *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tonight till 2:00 AM"
                    value={safeUntil}
                    onChange={(e) => setSafeUntil(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Locality in Indore *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vijay Nagar / Palasia"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Coordinator Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Verma"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Direct Phone for Pickup *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98260 XXXXX"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Packing & Storage Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Food kept hot in bain-marie, please bring carry boxes."
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Dispatch Rescue Alert</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
