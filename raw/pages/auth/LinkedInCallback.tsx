
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { Loader2, Linkedin, CheckCircle2, AlertCircle } from 'lucide-react';

const LinkedInCallback: React.FC = () => {
  const { updateProfile } = useAuth();
  const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      // 1. Parse the 'code' and potential 'error' from the URL query string
      // LinkedIn usually appends params to the redirect URI
      const urlParams = new URLSearchParams(window.location.search || window.location.hash.split('?')[1]);
      //console.log('LinkedIn Callback URL Params:', urlParams.toString());
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      if (error) {
        setStatus('ERROR');
        setErrorMsg(errorDescription || `LinkedIn Error: ${error}`);
        return;
      }

      if (!code) {
        setStatus('ERROR');
        setErrorMsg("No authorization code received from LinkedIn.");
        return;
      }

      try {
        // 2. Send the code to your backend to exchange it for a real token
        const response = await authApi.connectLinkedIn(code);
        
        // 3. Update the global auth state with the new connected user profile
        updateProfile(response.data.user);
        setStatus('SUCCESS');
        
        // 4. Redirect back to settings after a brief delay
        setTimeout(() => {
          window.location.href = `${window.location.origin}/#/settings`;
        }, 2000);
      } catch (err: any) {
        //console.log("LinkedIn Token Exchange Error:", err);
        setStatus('ERROR');
        setErrorMsg(err.response?.data?.message || "Failed to exchange LinkedIn token.");
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-[3rem] p-12 text-center shadow-2xl border dark:border-slate-700 space-y-8 animate-in zoom-in duration-300">
        
        {status === 'LOADING' && (
          <>
            <div className="relative w-24 h-24 mx-auto">
               <Loader2 className="w-full h-full text-blue-600 animate-spin" />
               <Linkedin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600 fill-current" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Finalizing Handshake</h2>
              <p className="text-slate-500 mt-3 font-medium">LinkedIn is authorizing your professional node. Exchanging credentials...</p>
            </div>
          </>
        )}

        {status === 'SUCCESS' && (
          <>
            <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-green-500/20">
               <CheckCircle2 className="w-12 h-12 text-white stroke-[3]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Sync Complete</h2>
              <p className="text-slate-500 mt-3 font-medium">Your LinkedIn profile is now connected. Redirecting you to settings...</p>
            </div>
          </>
        )}

        {status === 'ERROR' && (
          <>
            <div className="w-24 h-24 bg-red-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-red-500/20">
               <AlertCircle className="w-12 h-12 text-white stroke-[3]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Handshake Failed</h2>
              <p className="text-red-500 mt-3 font-bold text-sm uppercase tracking-widest">{errorMsg}</p>
              <button 
                onClick={() => window.location.href = `${window.location.origin}/#/settings`}
                className="mt-8 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px]"
              >
                Return to Settings
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default LinkedInCallback;
