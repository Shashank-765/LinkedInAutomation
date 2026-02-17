import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Zap, ShieldCheck, Sparkles, ArrowRight, Linkedin, BarChart3, Clock,X, 
  CheckCircle2, Globe, ChevronRight, MessageSquare, Users, Quote, Star, Activity, 
  Award, Building2, Crown, Briefcase, Megaphone, ExternalLink, Rocket, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adApi, adminApi } from '../services/api';
import { Ad } from '../types';
import logo from '/assets/darklogo.png';
import { staticPages } from '../config/staticPages';
import { Link } from 'react-router-dom';
import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';


const LandingPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);



   const grouped = staticPages.reduce((acc, page) => {
    if (!acc[page.category]) acc[page.category] = [];
    acc[page.category].push(page);
    return acc;
  }, {} as Record<string, typeof staticPages>);

  const categories = ["Platform", "Company", "Resources", "Legal"];

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

  const navigateToStatic = (slug: string) => {
    window.location.pathname = slug;
  };

 return (
<div className="bg-[#06070f] text-slate-200 min-h-screen font-sans overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">

{/* ================= HEADER ================= */}
      <PublicNavbar user={user} logout={logout} navigateTo={navigateTo} />



{/* ================= HERO ================= */}
<section className="relative pt-44 pb-32 text-center">

  <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 blur-[160px] rounded-full -z-10" />

  <div className="max-w-[1000px] mx-auto px-6">
    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
      Automate Your <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
        LinkedIn Authority
      </span>
    </h1>

    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12">
      Enterprise-grade AI content generation, strategic scheduling, and deep analytics for serious growth.
    </p>

    <button
      onClick={navigateTo}
      className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/40 hover:scale-105 transition-all flex items-center gap-3 mx-auto"
    >
      Start Now <ArrowRight className="w-4 h-4" />
    </button>
  </div>
</section>


{/* ================= ADS SECTION ================= */}
<section className="py-20 bg-[#06070f]">
  <div className="max-w-[1400px] mx-auto px-6">

    <div
      className="relative w-full md:w-[85%] mx-auto overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/40 backdrop-blur-xl shadow-2xl"
      style={{ minHeight: "260px" }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >

      <span className="absolute top-6 left-6 z-20 rounded-full bg-blue-600/20 border border-blue-500/30 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-400">
        Sponsored
      </span>

      <div
        className={`flex h-full ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
        style={{
          transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedAds.map((ad, i) => (
          <a key={i} href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="min-w-full px-10 py-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">

              <div className="flex items-center justify-center">
                <img src={ad.imageUrl} alt={ad.title} className="max-h-[220px] object-contain hover:scale-105 transition" />
              </div>

              <div>
                <h3 className="text-3xl font-black uppercase text-white">{ad.title}</h3>
                <p className="text-slate-400 mt-6 text-sm max-w-md">{ad.description}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-[10px]">
                  Learn More <ExternalLink className="w-3 h-3" />
                </span>
              </div>

            </div>
          </a>
        ))}
      </div>
    </div>

    {hasMultipleAds && (
      <div className="flex justify-center gap-3 mt-8">
        {ads.map((_, i) => {
          const realIndex =
            activeIndex === 0
              ? ads.length - 1
              : activeIndex === ads.length + 1
              ? 0
              : activeIndex - 1;

          return (
            <button
              key={i}
              onClick={() => setActiveIndex(i + 1)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === realIndex ? "w-8 bg-blue-500" : "w-2 bg-white/30"
              }`}
            />
          );
        })}
      </div>
    )}
  </div>
</section>


{/* ================= PARTNERS ================= */}
<section className="py-24 bg-gradient-to-br from-slate-900/90 to-slate-800/60 backdrop-blur-xl border border-slate-900 text-center">
  <p className="text-xs uppercase tracking-[0.4em] text-slate-500 mb-12">
    Visionary Partners
  </p>
  <div className="flex flex-wrap justify-center gap-16 opacity-40">
    {['Bastionex','Metsspacechain','Businessbay','NEXUS','APEX','ZENITH'].map((brand)=>(
      <span key={brand} className="text-2xl font-black text-white">{brand}</span>
    ))}
  </div>
</section>


{/* ================= ECOSYSTEM ================= */}
<section className="py-32 bg-[#06070f]">
  <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
    {[
      { title: 'Enterprises', icon: Building2 },
      { title: 'CEOs & Owners', icon: Crown },
      { title: 'Private Clients', icon: Users },
      { title: 'Business Leaders', icon: Briefcase },
    ].map((item, i) => (
      <div key={i} className="p-10 rounded-3xl bg-slate-900 border border-white/5 hover:border-blue-500 transition">
        <item.icon className="w-8 h-8 text-blue-500 mx-auto mb-6"/>
        <h3 className="text-lg font-black uppercase mb-3">{item.title}</h3>
        <p className="text-slate-400 text-sm">Leadership-focused automation infrastructure.</p>
      </div>
    ))}
  </div>
</section>


{/* ================= 3 STEP ================= */}
<section className="py-28  bg-gradient-to-br from-slate-900/80 to-slate-800/40 backdrop-blur-xl border border-slate-900 ">
  <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-16 text-center">
    {[
      { title: 'Sync Node', icon: Globe , description:'Connect your LinkedIn identity and data streams.'},
      { title: 'Synthesize', icon: Sparkles, description:'Leverage AI to create personalized content.' },
      { title: 'Orchestrate', icon: Send, description:'Automate your outreach and engagement.' },
    ].map((item,i)=>(
      <div className="bg-slate-800 border border-slate-900 p-6 rounded-3xl hover:border-blue-500 transition" key={i}>
        <item.icon className="w-10 h-10 text-blue-500 mx-auto mb-6 "/>
        <h4 className="text-2xl font-black mb-4">{item.title}</h4>
        <p className="text-slate-400">{item.description}</p>
      </div>
    ))}
  </div>
