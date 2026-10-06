import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Match, Task } from '../types';
import { StatusChip } from '../components/ui/StatusChip';
import { UrgencyBadge } from '../components/ui/UrgencyBadge';
import { useAuth } from '../context/AuthContext';
import {
  Radio,
  Sliders,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Wrench,
} from 'lucide-react';

export const HelperCockpitPage: React.FC = () => {
  const { user, switchPersona } = useAuth();
  const navigate = useNavigate();

  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [radiusKm, setRadiusKm] = useState<number>(3.5);
  const [opportunities, setOpportunities] = useState<Match[]>([]);
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHelperData = async () => {
    // Ensure logged in as helper for this screen
    if (!user || user.role !== 'HELPER') {
      await switchPersona('aarav');
    }

    setLoading(true);
    try {
      const opps = await api.getHelperOpportunities();
      setOpportunities(opps);
      const tasks = await api.getHelperTasks();
      setActiveTasks(tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHelperData();
  }, [user]);

  const handleToggleAvailability = async () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    try {
      await api.updateAvailability({
        isAvailable: nextState,
        radiusKm,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptOpportunity = async (matchId: string) => {
    try {
      const task = await api.acceptMatch(matchId);
      navigate(`/helper/tasks/${task.id}`);
    } catch (err: any) {
      alert(`Accept failed: ${err.message}`);
    }
  };

  return (
    <div className="bg-[#F5F2EC] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
              HELPER COCKPIT • VOLUNTEER NODE
            </div>
            <h1 className="text-2xl font-bold text-ink">
              {user?.name || 'Aarav Patel'} (Node #084)
            </h1>
            <p className="text-xs text-ink-muted font-mono mt-0.5">
              Hardware Specialist • 18 Verified Resolutions • Trust: 96%
            </p>
          </div>

          {/* Availability Toggle Box */}
          <div className="bg-surface border border-line rounded-[8px] p-3 flex items-center gap-4 shadow-clean">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isAvailable ? 'bg-emerald-500' : 'bg-ink-subtle'
                }`}
              />
              <span className="text-xs font-mono font-bold text-ink">
                {isAvailable ? 'AVAILABILITY ON' : 'STANDBY (OFF)'}
              </span>
            </div>

            <button
              onClick={handleToggleAvailability}
              className={`px-3 py-1 text-xs font-mono font-semibold rounded-[4px] border transition-all ${
                isAvailable
                  ? 'bg-brand text-white border-brand'
                  : 'bg-[#F5F2EC] text-ink-muted border-line'
              }`}
            >
              Toggle
            </button>
          </div>
        </div>

        {/* Active Dispatches (If Any) */}
        {activeTasks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-brand flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Active Assigned Dispatches ({activeTasks.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTasks.map((t) => (
                <div
                  key={t.id}
                  className="bg-surface border-2 border-brand/50 rounded-[10px] p-4 shadow-clean flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase bg-[#F5F2EC] px-2 py-0.5 rounded border border-line">
                        {t.request?.type}
                      </span>
                      <StatusChip status={t.status} size="sm" />
                    </div>

                    <h4 className="text-sm font-bold text-ink mb-1">
                      {t.request?.title}
                    </h4>
                    <p className="text-xs text-ink-muted line-clamp-2 mb-3">
                      {t.request?.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-line flex items-center justify-between">
                    <span className="text-xs font-mono text-ink-muted">
                      {t.request?.locationText}
                    </span>
                    <Link
                      to={`/helper/tasks/${t.id}`}
                      className="px-3 py-1.5 text-xs font-bold bg-brand text-white rounded-[6px] hover:bg-brand-hover flex items-center gap-1"
                    >
                      <span>Task Execution</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Opportunities Ranked by Score */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-brand" />
              <span>Nearby Opportunities Ranked by Fit & Urgency</span>
            </h3>

            <span className="text-xs font-mono text-ink-muted">
              Matching Range: ~{radiusKm} km
            </span>
          </div>

          {opportunities.length === 0 ? (
            <div className="bg-surface border border-line rounded-[10px] p-8 text-center text-xs font-mono text-ink-muted">
              No matching open requests within your radius right now.
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="bg-surface border border-line hover:border-line-dark rounded-[10px] p-5 shadow-clean flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-mono font-bold bg-brand-light text-brand border border-brand/20 rounded">
                        {opp.score}% FIT MATCH
                      </span>
                      <UrgencyBadge urgency={opp.request?.urgency || 'HIGH'} />
                      <span className="text-xs font-mono text-ink-muted">
                        {opp.distanceKm} km away
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-ink">
                      {opp.request?.title}
                    </h4>
                    <p className="text-xs text-ink-muted">
                      {opp.request?.description}
                    </p>

                    <div className="text-[11px] font-mono text-brand bg-brand-light/40 px-2 py-0.5 rounded border border-brand/10 inline-block">
                      {opp.explanation}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto shrink-0">
                    <Link
                      to={`/app/matches/${opp.requestId}`}
                      className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold bg-[#F5F2EC] hover:bg-white text-ink border border-line rounded-[6px] text-center"
                    >
                      Inspect Fit
                    </Link>

                    <button
                      onClick={() => handleAcceptOpportunity(opp.id)}
                      className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-white bg-brand hover:bg-brand-hover rounded-[6px] shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Accept Task</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
