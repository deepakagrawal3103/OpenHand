import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'HELPER'>('USER');
  const [city, setCity] = useState('Indore');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signup({ name, email, password, role, city });
      navigate('/onboarding/role');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F5F2EC] min-h-screen py-12 flex items-center justify-center px-4">
      <div className="bg-surface border border-line rounded-[10px] p-6 sm:p-8 max-w-md w-full shadow-elevated space-y-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
            ONBOARDING • CIVIC IDENTITY
          </div>
          <h1 className="text-2xl font-bold text-ink">Join OpenHand Mesh</h1>
          <p className="text-xs text-ink-muted mt-1">
            Connect directly with campus peers, lend equipment, or resolve urgent blockers.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-urgent-light border border-urgent/30 rounded-[6px] text-xs font-mono text-urgent">
            {error}
          </div>
        )}

        <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-lg text-xs space-y-1">
          <div className="font-bold text-emerald-950 flex items-center gap-1.5">
            <span>🏢 Registering as an NGO or Skilled Technician?</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Set up your shelter wishlist or trade skills with instant automated WhatsApp alerts!
          </p>
          <Link to="/create-id" className="inline-block pt-0.5 text-emerald-800 font-bold hover:underline">
            Open the OpenHand ID Creator with WhatsApp Alerts →
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ink-muted mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-3 py-2 text-xs bg-[#F5F2EC] border border-line rounded-[6px] focus:outline-none focus:border-brand"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-ink-muted mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@college.edu"
              className="w-full px-3 py-2 text-xs bg-[#F5F2EC] border border-line rounded-[6px] focus:outline-none focus:border-brand"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-ink-muted mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs bg-[#F5F2EC] border border-line rounded-[6px] focus:outline-none focus:border-brand"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-ink-muted mb-1">
              Primary Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('USER')}
                className={`py-2 px-3 text-xs font-semibold rounded-[6px] border ${
                  role === 'USER'
                    ? 'bg-brand text-white border-brand'
                    : 'bg-[#F5F2EC] text-ink border-line'
                }`}
              >
                Requester / User
              </button>
              <button
                type="button"
                onClick={() => setRole('HELPER')}
                className={`py-2 px-3 text-xs font-semibold rounded-[6px] border ${
                  role === 'HELPER'
                    ? 'bg-brand text-white border-brand'
                    : 'bg-[#F5F2EC] text-ink border-line'
                }`}
              >
                Helper / Volunteer
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs font-bold text-white bg-brand hover:bg-brand-hover rounded-[6px] shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Creating account...' : 'Continue to Intent Onboarding'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-line text-xs text-ink-muted">
          Already registered?{' '}
          <Link to="/login" className="text-brand font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
