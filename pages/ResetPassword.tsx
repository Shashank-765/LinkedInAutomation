
import React, { useState } from 'react';
import { authApi } from '../services/api';
import { ShieldCheck, Lock, Loader2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [message, setMessage] = useState('');

  const token = window.location.pathname.split('/').pop() || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setStatus('ERROR');
      return;
    }

    setLoading(true);
    setStatus('IDLE');
    try {
      const res = await authApi.resetPassword({ token, password });
      setMessage(res.data.message || 'Your identity has been re-secured.');
      setStatus('SUCCESS');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Token invalid or expired.');
      setStatus('ERROR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-0" />
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-[1.5rem] mb-6 shadow-2xl shadow-indigo-500/20">
              <ShieldCheck className="text-white w-8 h-8" />
           </div>
           <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Commit New Auth</h1>
           <p className="text-slate-500 font-medium mt-2">Create a new secure access key for your node.</p>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl">
          {status === 'SUCCESS' ? (
            <div className="space-y-8 text-center animate-in fade-in zoom-in duration-500">
               <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                  <CheckCircle2 className="text-green-500 w-10 h-10" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Handshake Successful</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">{message}</p>
               </div>
               <button onClick={() => window.location.pathname = '/login'} className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                 Return to Login <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {status === 'ERROR' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 items-center">
                   <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                   <p className="text-xs text-red-200 font-medium">{message}</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">New Access Key</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-14 pr-7 py-5 bg-slate-950 rounded-2xl border-none font-bold text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-700" 
                      placeholder="••••••••" 
                    />
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Confirm Access Key</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      required 
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-14 pr-7 py-5 bg-slate-950 rounded-2xl border-none font-bold text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-700" 
                      placeholder="••••••••" 
                    />
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                Authorize Update
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
