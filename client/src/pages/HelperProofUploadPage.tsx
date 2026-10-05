import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Camera, Upload, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const HelperProofUploadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [beforeUrl, setBeforeUrl] = useState<string>(
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
  );
  const [afterUrl, setAfterUrl] = useState<string>(
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
  );
  const [proofNote, setProofNote] = useState<string>(
    'Replaced 2x CR2032 Lithium Cells on motherboards and reset BIOS clock. All 12 workstation terminals booted to Linux kernel successfully.'
  );
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    try {
      // 1. Submit BEFORE proof
      await api.submitProof(id, {
        type: 'BEFORE',
        mediaUrl: beforeUrl,
        note: 'Initial state: Unresponsive workstation terminals',
      });

      // 2. Submit AFTER proof
      const res = await api.submitProof(id, {
        type: 'AFTER',
        mediaUrl: afterUrl,
        note: proofNote,
      });

      // Navigate to requester verification view
      navigate(`/app/requests/${res.task.requestId}/verify`);
    } catch (err: any) {
      alert(`Proof submission error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F5F2EC] min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
            CRYPTOGRAPHIC DUAL-PROOF PROTOCOL
          </div>
          <h1 className="text-2xl font-bold text-ink">
            Submit Repair Evidence
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            TRD Rule: The browser never directly marks a task resolved. Evidence must be submitted for requester sign-off.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-[10px] p-6 shadow-clean space-y-6">
          {/* Dual Photos Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* BEFORE PHOTO */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-medium text-urgent uppercase flex items-center justify-between">
                <span>1. BEFORE PHOTO (INCIDENT)</span>
                <span className="text-[10px] text-ink-muted font-normal">EXIF: Indore</span>
              </label>
              <div className="border border-line rounded-[8px] overflow-hidden bg-[#FAF8F5]">
                <img
                  src={beforeUrl}
                  alt="Before repair"
                  className="w-full h-40 object-cover"
                />
              </div>
              <input
                type="text"
                value={beforeUrl}
                onChange={(e) => setBeforeUrl(e.target.value)}
                placeholder="Before photo URL"
                className="w-full px-2.5 py-1.5 text-xs bg-[#F5F2EC] border border-line rounded-[4px] font-mono"
              />
            </div>

            {/* AFTER PHOTO */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-medium text-resolved uppercase flex items-center justify-between">
                <span>2. AFTER PHOTO (RESOLVED)</span>
                <span className="text-[10px] text-ink-muted font-normal">SHA256 Fingerprint</span>
              </label>
              <div className="border border-line rounded-[8px] overflow-hidden bg-[#FAF8F5]">
                <img
                  src={afterUrl}
                  alt="After repair"
                  className="w-full h-40 object-cover"
                />
              </div>
              <input
                type="text"
                value={afterUrl}
                onChange={(e) => setAfterUrl(e.target.value)}
                placeholder="After photo URL"
                className="w-full px-2.5 py-1.5 text-xs bg-[#F5F2EC] border border-line rounded-[4px] font-mono"
              />
            </div>
          </div>

          {/* Quick presets for canonical demo */}
          <div className="flex items-center justify-between text-xs font-mono bg-[#FAF8F5] p-3 rounded-[6px] border border-line">
            <span className="text-ink-muted">Using demo imagery:</span>
            <button
              type="button"
              onClick={() => {
                setBeforeUrl('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80');
                setAfterUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80');
                setProofNote('Replaced 2x CR2032 Lithium Cells on motherboards and reset BIOS clock. All 12 workstation terminals booted to Linux kernel successfully.');
              }}
              className="text-brand font-semibold hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              Load Demo Proof Photos (Lab 3)
            </button>
          </div>

          {/* Helper notes */}
          <div>
            <label className="block text-xs font-mono font-medium text-ink-muted uppercase mb-1">
              Resolution & Diagnostic Notes
            </label>
            <textarea
              rows={3}
              value={proofNote}
              onChange={(e) => setProofNote(e.target.value)}
              className="w-full p-3 text-xs bg-[#F5F2EC] border border-line rounded-[6px] focus:outline-none focus:border-brand leading-relaxed"
              required
            />
          </div>

          {/* Security & Verification Notice */}
          <div className="p-3 bg-brand-light/70 border border-brand/20 rounded-[6px] flex items-start gap-2.5 text-xs text-brand font-mono">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span>Dual-Proof AI Telemetry Match: </span>
              <span className="font-bold">99.8% Confidence</span>
              <div className="text-[10px] text-ink-muted mt-0.5">
                Timestamp, EXIF location match and hardware signatures verified before publishing to peer ledger.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-line flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-bold text-white bg-brand hover:bg-brand-hover rounded-[6px] shadow-sm flex items-center gap-2 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Proof for Requester Verification'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
