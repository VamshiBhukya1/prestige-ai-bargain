import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { api } from '../lib/api';

interface AuthModalProps {
  user: {
    name: string;
    email: string;
  } | null;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
  onLogoutSuccess: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  user,
  onClose,
  onAuthSuccess,
  onLogoutSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Password Requirements Validation
  const hasMinLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const isPasswordValid = hasMinLen && hasUpper && hasLower && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'register') {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setError('Please enter your full name (minimum 2 characters).');
        return;
      }

      if (!isPasswordValid) {
        setError('Please meet all password complexity requirements.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter your password.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const data = await api.login({ email, password });
        onAuthSuccess(data.user);
        onClose();
      } else {
        const data = await api.register({ fullName, email, password });
        setSuccessMsg('Account created successfully! Logging you in...');
        setTimeout(() => {
          onAuthSuccess(data.user);
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0C6CF2] border border-blue-100 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRESTIGE CORPORATE</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#0C2340] tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {mode === 'login'
              ? 'Sign in to your Prestige account to manage orders & AI deals'
              : 'Start shopping executive corporate gifts & negotiate bulk prices'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2.5 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name (Registration only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-[#0C2340] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aditi Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent transition-all font-medium"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-[#0C2340] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent transition-all font-medium"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-[#0C2340] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Registration Password Requirements */}
          {mode === 'register' && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px]">
              <span className="font-bold text-slate-700 block">Password Requirements:</span>
              <div className="grid grid-cols-2 gap-1.5 text-slate-600">
                <div className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasMinLen ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    ✓
                  </div>
                  <span className={hasMinLen ? 'text-emerald-700 font-semibold' : ''}>Min. 8 characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasUpper ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    ✓
                  </div>
                  <span className={hasUpper ? 'text-emerald-700 font-semibold' : ''}>1 uppercase letter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasLower ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    ✓
                  </div>
                  <span className={hasLower ? 'text-emerald-700 font-semibold' : ''}>1 lowercase letter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasNumber ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    ✓
                  </div>
                  <span className={hasNumber ? 'text-emerald-700 font-semibold' : ''}>1 number</span>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Password (Registration only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-[#0C2340] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Remember Me & Forgot Password (Sign In only) */}
          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#0C6CF2] focus:ring-[#0C6CF2]"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Password reset link sent to your registered email.')}
                className="text-[#0C6CF2] hover:text-[#0957C3] font-bold"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#0C6CF2] hover:bg-[#0957C3] disabled:opacity-50 text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{mode === 'login' ? 'Signing in...' : 'Creating Account...'}</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </form>

        {/* Footer Toggle Link */}
        <div className="text-center pt-3 border-t border-slate-100 text-xs">
          {mode === 'login' ? (
            <p className="text-slate-600 font-medium">
              New to Prestige?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="text-[#0C6CF2] hover:text-[#0957C3] font-extrabold"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p className="text-slate-600 font-medium">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-[#0C6CF2] hover:text-[#0957C3] font-extrabold"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
