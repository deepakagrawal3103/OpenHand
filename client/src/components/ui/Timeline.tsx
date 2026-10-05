import React from 'react';
import { RequestStatus, TaskStatus } from '../../types';
import { Check, Clock, Radio, ShieldCheck, Camera, UserCheck } from 'lucide-react';

interface TimelineProps {
  status: RequestStatus | TaskStatus | string;
}

const steps = [
  { key: 'CREATED', label: 'Reported', icon: Clock },
  { key: 'MATCHING', label: 'Matching', icon: Radio },
  { key: 'ACCEPTED', label: 'Accepted', icon: UserCheck },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Clock },
  { key: 'ARRIVED', label: 'Arrived', icon: Clock },
  { key: 'PROOF_SUBMITTED', label: 'Proof Ready', icon: Camera },
  { key: 'RESOLVED', label: 'Verified', icon: ShieldCheck },
];

export const Timeline: React.FC<TimelineProps> = ({ status }) => {
  const norm = status.toUpperCase();

  // Determine current active index
  let activeIndex = 0;
  if (norm === 'PUBLISHED' || norm === 'DRAFT') activeIndex = 0;
  else if (norm === 'MATCHING' || norm === 'MATCHED') activeIndex = 1;
  else if (norm === 'ACCEPTED') activeIndex = 2;
  else if (norm === 'IN_PROGRESS') activeIndex = 3;
  else if (norm === 'ARRIVED') activeIndex = 4;
  else if (norm === 'PROOF_SUBMITTED' || norm === 'AWAITING_VERIFICATION') activeIndex = 5;
  else if (norm === 'RESOLVED') activeIndex = 6;
  else if (norm === 'REWORK_REQUESTED') activeIndex = 4;

  return (
    <div className="bg-surface border border-line rounded-[10px] p-5 shadow-clean">
      <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-4">
        Request & Task Progress Timeline
      </h4>

      <div className="relative flex items-center justify-between">
        {/* Horizontal connector line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#E3DED4] -z-0" />

        {steps.map((s, idx) => {
          const isDone = idx < activeIndex || norm === 'RESOLVED';
          const isCurrent = idx === activeIndex && norm !== 'RESOLVED';
          const Icon = s.icon;

          return (
            <div key={s.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-brand text-white'
                    : isCurrent
                    ? 'bg-white border-2 border-brand text-brand ring-4 ring-brand-light'
                    : 'bg-[#F5F2EC] border border-line text-ink-subtle'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <span
                className={`text-[11px] font-mono mt-2 whitespace-nowrap ${
                  isCurrent
                    ? 'font-bold text-brand'
                    : isDone
                    ? 'font-medium text-ink'
                    : 'text-ink-subtle'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
