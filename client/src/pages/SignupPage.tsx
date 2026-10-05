import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  ShieldCheck,
  Mail,
  Lock,
  User,
  MapPin,
  Building2,
  Wrench,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border border-white/40 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Column: Mission & Trust */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-radar-grid opacity-20 pointer-events-none" />

          {/* Top Branding */}
          <div className="relative z-10 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-white text-emerald-900 flex items-center justify-center font-extrabold text-base shadow-md group-hover:scale-105 transition-transform">
                🤝
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-white leading-none">
                  OpenHand
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-semibold mt-0.5">
                  Civic Network • Indore
                </span>
              </div>
            </Link>

            <div className="pt-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-600/50 text-[11px] font-medium text-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Commission • Verified Community</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Join 1,840+ verified neighbors across Indore.
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                Connect directly with SGSITS and Indore campus peers, pass along textbooks, lend tools, or find reliable neighborhood support.
              </p>
            </div>
          </div>

          {/* Specialized Alert banner */}
          <div className="relative z-10 my-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <Building2 className="w-4 h-4" />
              <span>Are you an NGO or Technician?</span>
            </div>
            <p className="text-[11px] text-emerald-100/80 leading-relaxed">
              Don't use the standard user signup. Register via our ID engine to get automated WhatsApp alerts when matching donations or repair jobs appear!
            </p>
            <Link
              to="/create-id"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-700/80 hover:bg-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition-colors"
            >
              <span>Go to OpenHand ID Engine</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Bottom Security */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-emerald-200/70">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Campus & neighborhood mesh • 100% Free forever</span>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                CIVIC MEMBERSHIP
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Create your account
              </h1>
              <p className="text-xs text-slate-500">
                Start sharing, lending, or resolving civic needs across Indore in minutes.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma or Rahul Verma"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address (College or Personal)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@college.edu or name@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  How would you primarily like to participate?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole('USER')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      role === 'USER'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="text-xs">Community Member</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-normal">Buy, sell, donate & request help</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('HELPER')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      role === 'HELPER'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="text-xs">Active Helper</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-normal">Lend gear, fix things & volunteer</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl shadow-[0_4px_14px_rgba(4,120,87,0.3)] transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 mt-2"
              >
                <span>{loading ? 'Creating your account...' : 'Create Account & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="text-center pt-6 mt-6 border-t border-slate-100 text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-700 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
