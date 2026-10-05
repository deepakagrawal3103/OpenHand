import React, { useState } from 'react';
import { Star, ShieldCheck, Check, X, ThumbsUp, Sparkles } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetName: string;
  targetRole: string; // 'Technician' | 'Seller' | 'Rental Owner' | 'Donor'
  onReviewSubmitted?: (newRating: number, reviewCount: number, badges: string[]) => void;
}

const AVAILABLE_ENDORSEMENT_BADGES = [
  '⚡ On-Time Arrival',
  '🧹 Clean & Sanitized',
  '💰 Fair & Honest Price',
  '🤝 Respectful & Polite',
  '📚 100% Genuine Item',
  '🛡️ Safe for Students',
  '🔧 Expert Diagnosis',
  '✅ Zero Bargain Hassle',
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetName,
  targetRole,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([
    '⚡ On-Time Arrival',
    '🤝 Respectful & Polite',
  ]);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleToggleBadge = (badge: string) => {
    if (selectedBadges.includes(badge)) {
      setSelectedBadges(selectedBadges.filter((b) => b !== badge));
    } else {
      setSelectedBadges([...selectedBadges, badge]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existingReviewsRaw = localStorage.getItem(`openhand_reviews_${targetId}`);
    const existingReviews = existingReviewsRaw ? JSON.parse(existingReviewsRaw) : [];

    const newReview = {
      id: `rev-${Date.now()}`,
      targetId,
      rating,
      selectedBadges,
      comment: comment || 'Verified pleasant community handoff in Indore.',
      reviewerName: 'Indore Community Member',
      createdAt: 'Just now',
    };

    const updated = [newReview, ...existingReviews];
    localStorage.setItem(`openhand_reviews_${targetId}`, JSON.stringify(updated));

    // Calculate aggregated score
    const avgRating = Number(
      (updated.reduce((acc: number, r: any) => acc + r.rating, 0) / updated.length).toFixed(1)
    );

    if (onReviewSubmitted) {
      onReviewSubmitted(avgRating, updated.length, selectedBadges);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
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

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Endorsement Recorded!</h3>
            <p className="text-xs text-slate-600">
              Thank you for strengthening Indore's verified civic trust network.
            </p>
          </div>
        ) : (
          <>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>CIVIC TRUST ENDORSEMENT</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Rate & Endorse {targetName}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Role: <strong>{targetRole}</strong> in Indore. Your review builds transparent community trust.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Rating *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-sm text-slate-800 ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Endorsement Badges */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Select Verified Endorsements:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_ENDORSEMENT_BADGES.map((badge) => {
                    const isSelected = selectedBadges.includes(badge);
                    return (
                      <button
                        type="button"
                        key={badge}
                        onClick={() => handleToggleBadge(badge)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment Input */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Community Feedback / Notes
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Came on time, solved the bathroom water leakage with proper parts, very courteous."
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none focus:border-emerald-600 text-xs"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md"
                >
                  Submit Trust Review
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
