
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Send, LogIn, Info, AlertTriangle } from 'lucide-react';
import logo from '/assets/darklogo.png'

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (targetEmail: string, role: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      await login(targetEmail, role);
    } catch (err: any) {
      setError("Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
            <div
  onClick={() => (window.location.pathname = '/')}
  className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 cursor-pointer h-20"
>
  <div className="">
    <img
      src="/assets/darkthemelogo.png"
      alt="PostPilot AI"
      className="p-8"
    />
  </div>
  </div>
          {/* <p className="text-slate-400 p-1">The Intelligent LinkedIn Growth Engine</p> */}
        </div>

        <div className="bg-slate-800 p-10 rounded-[2.5rem] border border-slate-700 shadow-2xl relative overflow-hidden">
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-xs text-red-200 font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] text-blue-400 font-bold hover:underline">Forgot?</button>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/25 group"
            >
              <LogIn className="w-5 h-8 group-hover:translate-x-1 transition-transform" /> {loading ? 'Authorizing...' : 'Sign In'}
            </button>
          </form>

          {/* <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="bg-blue-900/20 rounded-2xl p-4 border border-blue-500/20 flex gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0" />
              <div className="text-[11px] text-blue-200/70 leading-relaxed text-left">
                <p className="font-bold text-blue-400 mb-1 uppercase tracking-tighter">Enterprise Access Points:</p>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => quickLogin('admin@postpilot.ai', UserRole.SUPER_ADMIN)} className="underline hover:text-white">Admin Portal</button>
                  <span className="text-slate-600">|</span>
                  <button onClick={() => quickLogin('user@postpilot.ai', UserRole.USER)} className="underline hover:text-white">User Portal</button>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-slate-500 text-sm">
            Secured with Enterprise JWT & OAuth 2.0
          </p>
          <button 
            onClick={() => window.location.pathname = '/'}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-blue-500 transition-colors"
          >
            ← Return to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
