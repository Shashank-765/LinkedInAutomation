import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Zap, ShieldCheck, Sparkles, ArrowRight, Linkedin, BarChart3, Clock, 
  CheckCircle2, Globe, ChevronRight, MessageSquare, Users, Quote, Star, Activity, 
  Award, Building2, Crown, Briefcase, Megaphone, ExternalLink, Rocket, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adApi, adminApi } from '../services/api';
import { Ad } from '../types';
import logo from '/assets/darklogo.png';
import { staticPages } from '../config/staticPages';


const LandingPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  const mid = Math.ceil(staticPages.length / 2);
const firstColumn = staticPages.slice(0, mid);
const secondColumn = staticPages.slice(mid);

  /* ================= FETCH ================= */

  useEffect(() => {
    adminApi.getPlans()
      .then(res => setPlans(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    adApi.getActiveAds('HOME').then(res => setAds(res.data || []));
  }, []);

  /* ================= INFINITE ADS LOGIC ================= */

  const hasMultipleAds = ads.length > 1;

  const [activeIndex, setActiveIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startX = useRef(0);

  const extendedAds = hasMultipleAds
    ? [ads[ads.length - 1], ...ads, ads[0]]
    : ads;

  /* Auto slide */
  useEffect(() => {
    if (!hasMultipleAds) return;

    const interval = setInterval(() => {
      setActiveIndex(prev => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [hasMultipleAds]);

  /* Seamless reset */
  const handleTransitionEnd = () => {
    if (!hasMultipleAds) return;

    if (activeIndex === extendedAds.length - 1) {
      setIsTransitioning(false);
      setActiveIndex(1);
    }

    if (activeIndex === 0) {
      setIsTransitioning(false);
      setActiveIndex(ads.length);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
    }
  }, [isTransitioning]);

  /* Drag logic */
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startX.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    setDragOffset(clientX - startX.current);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    if (dragOffset < -60) {
      setActiveIndex(prev => prev + 1);
    } else if (dragOffset > 60) {
      setActiveIndex(prev => prev - 1);
    }

    setDragOffset(0);
    setIsDragging(false);
  };

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
          {/* <div className="hidden md:flex items-center gap-10">
            {['Product', 'Enterprise', 'Partners', 'Pricing'].map((item) => (
              <a key={item} href="" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">{item}</a>
            ))}
          </div> */}
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

        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
          <div className=" mx-auto px-10 text-center">
            
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Automate Your <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">LinkedIn Authority.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium mb-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
              Enterprise-grade AI content generation, strategic scheduling, and deep performance analytics. Built for high-growth teams and thought leaders.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
              <button onClick={() => navigateTo()} className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all">Start Now <ArrowRight className="w-4 h-4" /></button>
              {/* <button onClick={() => navigateTo()} className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-3"><Linkedin className="w-4 h-4" /> View Live Demo</button> */}
            </div>
          </div>
        </section>

      <section className="py-16 relative overflow-hidden bg-slate-900/10">
        <div className="w-[100%] px-10 overflow-hidden">
          <div
            className="relative w-[80%] m-auto overflow-hidden group"
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
          >
            {/* Sponsored Tag */}
            <span className="absolute top-4 left-2 z-10 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black shadow-md">
              Sponsored
            </span>

            {/* Slides */}
            <div
              className={`flex ${
                isTransitioning
                  ? "transition-transform duration-700 ease-in-out"
                  : ""
              }`}
              style={{
                transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedAds.map((ad, i) => (
                <a
                  key={i}
                  href={ad.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-full px-4"
                >
                  <div className="h-[220px] flex flex-col md:flex-row bg-slate-900 border border-white/5 rounded-[3rem] overflow-hidden hover:border-blue-500/30 transition-all shadow-2xl">
                    {/* IMAGE */}
                    <div className="md:w-[70%] flex items-center justify-center bg-black/10 p-4">
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="md:w-[30%] p-6 flex flex-col justify-center">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                        {ad.title}
                      </h3>

                      <p className="text-sm text-slate-400 font-medium mt-4 line-clamp-3">
                        {ad.description}
                      </p>

                      <span className="mt-8 inline-flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-[9px]">
                        Learn More <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* DOTS */}
            {hasMultipleAds && (
              <div className="flex justify-center gap-2 mt-4">
                {ads.map((_, i) => {
                  const realIndex =
                    activeIndex === 0
                      ? ads.length - 1
                      : activeIndex === ads.length + 1
                      ? 0
                      : activeIndex - 1;

                  return (
                    <span
                      key={i}
                      onClick={() => setActiveIndex(i + 1)}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                        i === realIndex ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>



     {/* ================= PARTNERS ================= */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-12">
            Visionary Partners & Strategic Sponsors
          </p>

          <div className="flex flex-wrap justify-center gap-16 opacity-40">
            {['BAstionex', 'Metsspacechain', 'Businessbay', 'NEXUS', 'APEX', 'ZENITH']
              .map((brand) => (
                <span key={brand} className="text-2xl font-black text-white">
                  {brand}
                </span>
              ))}
          </div>
        </div>
      </section>

      {/* ================= ECOSYSTEM CARDS ================= */}
      <section className="py-32 bg-slate-900/20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 text-center">
          <h2 className="text-sm font-black text-blue-500 uppercase tracking-widest mb-6">
            Strategic Ecosystem
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Enterprises', icon: Building2 },
              { title: 'CEOs & Owners', icon: Crown },
              { title: 'Private Clients', icon: Users },
              { title: 'Business Leaders', icon: Briefcase },
            ].map((item, i) => (
              <div key={i} className="bg-slate-950 border border-white/5 p-10 rounded-3xl hover:border-blue-500 transition">
                <item.icon className="w-8 h-8 text-blue-500 mb-6" />
                <h3 className="text-xl font-black text-white uppercase mb-4">{item.title}</h3>
                <p className="text-slate-500 text-sm">
                  Centralized content governance and leadership-focused automation tools.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 3 STEP PROCESS ================= */}
      <section className="py-28">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid md:grid-cols-3 gap-16 text-center">
          {[
            { step: '01', title: 'Sync Node', icon: Globe },
            { step: '02', title: 'Synthesize', icon: Sparkles },
            { step: '03', title: 'Orchestrate', icon: Send },
          ].map((item, i) => (
            <div key={i}>
              <item.icon className="w-10 h-10 text-blue-500 mx-auto mb-6" />
              <h4 className="text-2xl font-black text-white mb-4">{item.title}</h4>
              <p className="text-slate-500">Secure and automate your LinkedIn growth engine.</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TRUST STATS ================= */}
      <section className="py-24 border-y border-white/5 text-center">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'Posts Generated', val: '500k+' },
            { label: 'Active Users', val: '12k+' },
            { label: 'Uptime', val: '99.9%' },
            { label: 'Growth Multiplier', val: '12x' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-black text-white">{stat.val}</div>
              <div className="text-xs font-black text-blue-500 uppercase mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>




      {/* ===================== PRICING SECTION (REPLACED UI ONLY) ===================== */}
      <section className="py-32">
        <div className="max-w-[1470px] mx-auto px-6 text-center">
          <div className="mb-20">
            <h2 className="text-sm font-black text-blue-500 uppercase tracking-[0.3em] mb-4">
              Pricing Model
            </h2>
            <p className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Scaled for Your Ambition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => {
              const isPro = plan.name.toLowerCase().includes('gold');
              const isEnterprise = plan.price >= 5000;
              // console.log('plan', plan)

              return (
                <div
                  key={plan._id}
                  className={
                    isPro
                      ? 'bg-blue-600 p-12 rounded-[3.5rem] text-left relative overflow-hidden shadow-2xl shadow-blue-600/30 hover:scale-[1.05] transition-all'
                      : 'bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] text-left hover:scale-[1.02] transition-all'
                  }
                >
                  {isPro && (
                    <div className="absolute top-6 right-6 px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest text-white">
                      Most Popular
                    </div>
                  )}

                  <h3 className={`font-black uppercase tracking-tighter mb-2 ${isPro ? 'text-2xl text-white' : 'text-xl text-white'}`}>
                    {plan.name}
                  </h3>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className={`font-black ${isPro ? 'text-5xl text-white' : 'text-4xl text-white'}`}>
                      ${plan.price}
                    </span>
                    <span className={`${isPro ? 'text-blue-100/70' : 'text-slate-500'} text-xs font-bold uppercase`}>
                      /mo
                    </span>
                  </div>

                  <ul className={`space-y-4 mb-10 ${isPro ? 'text-white' : 'text-slate-400'}`}>
                    <li className="flex items-center gap-3 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      {plan.limits.maxAiGenerationsPerMonth} AI Generations
                    </li>
                    <li className="flex items-center gap-3 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      {plan.limits.maxScheduledPostsPerDay} Posts / Day
                    </li>
                    {plan.limits.imageGeneration && (
                      <li className="flex items-center gap-3 text-xs font-bold">
                        <Zap className="w-4 h-4" /> AI Image Engine
                      </li>
                    )}
                    {plan.limits.bulkScheduling && (
                      <li className="flex items-center gap-3 text-xs font-bold">
                        <Rocket className="w-4 h-4" /> Bulk Scheduling
                      </li>
                    )}
                    {isEnterprise && (
                      <li className="flex items-center gap-3 text-xs font-bold">
                        <ShieldCheck className="w-4 h-4" /> Enterprise Support
                      </li>
                    )}
                  </ul>

                  <button
                    onClick={navigateTo}
                    className={
                      isPro
                        ? 'w-full py-5 bg-white text-blue-600 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95'
                        : 'w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-slate-950 transition-all'
                    }
                  >
                    {isEnterprise ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>
              );
            })}
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

export default LandingPage;
