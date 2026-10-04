import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { CivicRequest, Task } from '../types';
import { StatusChip } from '../components/ui/StatusChip';
import { UrgencyBadge } from '../components/ui/UrgencyBadge';
import { Timeline } from '../components/ui/Timeline';
import { getSocket } from '../services/socket';
import {
  MapPin,
  Clock,
  Sparkles,
  UserCheck,
  MessageSquare,
  ShieldCheck,
  Camera,
  ArrowRight,
  Radio,
} from 'lucide-react';

export const TrackingTimelinePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<CivicRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

    const socket = getSocket();
    const handleUpdate = () => {
      fetchRequest();
    };
    socket.on('task:updated', handleUpdate);
    socket.on('proof:submitted', handleUpdate);

    return () => {
      socket.off('task:updated', handleUpdate);
      socket.off('proof:submitted', handleUpdate);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#F5F2EC] min-h-screen py-12 text-center text-xs font-mono">
        Loading tracking timeline...
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
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
              REQUEST TRACKING TIMELINE
            </div>
            <h1 className="text-2xl font-bold text-ink">
              Lifecycle & Live Progression
            </h1>
          </div>
          <StatusChip status={request.status} />
        </div>

        {/* Timeline Component */}
        <Timeline status={request.status} />

        {/* Request Overview */}
        <div className="bg-surface border border-line rounded-[10px] p-6 shadow-clean space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase bg-[#F5F2EC] border border-line rounded">
                {request.type}
              </span>
              <UrgencyBadge urgency={request.urgency} />
            </div>
            <span className="text-xs font-mono text-ink-muted">
              Reported by {request.creator?.name || 'Priya Sharma'}
            </span>
          </div>

          <h2 className="text-xl font-bold text-ink">{request.title}</h2>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            {request.description}
          </p>

          <div className="pt-3 border-t border-line flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-ink-muted">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand" />
              <span>{request.locationText}</span>
            </div>
            <div>Impact: {request.affectedCount} individuals blocked</div>
          </div>
        </div>

        {/* AI Insight Block if present */}
        {request.aiAudit && (
          <div className="bg-brand-light/70 border border-brand/20 rounded-[10px] p-4 text-xs font-mono space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-brand text-white text-[9px] uppercase font-bold rounded">
                AI TRIAGE AUDIT
              </span>
              <span className="font-bold text-brand">Model: {request.aiAudit.modelVersion}</span>
            </div>
            <p className="text-ink text-[11px] leading-relaxed">
              {request.aiAudit.summary}
            </p>
          </div>
        )}

        {/* Active Helper or Matching Section */}
        {activeTask ? (
          <div className="bg-surface border border-brand/40 rounded-[10px] p-5 shadow-clean space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-brand" />
                <h3 className="text-sm font-bold text-ink">
                  Assigned Helper: {activeTask.helper?.name}
                </h3>
              </div>
              <StatusChip status={activeTask.status} size="sm" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="text-xs font-mono text-ink-muted">
                {activeTask.status === 'ACCEPTED' && 'Helper accepted dispatch and preparing gear.'}
                {activeTask.status === 'IN_PROGRESS' && 'Helper en route to location.'}
                {activeTask.status === 'ARRIVED' && 'Helper arrived on site for diagnostics.'}
                {activeTask.status === 'PROOF_SUBMITTED' && 'Repair proof uploaded and waiting for your sign-off.'}
                {activeTask.status === 'RESOLVED' && 'Task verified and completed.'}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/app/messages/${activeTask.id}`}
                  className="px-3 py-1.5 text-xs font-mono bg-[#F5F2EC] hover:bg-white border border-line rounded-[6px] text-ink flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-brand" />
                  <span>Task Chat</span>
                </Link>

                <Link
                  to={`/helper/tasks/${activeTask.id}`}
                  className="px-3 py-1.5 text-xs font-mono bg-brand text-white rounded-[6px] hover:bg-brand-hover flex items-center gap-1.5 font-bold"
                >
                  <span>Helper Cockpit View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Proof review link if waiting verification */}
            {(request.status === 'PROOF_SUBMITTED' || request.status === 'AWAITING_VERIFICATION') && (
              <div className="mt-3 p-3 bg-resolved-light border border-resolved/30 rounded-[6px] flex items-center justify-between">
                <span className="text-xs font-mono text-resolved font-bold">
                  Evidence has been uploaded by helper!
                </span>
                <Link
                  to={`/app/requests/${request.id}/verify`}
                  className="px-3.5 py-1.5 text-xs font-bold bg-resolved text-white rounded-[4px] hover:bg-emerald-800"
                >
                  Inspect & Verify Proof →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-surface border border-line rounded-[10px] p-5 shadow-clean flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-ink">
                Matching Active Helpers
              </h4>
              <p className="text-xs text-ink-muted">
                Inspect 92% match candidates and factor breakdowns.
              </p>
            </div>
            <Link
              to={`/app/matches/${request.id}`}
              className="px-4 py-2 text-xs font-bold text-white bg-brand hover:bg-brand-hover rounded-[6px] flex items-center gap-1.5 shadow-sm"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Inspect Matches</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