</section>


{/* ================= STATS ================= */}
<section className="py-28 bg-gradient-to-br from-slate-900/80 to-slate-800/40 backdrop-blur-xl border border-slate-900 text-center ">
  <div className="max-w-[1200px]  mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
    {[
      { label:'Posts Generated', val:'500k+' },
      { label:'Active Users', val:'12k+' },
      { label:'Uptime', val:'99.9%' },
      { label:'Growth Multiplier', val:'12x' },
    ].map((stat,i)=>(
      <div className="bg-slate-800 border border-slate-900 p-6 rounded-3xl hover:border-blue-500 transition" key={i}>
        <div className="text-4xl font-black text-white">{stat.val}</div>
        <div className="text-xs uppercase tracking-widest font-bold text-blue-500 mt-2">{stat.label}</div>
      </div>
    ))}
  </div>
</section>


{/* ================= PRICING ================= */}
<section className="py-32 bg-gradient-to-br from-blue-900/80 to-golden-800/40 backdrop-blur-xl border border-slate-900 ">
  <div className="max-w-[1470px] mx-auto px-6 text-center">
    <h2 className="text-4xl md:text-5xl font-black uppercase mb-20">Scaled For Your Ambition</h2>

<div className="grid md:grid-cols-3 gap-10">

  {plans.map((plan) => {
    const isGold = plan.name.toLowerCase().includes("gold");
    const isPlatinum = plan.name.toLowerCase().includes("platinum");
    const isEnterprise = plan.price >= 5000;

    return (
      <div
        key={plan._id}
        className={`
          relative flex flex-col justify-between
          rounded-[3rem] p-10 min-h-[620px]
          transition-all duration-300 hover:scale-[1.03]

          ${
            isGold
              ? "bg-gradient-to-br from-slate-700 to-slate-800 text-white border border-white/10"
              : isPlatinum
              ? "bg-gradient-to-br from-slate-700 to-slate-800 text-white border border-white/10"
              : "bg-gradient-to-br from-slate-700 to-slate-800 text-white border border-white/10"
          }
        `}
      >

        {/* POPULAR BADGE */}
        {isGold && (
          <div className="absolute top-6 right-6 text-xs font-black px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black">
            MOST POPULAR
          </div>
        )}

        {/* ================= TOP ================= */}
        <div>

          <h3 className="text-2xl font-black uppercase tracking-wide mb-2">
            {plan.name}
          </h3>

          <p className="text-sm opacity-70 mb-6">
            {isEnterprise
              ? "Best for large teams and enterprise automation"
              : isGold
              ? "Perfect for growing creators and marketers"
              : "Ideal for individuals starting with AI automation"}
          </p>

          {/* PRICE */}
          <div className="flex items-end gap-2 mb-8">
            <span className="text-5xl font-black">₹{plan.price}</span>
            <span className="text-sm opacity-70 mb-1">/ month</span>
          </div>

          {/* FEATURE TAGS */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20">
              AI Powered
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20">
              Automation
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20">
              Analytics
            </span>
          </div>

          <div className="h-px w-full bg-white/20 mb-8" />

          {/* ================= VISUAL LIMITS ================= */}

          <div className="space-y-6 mb-8">

            {/* AI Generation Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>AI Content Generations Per Month</span>
                <span>{plan.limits.maxAiGenerationsPerMonth}</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-white w-[90%]" />
              </div>
            </div>

            {/* Scheduling Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>AI Images Per Month</span>
                <span>{plan.limits.maxAiImagesPerMonth}</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-white w-[60%]" />
              </div>
            </div>

          </div>

          <div className="h-px w-full bg-white/20 mb-8" />

          {/* ================= FEATURES ================= */}
          <ul className="space-y-3 text-sm font-semibold">
            <li className="flex items-center gap-3">🤖 AI Content Engine</li>
            <li className="flex items-center gap-3">📅 Smart Scheduling</li>

            {plan.limits.imageGeneration && (
              <li className="flex items-center gap-3">🎨 AI Image Generator</li>
            )}

            {plan.limits.bulkScheduling && (
              <li className="flex items-center gap-3">⚡ Bulk Automation</li>
            )}

            {isEnterprise && (
              <li className="flex items-center gap-3">🏢 Dedicated Account Manager</li>
            )}
          </ul>

        </div>

        {/* ================= TRUST SECTION ================= */}
        <div className="mt-8 mb-6 text-xs opacity-70 space-y-1">
          <div>✔ 99.9% Uptime Guarantee</div>
          <div>✔ Secure Cloud Infrastructure</div>
          <div>✔ Priority Support</div>
        </div>

        {/* ================= CTA ================= */}
        <button
          onClick={navigateTo}
          className={`
            w-full py-4 rounded-2xl font-bold uppercase text-xs tracking-wide
            transition-all duration-300 hover:scale-105

            ${
              isGold
                ? "bg-white text-black": "bg-white text-slate-900"
            }
          `}
        >
          {isEnterprise ? "Contact Sales" : "Get Started"}
        </button>

      </div>
    );
  })}

</div>

  </div>
</section>


      <PublicFooter />


{/* ================= MOBILE CTA ================= */}
<div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
  <button
    onClick={navigateTo}
    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-2xl"
  >
    Get Started
  </button>
</div>

</div>
);

};

export default LandingPage;
