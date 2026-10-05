import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, Wrench, Cpu, Users, ArrowRight } from 'lucide-react';

export const OnboardingRolePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedIntent, setSelectedIntent] = useState<string>('help');

  const intents = [
    {
      id: 'need',
      title: 'I Need Help / Lab Support',
      desc: 'Report equipment breakdowns, borrow sensors/tools, or request peer assistance on campus.',
      icon: Layers,
    },
    {
      id: 'help',
      title: 'I Want to Help / Volunteer',
      desc: 'Diagnose hardware, troubleshoot lab setups, fix solder joints, and earn verified trust points.',
      icon: Wrench,
    },
    {
      id: 'give',
      title: 'I Want to Give / Share Surplus',
      desc: 'Lend spare tools, spare development boards, components, or surplus cables to nearby makers.',
      icon: Cpu,
    },
    {
      id: 'org',
      title: 'Campus Club / Organization',
      desc: 'Coordinate department labs, student chapters, or makerspaces across Indore.',
      icon: Users,
    },
  ];

  return (
    <div className="bg-[#F5F2EC] min-h-screen py-12 flex items-center justify-center px-4">
      <div className="bg-surface border border-line rounded-[10px] p-6 sm:p-8 max-w-xl w-full shadow-elevated space-y-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
            STEP 1 • INTENTION ONBOARDING
          </div>
          <h1 className="text-2xl font-bold text-ink">
            How do you plan to use OpenHand?
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Choose your primary goal in the Indore community. You can change this at any time.
          </p>
        </div>

        <div className="space-y-3">
          {intents.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedIntent === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedIntent(item.id)}
                className={`p-4 rounded-[8px] border cursor-pointer transition-all flex items-start gap-4 ${
                  isSelected
                    ? 'border-brand bg-brand-light ring-1 ring-brand'
                    : 'border-line bg-[#FAF8F5] hover:border-line-dark'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-[6px] flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-brand text-white'
                      : 'bg-[#F5F2EC] text-ink-muted border border-line'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink">{item.title}</h4>
                  <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-line flex justify-end">
          <button
            onClick={() => navigate('/onboarding/skills')}
            className="px-6 py-2.5 text-xs font-bold text-white bg-brand hover:bg-brand-hover rounded-[6px] shadow-sm flex items-center gap-2"
          >
            <span>Continue to Skills & Capabilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
