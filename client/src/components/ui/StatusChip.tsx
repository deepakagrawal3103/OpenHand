import React from 'react';
import { RequestStatus, TaskStatus } from '../../types';

interface StatusChipProps {
  status: RequestStatus | TaskStatus | string;
  size?: 'sm' | 'md';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'md' }) => {
  const normalized = status.toUpperCase();

  let styles = 'bg-gray-100 text-gray-700 border-gray-200';
  let label = status.replace(/_/g, ' ');

  switch (normalized) {
    case 'PUBLISHED':
    case 'MATCHING':
      styles = 'bg-pending-light text-pending border-pending/30';
      label = normalized === 'MATCHING' ? 'Finding Helpers' : 'Published';
      break;
    case 'MATCHED':
      styles = 'bg-blue-50 text-blue-700 border-blue-200';
      label = 'Helper Matched';
      break;
    case 'ACCEPTED':
      styles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      label = 'Task Accepted';
      break;
    case 'IN_PROGRESS':
      styles = 'bg-amber-50 text-amber-800 border-amber-300';
      label = 'In Progress';
      break;
    case 'ARRIVED':
      styles = 'bg-purple-50 text-purple-700 border-purple-200';
      label = 'Helper Arrived';
      break;
    case 'PROOF_SUBMITTED':
    case 'AWAITING_VERIFICATION':
      styles = 'bg-blue-100 text-blue-800 border-blue-300 font-semibold';
      label = 'Proof Submitted';
      break;
    case 'RESOLVED':
      styles = 'bg-resolved-light text-resolved border-resolved/40 font-semibold';
      label = 'Verified Resolved';
      break;
    case 'REWORK_REQUESTED':
      styles = 'bg-urgent-light text-urgent border-urgent/30';
      label = 'Rework Requested';
      break;
    default:
      styles = 'bg-[#F5F2EC] text-ink-muted border-line';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono tracking-tight uppercase border rounded-[4px] ${sizeClasses} ${styles}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
};
