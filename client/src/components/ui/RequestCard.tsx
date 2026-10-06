import React from 'react';
import { Link } from 'react-router-dom';
import { CivicRequest } from '../../types';
import { StatusChip } from './StatusChip';
import { UrgencyBadge } from './UrgencyBadge';
import { MapPin, Users, Sparkles, ArrowRight } from 'lucide-react';

interface RequestCardProps {
  request: CivicRequest;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  const isReport = request.type === 'REPORT';
  const hasAi = !!request.aiAudit;

  return (
    <div className="bg-surface border border-line rounded-[10px] p-4 hover:border-line-dark transition-all duration-200 shadow-clean flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider rounded-[4px] bg-[#F5F2EC] text-ink border border-line">
              {request.type}
            </span>
            <UrgencyBadge urgency={request.urgency} />
          </div>
          <StatusChip status={request.status} size="sm" />
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-ink leading-snug line-clamp-1 mb-1.5">
          {request.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-ink-muted line-clamp-2 mb-3">
          {request.description}
        </p>

        {/* AI Insight Snippet if present */}
        {hasAi && (
          <div className="bg-brand-light/60 border border-brand/20 rounded-[6px] p-2 mb-3 flex items-start gap-2 text-xs">
            <span className="px-1.5 py-0.5 bg-brand text-white font-mono text-[9px] uppercase rounded-[2px] mt-0.5 shrink-0 font-bold">
              TRIAGE
            </span>
            <span className="text-brand font-medium line-clamp-1 text-[11px]">
              {request.aiAudit?.summary || 'Triage ready: verified campus blockers.'}
            </span>
          </div>
        )}
      </div>

      <div>
        {/* Metadata Footer */}
        <div className="pt-3 border-t border-line flex items-center justify-between text-xs text-ink-muted font-mono">
          <div className="flex items-center gap-1 truncate max-w-[65%]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-ink-subtle" />
            <span className="truncate">{request.locationText}</span>
            {request.distanceKm !== undefined && (
              <span className="text-brand font-semibold">({request.distanceKm} km)</span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Users className="w-3.5 h-3.5 text-ink-subtle" />
            <span>{request.affectedCount} blocked</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="mt-3">
          <Link
            to={
              request.status === 'MATCHING' || request.status === 'MATCHED'
                ? `/app/matches/${request.id}`
                : request.tasks && request.tasks.length > 0
                ? `/app/requests/${request.id}`
                : `/app/request/${request.id}`
            }
            className="w-full py-1.5 px-3 bg-[#F5F2EC] hover:bg-brand hover:text-white text-ink text-xs font-semibold rounded-[6px] border border-line hover:border-brand transition-colors flex items-center justify-center gap-1.5"
          >
            <span>
              {request.status === 'MATCHING'
                ? 'Inspect 92% Match'
                : request.status === 'RESOLVED'
                ? 'View Verified Resolution'
                : 'View Request Details'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
