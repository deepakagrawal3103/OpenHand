import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Sparkles, Plus, X, Check, ArrowRight } from 'lucide-react';

export const OnboardingSkillsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [skills, setSkills] = useState<string[]>([
    'Hardware Diagnostics',
    'Component Soldering',
  ]);
  const [inputSkill, setInputSkill] = useState('');

  // AI suggested skill tags from PRD
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    'Power Supply & Batteries',
    'Linux OS & Networking',
    'Multimeter Testing',
    '3D Printer Calibration',
    'Oscilloscope Diagnostics',
    'Microcontroller Firmware',
  ]);

  const handleAddSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
      setAiSuggestions(aiSuggestions.filter((s) => s !== skill));
    }
    setInputSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
    if (!aiSuggestions.includes(skill)) {
      setAiSuggestions([...aiSuggestions, skill]);
    }
  };

  const handleComplete = async () => {
    try {
      await api.updateProfile({ skills });
      await refreshUser();
      if (user?.role === 'HELPER') navigate('/helper');
      else navigate('/app');
    } catch {
      navigate('/app');
    }
  };

  return (
    <div className="bg-[#F5F2EC] min-h-screen py-12 flex items-center justify-center px-4">
      <div className="bg-surface border border-line rounded-[10px] p-6 sm:p-8 max-w-xl w-full shadow-elevated space-y-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
            STEP 2 • SKILLS & SPECIALIZATIONS
          </div>
          <h1 className="text-2xl font-bold text-ink">
            What can you help repair or lend?
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Free-text input + AI suggested tags. Our matching engine pairs you with incidents requiring these capabilities.
          </p>
        </div>

        {/* Free-text input */}
        <div>
          <label className="block text-xs font-mono uppercase text-ink-muted mb-1.5">
            Type custom skill or domain
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputSkill}
              onChange={(e) => setInputSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputSkill.trim()) {
                  e.preventDefault();
                  handleAddSkill(inputSkill.trim());
                }
              }}
              placeholder="e.g. Raspberry Pi, CMOS replacement, Audio wiring..."
              className="flex-1 px-3 py-2 text-xs bg-[#F5F2EC] border border-line rounded-[6px] focus:outline-none focus:border-brand"
            />
            <button
              type="button"
              onClick={() => inputSkill.trim() && handleAddSkill(inputSkill.trim())}
              className="px-4 py-2 text-xs font-semibold bg-brand text-white rounded-[6px] hover:bg-brand-hover flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Selected Skills Chips */}
        <div>
          <label className="block text-xs font-mono uppercase text-ink-muted mb-2">
            Your Active Capabilities ({skills.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="px-3 py-1 bg-brand text-white text-xs font-mono rounded-[4px] flex items-center gap-1.5 shadow-sm"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  className="hover:text-urgent"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* AI Suggested Chips from PRD */}
        <div className="bg-[#FAF8F5] border border-line rounded-[8px] p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand">
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            <span>AI Suggested Indore Campus Tags (Click to accept)</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {aiSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleAddSkill(s)}
                className="px-2.5 py-1 bg-surface hover:bg-brand-light border border-line hover:border-brand text-ink text-xs font-mono rounded-[4px] transition-all flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-brand" />
                <span>{s}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-line flex justify-end">
          <button
            onClick={handleComplete}
            className="px-6 py-2.5 text-xs font-bold text-white bg-brand hover:bg-brand-hover rounded-[6px] shadow-sm flex items-center gap-2"
          >
            <span>Finish & Open Mesh Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
