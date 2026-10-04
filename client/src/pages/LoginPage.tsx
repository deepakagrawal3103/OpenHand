import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Shield, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchPersona } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaLogin = async (persona: 'priya' | 'aarav') => {
    setLoading(true);
    setError(null);
    try {
      await switchPersona(persona);
      if (persona === 'aarav') navigate('/helper');
      else navigate('/app');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F5F2EC] min-h-screen py-12 flex items-center justify-center px-4">
      <div className="bg-surface border border-line rounded-[10px] p-6 sm:p-8 max-w-md w-full shadow-elevated space-y-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
            AUTHENTICATION • INDORE MESH
          </div>
          <h1 className="text-2xl font-bold text-ink">Sign into OpenHand</h1>
          <p className="text-xs text-ink-muted mt-1">
            Access your civic dispatches, verified repairs, and peer network.
          </p>
        </div>

        {/* Demo Fast Persona Switcher */}
        <div className="p-4 bg-brand-light/70 border border-brand/20 rounded-[8px] space-y-3">
          <div className="text-xs font-mono font-bold text-brand uppercase flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" />
            <span>One-Click Academic Demo Personas</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handlePersonaLogin('priya')}
              disabled={loading}
              className="p-2.5 bg-white hover:bg-emerald-50 text-ink rounded-[6px] border border-line text-left transition-all"
            >
              <div className="text-xs font-bold">Priya Sharma</div>
              <div className="text-[10px] font-mono text-ink-muted">CS Requester (Lab 3)</div>
            </button>

            <button
              type="button"
              onClick={() => handlePersonaLogin('aarav')}
              disabled={loading}
              className="p-2.5 bg-white hover:bg-emerald-50 text-ink rounded-[6px] border border-line text-left transition-all"
            >
              <div className="text-xs font-bold">Aarav Patel</div>
              <div className="text-[10px] font-mono text-ink-muted">Hardware Helper (92%)</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-urgent-light border border-urgent/30 rounded-[6px] text-xs font-mono text-urgent">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-ink-muted mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@college.edu or name@openhand.org"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs font-bold text-white bg-brand hover:bg-brand-hover rounded-[6px] shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-line text-xs text-ink-muted">
          New to the mesh?{' '}
          <Link to="/signup" className="text-brand font-bold hover:underline">
            Register an account
          </Link>
        </div>
      </div>
    </div>
  );
};
