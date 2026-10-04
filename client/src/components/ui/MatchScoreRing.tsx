import React from 'react';

interface MatchScoreProps {
  score: number;
  skillFit?: number;
  distance?: number;
  availability?: number;
  experience?: number;
  trust?: number;
  distanceKm?: number;
  explanation?: string;
}

export const MatchScoreRing: React.FC<MatchScoreProps> = ({
  score,
  skillFit = 96,
  distance = 94,
  availability = 100,
  experience = 82,
  trust = 88,
  distanceKm = 0.8,
  explanation,
}) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-surface border border-line rounded-[10px] p-5 shadow-clean">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Animated Score Ring */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#E3DED4"
              strokeWidth="7"
            />
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={score >= 85 ? '#1F4D3A' : score >= 70 ? '#B7791F' : '#635F56'}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold font-mono text-ink tracking-tight">
              {score}%
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
              MATCH
            </span>
          </div>
        </div>

        {/* Explainability Breakdown */}
        <div className="flex-1 w-full space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-ink">
              Multi-Factor Matching Engine
            </h4>
            <span className="text-xs font-mono text-brand font-semibold">
              {distanceKm} km away
            </span>
          </div>

          {/* Factor Progress Bars */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-ink-muted">Skill Fit (35%)</span>
                <span className="font-mono font-medium">{skillFit}%</span>
              </div>
              <div className="w-full bg-[#E3DED4] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand h-full rounded-full transition-all duration-700"
                  style={{ width: `${skillFit}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-ink-muted">Distance (25%)</span>
                <span className="font-mono font-medium">{distance}%</span>
              </div>
              <div className="w-full bg-[#E3DED4] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand h-full rounded-full transition-all duration-700"
                  style={{ width: `${distance}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-ink-muted">Availability (15%)</span>
                <span className="font-mono font-medium">{availability}%</span>
              </div>
              <div className="w-full bg-[#E3DED4] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand h-full rounded-full transition-all duration-700"
                  style={{ width: `${availability}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-ink-muted">Experience & Trust (25%)</span>
                <span className="font-mono font-medium">
                  {Math.round((experience + trust) / 2)}%
                </span>
              </div>
              <div className="w-full bg-[#E3DED4] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.round((experience + trust) / 2)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Factor Reason Text */}
          {explanation && (
            <div className="pt-2 border-t border-line text-xs font-mono text-ink-muted">
              {explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
