import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { CivicRequest, Proof } from '../types';
import { StatusChip } from '../components/ui/StatusChip';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Star,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export const VerificationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, switchPersona } = useAuth();

  const [request, setRequest] = useState<CivicRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('Verified in person. All 12 PCs booted to OS before practicals!');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [resolvedSuccess, setResolvedSuccess] = useState<boolean>(false);

  const fetchRequest = async () => {
    if (!id) return;
    try {
      const data = await api.getRequestById(id);
      setRequest(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const handleVerify = async (outcome: 'CONFIRMED' | 'REWORK_REQUESTED' | 'DISPUTED') => {
    if (!id) return;

    // If logged in as helper, switch to requester Priya so that authorization passes!
    if (!user || user.id !== request?.creatorId) {
      await switchPersona('priya');
    }

    setSubmitting(true);
    try {
      await api.verifyRequest(id, {
        outcome,
        comment,
        rating,
      });

      if (outcome === 'CONFIRMED') {
        setResolvedSuccess(true);
      } else {
        alert(`Verification status updated to ${outcome}`);
        navigate(`/app/requests/${id}`);
      }
    } catch (err: any) {
      alert(`Verification error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F5F2EC] min-h-screen py-12 text-center text-xs font-mono">
        Loading proof inspection...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="bg-[#F5F2EC] min-h-screen py-12 text-center text-xs font-mono">
        Request not found.
      </div>
    );
  }

  const activeTask = request.tasks && request.tasks[0];
  const proofs = activeTask?.proofs || [];
  const beforeProof = proofs.find((p) => p.type === 'BEFORE');
  const afterProof = proofs.find((p) => p.type === 'AFTER') || proofs[0];

  return (
    <div className="bg-[#F5F2EC] min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
              REQUESTER VERIFICATION • CLOSE REQUEST
            </div>
            <h1 className="text-2xl font-bold text-ink">
              Proof & Completion Sign-Off
            </h1>
          </div>
          <StatusChip status={request.status} />
        </div>

        {resolvedSuccess ? (
          <div className="bg-surface border-2 border-resolved rounded-[10px] p-8 text-center space-y-4 shadow-elevated">
            <div className="w-16 h-16 rounded-full bg-resolved-light text-resolved mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-resolved" />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-mono font-bold uppercase text-resolved tracking-wider">
                COMMUNITY TRANSACTION RESOLVED
              </div>
              <h2 className="text-2xl font-bold text-ink">
                Verified Resolution Recorded
              </h2>
              <p className="text-xs text-ink-muted max-w-md mx-auto">
                The request is now complete! Helper Aarav Patel has been credited with positive community rating.
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Link
                to={`/app/requests/${request.id}`}
                className="px-5 py-2.5 text-xs font-bold bg-brand text-white rounded-[6px] hover:bg-brand-hover"
              >
                View Final Tracking Timeline
              </Link>
              <Link
                to="/live"
                className="px-5 py-2.5 text-xs font-semibold bg-[#F5F2EC] text-ink border border-line rounded-[6px] hover:bg-white"
              >
                Watch on OpenHand Live
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Requester Notice */}
            <div className="p-4 bg-surface border border-line rounded-[10px] flex items-center justify-between shadow-clean">
              <div>
                <h3 className="text-sm font-bold text-ink">{request.title}</h3>
                <p className="text-xs text-ink-muted font-mono mt-0.5">
                  Assigned Helper: {activeTask?.helper?.name || 'Aarav Patel'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-brand">
                  Proof Ready for Audit
                </span>
              </div>
            </div>

            {/* Before / After Inspection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* BEFORE */}
              <div className="bg-surface border border-urgent/30 rounded-[10px] p-4 shadow-clean space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-urgent font-bold">
                  <span>BEFORE (REPORTED STATE)</span>
                  <span className="text-[10px] text-ink-muted">Campus Lab 3</span>
                </div>
                <div className="rounded-[6px] overflow-hidden border border-line h-48 bg-black/5">
                  <img
                    src={beforeProof?.mediaUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-ink-muted font-mono">
                  {beforeProof?.note || 'Initial status: 12 lab workstations failing to POST.'}
                </p>
              </div>

              {/* AFTER */}
              <div className="bg-surface border border-resolved/40 rounded-[10px] p-4 shadow-clean space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-resolved font-bold">
                  <span>AFTER (SUBMITTED REPAIR)</span>
                  <span className="text-[10px] text-brand">SHA256 Signed</span>
                </div>
                <div className="rounded-[6px] overflow-hidden border border-line h-48 bg-black/5">
                  <img
                    src={afterProof?.mediaUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-ink-muted font-mono">
                  {afterProof?.note || 'Replaced 2x CR2032 Lithium Cells; BIOS clock reset; workstations booted.'}
                </p>
              </div>
            </div>

            {/* Verification Form */}
            <div className="bg-surface border border-line rounded-[10px] p-6 shadow-clean space-y-5">
              <h3 className="text-sm font-bold text-ink">
                Requester Evaluation
              </h3>

              {/* Rating */}
              <div>
                <label className="block text-xs font-mono uppercase text-ink-muted mb-2">
                  Helper Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-line-dark'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold ml-2 text-ink">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Feedback Comment */}
              <div>
                <label className="block text-xs font-mono uppercase text-ink-muted mb-1">
                  Requester Notes / Comments
                </label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F5F2EC] border border-line rounded-[6px] focus:outline-none focus:border-brand font-mono"
                />
              </div>

              {/* Verification Actions */}
              <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleVerify('REWORK_REQUESTED')}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-urgent bg-urgent-light border border-urgent/30 hover:bg-urgent hover:text-white rounded-[6px] flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Rework</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleVerify('CONFIRMED')}
                  disabled={submitting}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-resolved hover:bg-emerald-800 rounded-[6px] flex items-center gap-2 shadow-sm transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Resolution & Close</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
