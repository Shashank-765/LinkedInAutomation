
import React from 'react';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';
import { ArrowRight, Sparkles } from 'lucide-react';

interface StaticWrapperProps {
  title: string;
  subtitle: string;
  icon: any;
  children: React.ReactNode;
}

const StaticWrapper: React.FC<StaticWrapperProps> = ({ title, subtitle, icon: Icon, children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigateTo = () => {

    window.location.pathname = isAuthenticated ? '/dashboard' : '/login';
  };

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-sans selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">
      <PublicNavbar user={user} logout={logout} navigateTo={navigateTo} />
      
      <main className="pt-48 pb-32">
        <div className="max-w-4xl mx-auto px-6 text-left space-y-16">
           <div className="space-y-6">
              <div className="flex items-center gap-4 text-blue-500">
                 <Icon className="w-12 h-12" />
                 <div className="h-px bg-blue-600 flex-1" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none italic">{title}</h1>
              <p className="text-xl md:text-2xl text-slate-500 font-black uppercase tracking-widest">{subtitle}</p>
           </div>

           <div className="space-y-10 text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">
              {children}
           </div>

           <div className="pt-20 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 bg-slate-900 rounded-[3rem] border border-white/5 space-y-6">
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter">Initialize Setup</h3>
                 <p className="text-sm text-slate-500 font-medium">Ready to deploy your professional authority node? Start your 14-day cycle now.</p>
                 <button onClick={() => navigateTo()} className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 flex items-center gap-2 group transition-all">
                    Access Console <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
              <div className="p-10 bg-white/5 rounded-[3rem] border border-white/5 flex flex-col justify-center">
                 <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Platform Insight</span>
                 </div>
                 <p className="text-sm italic font-medium text-slate-400 leading-relaxed">
                   "LinkAutomate doesn't just automate; it synthesizes category leadership through high-context AI operations."
                 </p>
              </div>
           </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default StaticWrapper;
