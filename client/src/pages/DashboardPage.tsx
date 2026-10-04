import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { CivicRequest } from '../types';
import { RequestCard } from '../components/ui/RequestCard';
import { StatusChip } from '../components/ui/StatusChip';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Radio,
  Clock,
  Sparkles,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, switchPersona } = useAuth();
  const [requests, setRequests] = useState<CivicRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, [user]);

  const myRequests = requests.filter((r) => r.creatorId === user?.id || r.type === 'REPORT');

  return (
    <div className="bg-[#F5F2EC] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
              USER COCKPIT • INDORE REGION
            </div>
            <h1 className="text-2xl font-bold text-ink">
              Welcome back, {user?.name || 'Citizen'}
            </h1>
            <p className="text-xs text-ink-muted font-mono mt-0.5">
              Campus Node • Trust Score: {user?.trustScore || 92}% • Active in SGSITS Mesh
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/app/create"
              className="px-4 py-2 text-xs font-bold text-white bg-brand hover:bg-brand-hover rounded-[6px] shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Broadcast Request</span>
            </Link>

            <Link
              to="/helper"
              className="px-4 py-2 text-xs font-semibold bg-surface border border-line hover:border-line-dark rounded-[6px] text-ink flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-brand" />
              <span>Helper Cockpit</span>
            </Link>
          </div>
        </div>

        {/* AI Recommendations from PRD Section 10 */}
        <div className="bg-surface border border-brand/30 rounded-[10px] p-5 shadow-clean space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-brand text-white font-mono text-[9px] uppercase font-bold rounded">
                AI MATCH RECOMMENDATIONS
              </span>
              <h3 className="text-sm font-bold text-ink">
                Priority Local Interventions
              </h3>
            </div>
            <span className="text-xs font-mono text-ink-muted">
              Based on your skills & proximity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-3.5 bg-[#FAF8F5] border border-line rounded-[8px] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-urgent font-bold uppercase">
                  92% MATCH • COMPUTER_HARDWARE
                </span>
                <h4 className="text-xs font-bold text-ink mt-0.5">
                  Lab 3 PCs won't boot (14 blocked)
                </h4>
                <p className="text-[11px] font-mono text-ink-muted mt-0.5">
                  SGSITS CS Wing • ~0.8 km away
                </p>
              </div>
              <Link
                to="/app/matches/4ea67eaa-7c97-42a7-82ac-ef26b9c61002"
                className="px-3 py-1.5 text-xs font-bold bg-brand text-white rounded-[4px] hover:bg-brand-hover shrink-0"
              >
                Inspect Match
              </Link>
            </div>

            <div className="p-3.5 bg-[#FAF8F5] border border-line rounded-[8px] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-brand font-bold uppercase">
                  88% MATCH • SURPLUS GIVE
                </span>
                <h4 className="text-xs font-bold text-ink mt-0.5">
                  2x CR2032 Lithium Cells & jumpers available
                </h4>
                <p className="text-[11px] font-mono text-ink-muted mt-0.5">
                  ECE Hub Bhawarkua • ~1.2 km away
                </p>
              </div>
              <Link
                to="/explore"
                className="px-3 py-1.5 text-xs font-semibold bg-[#F5F2EC] text-ink border border-line rounded-[4px] hover:bg-white shrink-0"
              >
                Claim Part
              </Link>
            </div>
          </div>
        </div>

        {/* Active Requests List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ink flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand" />
              <span>Your Broadcasted & Monitored Requests</span>
            </h3>
            <Link to="/explore" className="text-xs font-mono text-brand hover:underline">
              View all explore feed →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-xs font-mono text-ink-muted">
              Loading requests...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myRequests.slice(0, 6).map((r) => (
                <RequestCard key={r.id} request={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
