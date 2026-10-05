import React, { useState } from 'react';
import { MessageCircle, Copy, Check, Share2, X, ExternalLink } from 'lucide-react';

export interface ShareData {
  title: string;
  type: 'MARKET_ITEM' | 'RENTAL' | 'DONATION' | 'FOOD_RESCUE' | 'SERVICE_PROVIDER';
  price?: number;
  rentalPeriod?: string;
  deposit?: number;
  location: string;
  sellerOrContact?: string;
  details?: string;
  customUrl?: string;
}

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareData;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const currentUrl = data.customUrl || window.location.href;

  const generateShareMessage = (): string => {
    switch (data.type) {
      case 'RENTAL':
        return `🔄 *OpenHand Indore: Available for RENT!*\n\n📦 *Item:* ${data.title}\n💰 *Rental Rate:* ₹${data.price}/${data.rentalPeriod || 'day'}${data.deposit ? ` (Refundable Deposit: ₹${data.deposit})` : ''}\n📍 *Pickup Area:* ${data.location}\n👤 *Contact:* ${data.sellerOrContact || 'Indore Resident'}\n\n💡 *Why rent?* Great for temporary medical recovery, surgery, or short-term work.\n👉 *View & Rent on OpenHand:* ${currentUrl}\n\n_100% Free & Direct Civic Network for Indore_`;

      case 'MARKET_ITEM':
        return `🏷️ *OpenHand Indore: Student Campus Deal!*\n\n📚 *Item:* ${data.title}\n💰 *Price:* ₹${data.price} (Student-friendly price)\n📍 *Location:* ${data.location}\n👤 *Posted by:* ${data.sellerOrContact || 'Student'}\n\n👉 *Claim or inspect listing:* ${currentUrl}\n\n_Direct handoff with zero commission._`;

      case 'DONATION':
        return `🙏 *OpenHand Indore: Urgent Shelter Donation Appeal!*\n\n🏠 *Shelter:* ${data.title}\n📦 *Urgent Wishlist:* ${data.details || 'Winter Shawls, Blankets & Supplies'}\n📍 *Location:* ${data.location}\n\n👉 *Support or coordinate direct drop-off:* ${currentUrl}\n\n_Let's support our local Indore shelters._`;

      case 'FOOD_RESCUE':
        return `🍲 *URGENT: Surplus Food Available in Indore!*\n\n🍱 *Quantity:* ${data.title}\n📍 *Pickup Venue:* ${data.location}\n⏰ *Safe till:* ${data.details || 'Next 3 hours'}\n📞 *Coordinate pickup:* ${data.sellerOrContact}\n\n👉 *View Food Rescue Alert:* ${currentUrl}\n\n_Please share in your Indore hostel or volunteer groups to prevent food wastage._`;

      case 'SERVICE_PROVIDER':
        return `🔧 *Verified Local Technician on OpenHand Indore*\n\n👷 *Name:* ${data.title}\n🛠️ *Trade / Work:* ${data.details || 'Plumbing & Electrical Repair'}\n💵 *Inspection Visit Fee:* ₹${data.price || 150}\n📍 *Serving Area:* ${data.location}\n\n👉 *Call or message on WhatsApp:* ${currentUrl}\n\n_Verified local mistri with zero middleman markup._`;

      default:
        return `📢 *OpenHand Indore Community Listing*\n\n*${data.title}*\n📍 Location: ${data.location}\n👉 Details: ${currentUrl}`;
    }
  };

  const messageText = generateShareMessage();

  const handleShareToWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
            <Share2 className="w-3 h-3 text-emerald-600" />
            <span>COMMUNITY BROADCAST</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            Share to WhatsApp Groups
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Share with your college batch, hostel wing, or Indore neighbourhood WhatsApp group.
          </p>
        </div>

        {/* Message Preview Box */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono whitespace-pre-line text-slate-700 max-h-48 overflow-y-auto leading-relaxed select-all">
          {messageText}
        </div>

        {/* Quick Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleShareToWhatsApp}
            className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white text-white" />
            <span>Send to WhatsApp (Direct Share)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyText}
              className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied Text!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Message</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied Link!</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
