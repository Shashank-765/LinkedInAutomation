
import React, { useState } from 'react';
import { authApi } from '../services/api';
import { Send, Key, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('IDLE');
    try {
      const res = await authApi.forgotPassword(email);
      setMessage(res.data.message || 'If an account exists with that email, a reset link has been generated.');
      setStatus('SUCCESS');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to initialize reset protocol.');
      setStatus('ERROR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-0" />
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
           <div onClick={() => window.location.pathname = '/login'} className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-[1.5rem] mb-6 shadow-2xl shadow-blue-500/20 cursor-pointer hover:scale-110 transition-transform">
              <Key className="text-white w-8 h-8" />
           </div>
           <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Reset Password</h1>
           <p className="text-slate-500 font-medium mt-2">Enter your email address to receive a reset token.</p>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl">
          {status === 'SUCCESS' ? (
            <div className="space-y-8 text-center animate-in fade-in zoom-in duration-500">
               <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                  <CheckCircle2 className="text-green-500 w-10 h-10" />
               </div>
               <div className="space-y-4">
                  <p className="text-slate-300 font-medium leading-relaxed">{message}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Note: For this demo, check the server console for the link.</p>
               </div>
               <button onClick={() => window.location.pathname = '/login'} className="w-full py-5 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-700 transition-all">Return to Origin</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {status === 'ERROR' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 items-center">
                   <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                   <p className="text-xs text-red-200 font-medium">{message}</p>
                </div>
              )}

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Auth Email</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-7 py-5 bg-slate-950 rounded-2xl border-none font-bold text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-700" 
                  placeholder="name@company.com" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Send Reset Token
              </button>
              
              <button 
                type="button"
                onClick={() => window.location.pathname = '/login'}
                className="w-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
              >
                ← Back to Portal
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
