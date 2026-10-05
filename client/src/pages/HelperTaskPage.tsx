import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Task } from '../types';
import { StatusChip } from '../components/ui/StatusChip';
import { UrgencyBadge } from '../components/ui/UrgencyBadge';
import { Timeline } from '../components/ui/Timeline';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../services/socket';
import {
  Clock,
  MapPin,
  Play,
  Navigation,
  Camera,
  MessageSquare,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Phone,
} from 'lucide-react';

export const HelperTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [etaInput, setEtaInput] = useState<number>(15);

  const fetchTask = async () => {
    if (!id) return;
    try {
      const data = await api.getTaskById(id);
      setTask(data);
      if (data.etaMinutes) setEtaInput(data.etaMinutes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();

    // Subscribe to task updates over Socket.IO
    const socket = getSocket();
    socket.emit('join:task', id);
    const handleUpdate = (payload: any) => {
      if (payload.taskId === id) {
        fetchTask();
      }
    };
    socket.on('task:updated', handleUpdate);

    return () => {
      socket.off('task:updated', handleUpdate);
    };
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!id) return;
    setUpdating(true);
    try {
      const updated = await api.updateTaskStatus(id, {
        status: newStatus,
        etaMinutes: etaInput,
      });
      setTask(updated);
    } catch (err: any) {
      alert(`Status update error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F5F2EC] min-h-screen py-12 text-center text-xs font-mono">
        Loading active task...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-[#F5F2EC] min-h-screen py-12 text-center text-xs font-mono">
        Task not found.
      </div>
    );
  }

  const req = task.request;

  return (
    <div className="bg-[#F5F2EC] min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
              HELPER COCKPIT • ACTIVE DISPATCH
            </div>
            <h1 className="text-2xl font-bold text-ink">
              Task Execution
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <StatusChip status={task.status} />
            <Link
              to={`/app/messages/${task.id}`}
              className="px-3 py-1.5 text-xs font-mono font-semibold bg-surface border border-line rounded-[6px] hover:border-line-dark flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-brand" />
              <span>Task Chat</span>
            </Link>
          </div>
        </div>

        {/* Lifecycle Tracker */}
        <Timeline status={task.status} />

        {/* Primary Action Banner */}
        <div className="bg-surface border-2 border-brand rounded-[10px] p-6 shadow-clean space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-line">
            <div>
              <div className="text-[11px] font-mono uppercase text-brand font-bold tracking-wider">
                PRIMARY ACTION
              </div>
              <h3 className="text-lg font-bold text-ink">
                Next Operational Step
              </h3>
            </div>

            {/* Current ETA display / quick adjust */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-ink-subtle" />
              <span>ETA: {task.etaMinutes || 15} min</span>
            </div>
          </div>

          {/* Progressive Action Button Logic */}
          <div className="pt-2">
            {task.status === 'ACCEPTED' && (
              <div className="space-y-3">
                <p className="text-xs text-ink-muted">
                  You have locked this dispatch. Click below when heading out to notify the requester.
                </p>
                <button
                  onClick={() => handleUpdateStatus('IN_PROGRESS')}
                  disabled={updating}
                  className="w-full py-3 px-4 text-sm font-bold text-white bg-brand hover:bg-brand-hover rounded-[6px] shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Task & En Route (T + 02m)</span>
                </button>
              </div>
            )}

            {task.status === 'IN_PROGRESS' && (
              <div className="space-y-3">
                <p className="text-xs text-ink-muted">
                  You are currently traveling towards the incident landmark. Mark arrival when on site.
                </p>
                <button
                  onClick={() => handleUpdateStatus('ARRIVED')}
                  disabled={updating}
                  className="w-full py-3 px-4 text-sm font-bold text-white bg-brand hover:bg-brand-hover rounded-[6px] shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>I Have Arrived at Location</span>
                </button>
              </div>
            )}

            {task.status === 'ARRIVED' && (
              <div className="space-y-3">
                <p className="text-xs text-ink-muted">
                  You are on site diagnosing the problem. Once the fix is verified, upload before/after photos.
                </p>
                <button
                  onClick={() => navigate(`/helper/tasks/${task.id}/proof`)}
                  className="w-full py-3 px-4 text-sm font-bold text-white bg-brand hover:bg-brand-hover rounded-[6px] shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Submit Before/After Proof & Complete Fix</span>
                </button>
              </div>
            )}

            {(task.status === 'PROOF_SUBMITTED' || task.status === 'AWAITING_VERIFICATION') && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[6px] text-xs font-mono text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Proof Uploaded & Awaiting Requester Verification</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  The requester has been notified with your resolution evidence. As soon as they confirm, the task will be marked RESOLVED and trust points will be awarded.
                </p>
                <div className="pt-2">
                  <Link
                    to={`/app/requests/${task.requestId}/verify`}
                    className="text-emerald-800 font-bold hover:underline"
                  >
                    View Verification Screen (Demo Requester Review) →
                  </Link>
                </div>
              </div>
            )}

            {task.status === 'RESOLVED' && (
              <div className="p-4 bg-resolved-light border border-resolved/30 rounded-[6px] text-xs font-mono text-resolved space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Task Successfully Verified & Resolved</span>
                </div>
                <p className="text-[11px]">
                  Cryptographic ledger proof confirmed. Helper reputation +25 trust points awarded.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Task & Requester Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Incident Info */}
          <div className="bg-surface border border-line rounded-[10px] p-5 shadow-clean space-y-3">
            <h4 className="text-xs font-mono uppercase text-ink-muted tracking-wider">
              Incident Requirement
            </h4>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#F5F2EC] rounded border border-line">
                {req?.type}
              </span>
              <UrgencyBadge urgency={req?.urgency || 'HIGH'} />
            </div>
            <h3 className="text-base font-bold text-ink">{req?.title}</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              {req?.description}
            </p>

            <div className="pt-3 border-t border-line text-xs font-mono text-ink-muted space-y-1.5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand" />
                <span className="text-ink font-semibold">{req?.locationText}</span>
              </div>
              <div className="text-[11px]">
                Impact: {req?.affectedCount} students blocked
              </div>
            </div>
          </div>

          {/* Requester Contact & Coordination */}
          <div className="bg-surface border border-line rounded-[10px] p-5 shadow-clean space-y-3">
            <h4 className="text-xs font-mono uppercase text-ink-muted tracking-wider">
              Requester Contact
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-light text-brand font-bold flex items-center justify-center font-mono">
                {req?.creator?.name.slice(0, 2).toUpperCase() || 'PS'}
              </div>
              <div>
                <div className="text-sm font-bold text-ink">
                  {req?.creator?.name || 'Priya Sharma'}
                </div>
                <div className="text-xs text-ink-muted font-mono">
                  {req?.creator?.city || 'Indore'} • Trust {req?.creator?.trustScore || 92}%
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-line space-y-2">
              <Link
                to={`/app/messages/${task.id}`}
                className="w-full py-2 px-3 text-xs font-semibold bg-[#F5F2EC] hover:bg-line text-ink rounded-[6px] border border-line flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Direct Task Chat</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
