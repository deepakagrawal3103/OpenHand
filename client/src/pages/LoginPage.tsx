import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UserCheck,
  Shield,
  ArrowRight,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  Heart,
  Wrench,
  ShoppingBag,
} from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border border-white/40 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left Column: Visual Showcase & Civic Proof */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle grid pattern overlay */}
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
                  Indore Civic Mesh
                </span>
              </div>
            </Link>

            <div className="pt-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-600/50 text-[11px] font-medium text-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Zero Brokerage • Direct Peer Mesh</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Where Indore neighbors help in 45 minutes.
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                Log in to check your active requests, manage pre-owned items, coordinate shelter donations, or track local technician bookings.
              </p>
            </div>
          </div>

          {/* Middle: Live impact micro-cards */}
          <div className="relative z-10 space-y-2.5 my-8">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">₹50 - ₹500 College Deals</div>
                <div className="text-emerald-200/80 text-[11px]">Direct student-to-student handover</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">5+ Indore Shelters Connected</div>
                <div className="text-emerald-200/80 text-[11px]">Aastha Vriddhashram, Snehalaya & more</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">100% Direct Mistri Access</div>
                <div className="text-emerald-200/80 text-[11px]">Call or WhatsApp plumbers & electricians</div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-emerald-200/70">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Indore Hyperlocal Mesh • Safe, encrypted & zero ads</span>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                AUTHENTICATED ACCESS
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back
              </h1>
              <p className="text-xs text-slate-500">
                Enter your credentials or choose a quick verified demo persona below.
              </p>
            </div>

            {/* Fast 1-Click Persona Login */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
              <div className="text-xs font-mono font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Instant 1-Click Demo Profiles</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handlePersonaLogin('priya')}
                  disabled={loading}
                  className="p-3 bg-white hover:bg-emerald-50/70 text-slate-900 rounded-xl border border-slate-200 hover:border-emerald-300 text-left transition-all duration-150 shadow-2xs hover:shadow-sm group"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs group-hover:text-emerald-900">Priya Sharma</div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-1.5 py-0.5 rounded font-bold">
                      Student
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">SGSITS Campus Requester</div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePersonaLogin('aarav')}
                  disabled={loading}
                  className="p-3 bg-white hover:bg-emerald-50/70 text-slate-900 rounded-xl border border-slate-200 hover:border-emerald-300 text-left transition-all duration-150 shadow-2xs hover:shadow-sm group"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs group-hover:text-emerald-900">Aarav Patel</div>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-1.5 py-0.5 rounded font-bold">
                      Tech 92%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Hardware & Electrical Helper</div>
                </button>
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200" />
              <span className="flex-shrink mx-3 text-[11px] font-mono uppercase text-slate-400 font-semibold">
                Or sign in with email
              </span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@college.edu or name@openhand.org"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <span className="text-[11px] text-emerald-700 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl shadow-[0_4px_14px_rgba(4,120,87,0.3)] transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to OpenHand'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="text-center pt-6 mt-6 border-t border-slate-100 text-xs text-slate-500">
            Don't have an account or need a Shelter ID?{' '}
            <Link to="/create-id" className="text-emerald-700 font-bold hover:underline">
              Create OpenHand ID & WhatsApp Alerts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
