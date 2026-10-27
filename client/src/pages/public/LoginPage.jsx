import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import {
  Layers,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await login({ email, password });
      toast.success(`Welcome back, ${res.user.name}!`);

      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 selection:bg-brand-500/15 selection:text-brand-900">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Brand App Emblem & Title */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-brand-500/20 mb-2">
            <Layers className="w-7 h-7 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sign in to AuraLMS
          </h1>
          <p className="text-xs text-slate-500 max-w-xs">
            Enter your credentials to launch your native engineering workspace and masterclasses
          </p>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 flex flex-col gap-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white text-slate-900 placeholder-slate-400 text-sm rounded-2xl py-2.5 pl-10 pr-3.5 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 tracking-wide">
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white text-slate-900 placeholder-slate-400 text-sm rounded-2xl py-2.5 pl-10 pr-10 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2 py-3 rounded-2xl text-sm font-bold shadow-md shadow-brand-500/20 cursor-pointer"
              iconRight={ArrowRight}
            >
              Sign In to App
            </Button>
          </form>


          {/* Registration Redirect */}
          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            Need a student account?{' '}
            <Link
              to="/register"
              className="text-brand-600 font-bold hover:text-brand-700 hover:underline"
            >
              Register here
            </Link>
          </div>
        </div>

        {/* Security & Offline Badge */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>HTTP-Only Cookie Authentication • PWA Enabled</span>
        </div>
      </div>
    </div>
  );
};
