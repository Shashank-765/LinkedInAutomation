
import React from 'react';
import { Send } from 'lucide-react';
import { User } from '../types';
import logo from '/assets/darklogo.png';

interface PublicNavbarProps {
  user: User | null;
  logout: () => void;
  navigateTo: (hash: string) => void;
}

const PublicNavbar: React.FC<PublicNavbarProps> = ({ user, logout, navigateTo }) => {
  return (
    <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-slate-950/60 backdrop-blur-2xl">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
         <div
                        onClick={() => (window.location.pathname = '/')}
                        className="cursor-pointer"
                      >
                        <img src={logo} className="w-[170px]" />
                      </div>
        
        <div className="hidden lg:flex items-center gap-10">
          <a href="/platform/autonomous-ops" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Platform</a>
          <a href="/company/infrastructure" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Enterprise</a>
          <a href="/resources/documentation" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Resources</a>
          <a href="/pricing" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-500">{user.email}</span>
              <button onClick={() => window.location.pathname = '/dashboard'} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all">Console</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button onClick={() => navigateTo('/login')} className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Client Login</button>
              <button 
                onClick={() => navigateTo('/login')}
                className="px-8 py-3 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
              >
                Get Access
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
