import { useAuth } from "@/context/AuthContext";
import React from "react";
import logo from '/assets/darklogo.png';
import { 
  Send, Linkedin, Globe, ChevronRight, MessageSquare, Users
} from 'lucide-react';
import { staticPages } from "@/config/staticPages";

import { StaticPageConfig } from "@/types";

interface Props {
  page: StaticPageConfig;
}

const StaticPage: React.FC<Props> = ({ page }) => {

      const { user, logout } = useAuth();

        const mid = Math.ceil(staticPages.length / 2);
      const firstColumn = staticPages.slice(0, mid);
      const secondColumn = staticPages.slice(mid);
      const navigateTo = () => {
    window.location.pathname = user ? '/dashboard' : '/login';
  };
  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto  h-20 flex items-center justify-between">
         <div
          onClick={() => (window.location.pathname = '/')}
          className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 cursor-pointer h-20 w-[200px]"
        >
          <div className="">
            <img
              src={logo}
              alt="PostPilot AI"
              className="px-2"
            />
          </div>
          </div>
         
          <div className="flex items-center gap-4">
            {user ? (
                <>
                    <span className="text-sm font-medium text-slate-400">{user.email}</span>
                    <button onClick={logout} className="text-sm font-medium text-blue-500 hover:underline">Logout</button>
                </>
            ) : (
                <button 
                  onClick={() => navigateTo()}
                  className="px-6 py-2.5 bg-white text-slate-950 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
                >
                  Sign In
                </button>
            )}
          </div>
        </div>
      </nav>
   <section className="relative w-full py-32 overflow-hidden">

  <div className="relative bg-slate-950 text-white overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/20 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-24">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
            {page.title}
          </h1>

          <p className="mt-6 text-slate-400 text-lg leading-relaxed">
            {page.description}
          </p>
        </div>

        {/* Divider */}
        <div className="mt-16 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {page.features?.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 transition-all duration-500 hover:border-indigo-500/40 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl"></div>

              <h3 className="relative text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="relative mt-4 text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Premium CTA Section */}
        <div className="mt-28 text-center">
          <div className="inline-block px-10 py-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold">
              Experience Intelligent Growth
            </h2>
            <p className="mt-3 text-slate-400 text-sm">
              Built for professionals who demand leverage, clarity, and scale.
            </p>
            <button 
             onClick={() => navigateTo()}
            className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 font-medium hover:opacity-90 transition">
              Get Started
            </button>
          </div>
        </div>

      </div>
    </div>
</section>

      {/* ---------------- FOOTER (UNCHANGED) ---------------- */}
      {/* 7. Footer Section */}
            <footer className="py-20 bg-slate-950 border-t border-white/5">
              <div className="max-w-[1470px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                  <div className="md:col-span-2 space-y-8">
                     <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                          <Send className="text-white w-5 h-5" />
                        </div>
                        <span className="font-black text-2xl text-white uppercase tracking-tighter ">Postpilot</span>
                     </div>
                     <p className="text-slate-500 font-medium max-w-xs leading-relaxed">The AI-first operating system for professional growth and LinkedIn influence.</p>
                     <div className="flex gap-4">
                        {[Linkedin, Users, Globe, MessageSquare].map((Icon, i) => (
                          <button key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                             <Icon className="w-5 h-5" />
                          </button>
                        ))}
                     </div>
                  </div>
      

                  <div className="grid grid-cols-2 gap-[80px]">
                    {/* Column 1 */}
                    <div className="space-y-3">
                      {firstColumn.map((page) => (
                        <button
                          key={page.slug}
                          onClick={() => {
                            window.history.pushState({}, "", page.slug);
                            window.dispatchEvent(new PopStateEvent("popstate"));
                          }}
                          className="block text-slate-400 hover:text-white transition-all"
                        >
                          {page.title}
                        </button>
                      ))}
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-3">
                      {secondColumn.map((page) => (
                        <button
                          key={page.slug}
                          onClick={() => {
                            window.history.pushState({}, "", page.slug);
                            window.dispatchEvent(new PopStateEvent("popstate"));
                          }}
                          className="block text-slate-400 hover:text-white transition-all"
                        >
                          {page.title}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
      
                <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-6">
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">© 2025 Postpilot AI. All Rights Reserved.</p>
                   <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">System Status: Optimal</span>
                   </div>
                </div>
              </div>
            </footer>
      
            {/* Final Floating CTA (Mobile) */}
            <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
               <button 
                onClick={() => navigateTo()}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-3"
               >
                  Get Started <ChevronRight className="w-4 h-4" />
               </button>
            </div>

    </div>
  );
};

export default StaticPage;
