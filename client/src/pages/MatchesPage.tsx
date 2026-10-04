import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Match, CivicRequest } from '../types';
import { MatchScoreRing } from '../components/ui/MatchScoreRing';
import { StatusChip } from '../components/ui/StatusChip';
import { UrgencyBadge } from '../components/ui/UrgencyBadge';
import { useAuth } from '../context/AuthContext';
import {
  UserCheck,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Phone,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

export const MatchesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, switchPersona } = useAuth();

  const [request, setRequest] = useState<CivicRequest | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const fetchMatches = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const reqData = await api.getRequestById(id);
      setRequest(reqData);
      const matchesData = await api.getRequestMatches(id);
      setMatches(matchesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [id]);

  const handleAcceptMatch = async (matchId: string) => {
    // If not logged in as helper, automatically switch persona to Aarav Patel for smooth demonstration
    if (!user || user.role !== 'HELPER') {
      await switchPersona('aarav');
    }

    setAcceptingId(matchId);
    try {
      const task = await api.acceptMatch(matchId);
      // Navigate to tracking or helper cockpit
      navigate(`/helper/tasks/${task.id}`);
    } catch (err: any) {
      alert(`Accept error: ${err.message}`);
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F5F2EC] min-h-screen py-12 text-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs font-mono text-ink-muted">Calculating multi-factor helper matches...</span>
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

  return (
    <div className="bg-[#F5F2EC] min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
              MATCHING ENGINE • EXPLAINABLE TRIAGE
            </div>
            <h1 className="text-2xl font-bold text-ink">
              Ranked Helper Candidates
            </h1>
          </div>
          <StatusChip status={request.status} />
        </div>

        {/* Source Request Summary Card */}
        <div className="bg-surface border border-line rounded-[10px] p-4 shadow-clean flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#F5F2EC] border border-line rounded">
                {request.type}
              </span>
              <UrgencyBadge urgency={request.urgency} />
              <span className="text-xs font-bold text-ink">{request.title}</span>
            </div>
            <p className="text-xs text-ink-muted flex items-center gap-2 font-mono">
              <MapPin className="w-3.5 h-3.5 text-ink-subtle" />
              <span>{request.locationText}</span>
              <span>• {request.affectedCount} individuals blocked</span>
            </p>
          </div>

          <Link
            to={`/app/requests/${request.id}`}
            className="text-xs font-semibold text-brand hover:underline shrink-0"
          >
            View Tracking Timeline →
          </Link>
        </div>

        {/* Matches List */}
        <div className="space-y-5">
          {matches.map((m, index) => {
            const isTopCandidate = index === 0;

            return (
              <div
                key={m.id}
                className={`bg-surface border rounded-[10px] p-5 shadow-clean space-y-4 ${
                  isTopCandidate
                    ? 'border-brand ring-1 ring-brand/30'
                    : 'border-line'
                }`}
              >
                {/* Candidate Rank Banner */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-mono font-bold rounded ${
                        isTopCandidate
                          ? 'bg-brand text-white'
                          : 'bg-[#F5F2EC] text-ink-muted border border-line'
                      }`}
                    >
                      {isTopCandidate ? '★ OPTIMAL MATCH' : `CANDIDATE #${index + 1}`}
                    </span>
                    <span className="text-xs font-mono text-ink-muted">
                      {m.distanceKm} km from location
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Trust Score: {m.helper?.trustScore || 90}%</span>
                  </div>
                </div>

                {/* Helper Profile Info */}
                <div className="flex items-start justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-brand-light text-brand font-bold text-base flex items-center justify-center font-mono border border-brand/20">
                      {m.helper?.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-ink">
                        {m.helper?.name}
                      </h3>
                      <p className="text-xs text-ink-muted">
                        {m.helper?.bio || 'Verified campus volunteer'}
                      </p>
                    </div>
                  </div>

                  {/* Skills badges */}
                  <div className="hidden sm:flex flex-wrap gap-1 max-w-xs justify-end">
                    {m.helper?.skills?.map((s) => (
                      <span
                        key={s.id}
                        className="px-2 py-0.5 bg-[#F5F2EC] border border-line rounded text-[10px] font-mono text-ink"
                      >
                        {s.skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Match Score Ring & Multi-Factor Factor Breakdown */}
                <MatchScoreRing
                  score={m.score}
                  skillFit={m.skillFit}
                  distance={m.distance}
                  availability={m.availability}
                  experience={m.experience}
                  trust={m.trust}
                  distanceKm={m.distanceKm}
                  explanation={m.explanation}
                />

                {/* Action Bar */}
                <div className="pt-3 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs font-mono text-ink-muted flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-ink-subtle" />
                    <span>Instant dispatch ready • Helper notified</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Simulated acceptance button */}
                    <button
                      onClick={() => handleAcceptMatch(m.id)}
                      disabled={acceptingId === m.id}
                      className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-white bg-brand hover:bg-brand-hover rounded-[6px] shadow-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>
                        {user?.role === 'HELPER'
                          ? 'Accept Task as Helper'
                          : 'Accept Task (Demo Helper)'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
