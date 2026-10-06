import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { CivicRequest } from '../types';
import { StatusChip } from '../components/ui/StatusChip';
import { UrgencyBadge } from '../components/ui/UrgencyBadge';
import { Timeline } from '../components/ui/Timeline';
import { MapPin, Users, Sparkles, Radio, MessageSquare, ArrowRight } from 'lucide-react';

export const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<CivicRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    api
      .getRequestById(id)
      .then(setRequest)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#F5F2EC] min-h-screen py-12 text-center text-xs font-mono">
        Loading request details...
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

  return (
    <div className="bg-[#F5F2EC] min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
              REQUEST ARCHIVE • {request.category}
            </div>
            <h1 className="text-2xl font-bold text-ink">{request.title}</h1>
          </div>
          <StatusChip status={request.status} />
        </div>

        <Timeline status={request.status} />

        <div className="bg-surface border border-line rounded-[10px] p-6 shadow-clean space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase bg-[#F5F2EC] border border-line rounded">
                {request.type}
              </span>
              <UrgencyBadge urgency={request.urgency} />
            </div>
            <span className="text-xs font-mono text-ink-muted">
              Reported by {request.creator?.name}
            </span>
          </div>

          <p className="text-sm text-ink-muted leading-relaxed">
            {request.description}
          </p>

          <div className="pt-3 border-t border-line flex flex-wrap items-center justify-between text-xs font-mono text-ink-muted">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand" />
              <span>{request.locationText}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{request.affectedCount} individuals blocked</span>
            </div>
          </div>
        </div>

        {/* AI Insight block */}
        {request.aiAudit && (
          <div className="p-4 bg-brand-light/70 border border-brand/20 rounded-[8px] space-y-1.5 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-brand text-white text-[9px] uppercase font-bold rounded">
                AUTOMATED TRIAGE SUMMARY
              </span>
              <span className="font-bold text-brand">System Verified</span>
            </div>
            <p className="text-ink text-[11px] leading-relaxed">
              {request.aiAudit.summary}
            </p>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="pt-4 flex flex-wrap items-center justify-end gap-3">
          <Link
            to={`/app/matches/${request.id}`}
            className="px-5 py-2.5 text-xs font-bold text-white bg-brand hover:bg-brand-hover rounded-[6px] shadow-sm flex items-center gap-2"
          >
            <Radio className="w-4 h-4" />
            <span>Inspect 92% Matches</span>
          </Link>

          {activeTask && (
            <Link
              to={`/app/requests/${request.id}`}
              className="px-5 py-2.5 text-xs font-semibold bg-surface border border-line hover:border-line-dark text-ink rounded-[6px] flex items-center gap-2"
            >
              <span>View Tracking Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
