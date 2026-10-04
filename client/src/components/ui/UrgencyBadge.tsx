import React from 'react';
import { UrgencyLevel } from '../../types';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel | string;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency }) => {
  const level = urgency.toUpperCase();

  let styles = 'text-ink-muted border-line bg-surface';
  let dotColor = 'bg-ink-muted';

  if (level === 'CRITICAL' || level === 'HIGH') {
    styles = 'text-urgent border-urgent/30 bg-urgent-light';
    dotColor = 'bg-urgent';
  } else if (level === 'MEDIUM') {
    styles = 'text-pending border-pending/30 bg-pending-light';
    dotColor = 'bg-pending';
  } else if (level === 'LOW') {
    styles = 'text-ink-muted border-line bg-[#F5F2EC]';
    dotColor = 'bg-ink-subtle';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono font-medium uppercase border rounded-[4px] ${styles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {level}
    </span>
  );
};
