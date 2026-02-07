
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { Loader2, Linkedin, CheckCircle2, AlertCircle, Zap, ShieldAlert } from 'lucide-react';

const LinkedInCallback: React.FC = () => {
  const { setUser } = useAuth();
  const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCallback = async (forceSimulate: boolean = false) => {
    setStatus('LOADING');
    
    // Robust param parsing
    const urlParams = new URLSearchParams(window.location.search || window.location.href.split('?')[1]);
    const code = urlParams.get('code') || (forceSimulate ? 'sim_code_' + Date.now() : null);
    const error = urlParams.get('error');
    
    if (error && !forceSimulate) {
      setStatus('ERROR');
      setErrorMsg(urlParams.get('error_description') || `LinkedIn Error: ${error}`);
      return;
    }
    
    try {
      const response = await authApi.connectLinkedIn(code || 'sim_handshake');
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setStatus('SUCCESS');
        // setTimeout(() => {
        //   window.location.pathname = '/settings';
        // }, 1500);
      }
    } catch (err: any) {
      // console.log('window.location', window.location)
      console.error("LinkedIn Token Exchange Error:", err);
      setStatus('ERROR');
      setErrorMsg(err.response?.data?.message || "Request failed with status code 401. This often means the LinkedIn token was revoked or is invalid.");
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
      <div className="max-w-xl w-full bg-slate-800 rounded-[3rem] p-12 text-center shadow-2xl border border-slate-700 space-y-8 animate-in zoom-in duration-300">
        
        {status === 'LOADING' && (
          <>
            <div className="relative w-24 h-24 mx-auto">
               <Loader2 className="w-full h-full text-blue-500 animate-spin" />
               <Linkedin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-500 fill-current" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Finalizing Handshake</h2>
              <p className="text-slate-400 mt-3 font-medium">Synchronizing LinkedIn credentials. Verifying professional node...</p>
            </div>
          </>
        )}

        {status === 'SUCCESS' && (
          <>
            <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-green-500/20">
               <CheckCircle2 className="w-12 h-12 text-white stroke-[3]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Sync Complete</h2>
              <p className="text-slate-400 mt-3 font-medium">Your LinkedIn identity is now verified. Returning to configuration...</p>
            </div>
            <button 
                onClick={() => window.location.href = `${window.location.origin}/settings`}
                className="w-full py-5 bg-slate-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/5 transition-all"
               >
                 Back to Settings
               </button>
          </>
        )}

        {status === 'ERROR' && (
          <div className="space-y-8 text-left">
            <div className="flex items-center gap-4 bg-red-500/10 p-6 rounded-[2rem] border border-red-500/20">
               <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-8 h-8 text-white" />
               </div>
               <div>
                  <h2 className="text-xl font-black text-red-500 uppercase tracking-tighter">Auth Failure</h2>
                  <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mt-1">Status: Unauthenticated (401)</p>
               </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-700 space-y-4">
              <p className="text-sm text-slate-300 font-bold leading-relaxed">{errorMsg}</p>
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex gap-3">
                 <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                 <p className="text-[10px] text-orange-400 font-bold leading-relaxed">
                   This is expected if your LinkedIn token has expired. You can use <b>Simulation Mode</b> to continue testing the platform.
                 </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <button 
                onClick={() => window.location.href = `${window.location.origin}/settings`}
                className="w-full py-5 bg-slate-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/5 transition-all"
               >
                 Back to Settings
               </button>
               <button 
                onClick={() => handleCallback(true)}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
               >
                 <Zap className="w-4 h-4" /> Simulate Success
               </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LinkedInCallback;
