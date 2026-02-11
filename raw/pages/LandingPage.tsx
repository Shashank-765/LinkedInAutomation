
import React from 'react';
import { 
  Send, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Linkedin, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  Globe, 
  ChevronRight,
  MessageSquare,
  Users,
  Quote,
  Star,
  Activity,
  Award,
  Building2,
  Crown,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';


// console.log('User in LandingPage:', user, 'Authenticated:', logout);

const LandingPage: React.FC = () => {
    const { user, logout } = useAuth();
  const navigateTo = (hash: string) => {
    if(user == null){
      window.location.hash = '#/login';
    } else {
      window.location.hash = '#/dashboard';
    }
  };

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* 1. Navigation */}
      <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div onClick={() => navigateTo('#/home')}className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Send className="text-white w-5 h-5" />
            </div>
            <span  className="font-black text-2xl text-white uppercase tracking-tighter bold">Postpilot</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {['Product', 'Enterprise', 'Partners', 'Pricing'].map((item) => (
              <a key={item} href="#" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            
            
            {
                user ? (
                    <>
                        <span className="text-sm font-medium text-slate-400">{user.email}</span>
                        <button onClick={logout} className="text-sm font-medium text-blue-500 hover:underline">Logout</button>
                    </>
                ) : (
                    <button 
                      onClick={() => navigateTo('#/login')}
                      className="px-6 py-2.5 bg-white text-slate-950 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
                    >
                      Sign In
                    </button>
                )
            }
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Powered by Gemini 3.0 Pro</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Automate Your <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">LinkedIn Authority.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium mb-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            Enterprise-grade AI content generation, strategic scheduling, and deep performance analytics. Built for high-growth teams and thought leaders.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
            <button 
              onClick={() => navigateTo('#/login')}
              className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all"
            >
              Start Building Now <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigateTo('#/login')}
              className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              <Linkedin className="w-4 h-4" /> View Live Demo
            </button>
          </div>

          {/* Abstract Platform Preview */}
          <div className="mt-20 relative max-w-5xl mx-auto p-4 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-sm animate-in zoom-in duration-1000 delay-500">
            <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/5 aspect-video flex items-center justify-center relative shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
              <div className="space-y-4 w-full px-12 text-left">
                <div className="h-4 w-48 bg-white/20 rounded-full animate-pulse" />
                <div className="h-32 w-full bg-white/10 rounded-3xl animate-pulse" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                  <div className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                  <div className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UPDATED: Partner & Sponsor Section */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-12">Visionary Partners & Strategic Sponsors</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {['BAstionex', 'Metsspacechain', 'Businessbay', 'NEXUS', 'APEX', 'ZENITH'].map(brand => (
              <span key={brand} className="text-2xl md:text-3xl font-black text-white  tracking-tighter">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Market Segments Section */}
      <section className="py-32 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-sm font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Strategic Ecosystem</h2>
            <p className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Tailored for Every Tier of Leadership.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="p-10 bg-slate-950 border border-white/5 rounded-[3rem] hover:border-blue-500/50 transition-all group">
                <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   <Building2 className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Enterprises</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Centralized content governance for global teams and multi-subsidiary brand management.</p>
             </div>

             <div className="p-10 bg-slate-950 border border-white/5 rounded-[3rem] hover:border-indigo-500/50 transition-all group">
                <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   <Crown className="w-7 h-7 text-indigo-500" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">CEOs & Owners</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Personal brand synthesis that captures your unique executive voice without the time investment.</p>
             </div>

             <div className="p-10 bg-slate-950 border border-white/5 rounded-[3rem] hover:border-purple-500/50 transition-all group">
                <div className="w-14 h-14 bg-purple-600/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   <Users className="w-7 h-7 text-purple-500" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Private Clients</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Exclusive high-priority generation and strategic consulting for high-net-worth individuals.</p>
             </div>

             <div className="p-10 bg-slate-950 border border-white/5 rounded-[3rem] hover:border-green-500/50 transition-all group">
                <div className="w-14 h-14 bg-green-600/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   <Briefcase className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Business Leaders</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Velocity tools built for managers and leaders looking to scale their team's social presence.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. Bento Feature Grid */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center">
            <h2 className="text-sm font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Core Infrastructure</h2>
            <p className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Everything for Growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-slate-900/50 border border-white/5 p-12 rounded-[3.5rem] hover:border-blue-500/30 transition-all group">
               <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Zap className="text-blue-500 w-8 h-8" />
               </div>
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">AI Content Synthesis</h3>
               <p className="text-slate-400 font-medium leading-relaxed max-w-md">Our specialized Gemini models understand LinkedIn's professional nuances, generating posts that drive engagement without the generic "AI feel."</p>
            </div>

            <div className="md:col-span-4 bg-slate-900/50 border border-white/5 p-12 rounded-[3.5rem] hover:border-indigo-500/30 transition-all group">
               <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <BarChart3 className="text-indigo-500 w-8 h-8" />
               </div>
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Real-Time Insights</h3>
               <p className="text-slate-400 font-medium leading-relaxed">Direct LinkedIn API integration provides live feedback on post performance, reach, and audience sentiment.</p>
            </div>

            <div className="md:col-span-4 bg-slate-900/50 border border-white/5 p-12 rounded-[3.5rem] hover:border-green-500/30 transition-all group">
               <div className="w-14 h-14 bg-green-600/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8 text-green-500" />
               </div>
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Smart Queue</h3>
               <p className="text-slate-400 font-medium leading-relaxed">Bulk schedule weeks of content in seconds. Our engine spaces posts for maximum visibility.</p>
            </div>

            <div className="md:col-span-8 bg-slate-900/50 border border-white/5 p-12 rounded-[3.5rem] hover:border-orange-500/30 transition-all group">
               <div className="w-14 h-14 bg-orange-600/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="text-orange-500 w-8 h-8" />
               </div>
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Enterprise Security</h3>
               <p className="text-slate-400 font-medium leading-relaxed max-w-md">Role-based access control, secure OAuth synchronization, and encrypted token management ensure your brand's voice remains protected.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The 3-Step Process */}
      <section className="py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -z-10" />

            {[
              { step: '01', title: 'Sync Node', desc: 'Securely link your LinkedIn profile via enterprise-grade OAuth.', icon: Globe },
              { step: '02', title: 'Synthesize', desc: 'Define your persona and let Gemini craft high-impact viral content.', icon: Sparkles },
              { step: '03', title: 'Orchestrate', desc: 'Approve, schedule, and watch your influence grow automatically.', icon: Send },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-slate-950 border border-white/10 rounded-3xl flex items-center justify-center mb-8 shadow-2xl group-hover:border-blue-500 transition-colors relative">
                  <span className="absolute -top-4 -left-4 text-xs font-black text-blue-500">{item.step}</span>
                  <item.icon className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{item.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trust Stats */}
      <section className="py-20 border-y border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around gap-12">
          {[
            { label: 'Posts Generated', val: '500k+' },
            { label: 'Active Users', val: '12k+' },
            { label: 'Uptime', val: '99.9%' },
            { label: 'Growth Multiplier', val: '12x' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2">{stat.val}</div>
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Pricing Preview */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-20">
            <h2 className="text-sm font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Pricing Model</h2>
            <p className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Scaled for Your Ambition.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
             {/* Starter */}
             <div className="bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] text-left hover:scale-[1.02] transition-all">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Basic Tier</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-slate-500 text-xs font-bold uppercase">/mo</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {['5 AI Generations', '3 Scheduled Posts/Day', 'Standard Analytics', 'Single Account'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-slate-700" /> {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigateTo('#/login')}
                  className="w-full py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-slate-950 transition-all"
                >
                  Access Basic
                </button>
             </div>

             {/* Pro - Featured */}
             <div className="bg-blue-600 p-12 rounded-[3.5rem] text-left relative overflow-hidden shadow-2xl shadow-blue-600/20 hover:scale-[1.05] transition-all">
                <div className="absolute top-6 right-6 px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-sm">Most Popular</div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Professional</h3>
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-5xl font-black text-white">$49</span>
                  <span className="text-blue-100/70 text-sm font-bold uppercase">/mo</span>
                </div>
                <ul className="space-y-5 mb-12">
                  {['Unlimited AI Ops', 'AI Image Engine', 'Bulk Orchestration', 'Strategic Priority', 'Multi-Account Sync'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-black text-white uppercase tracking-tighter">
                      <Zap className="w-4 h-4 fill-white text-white" /> {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigateTo('#/login')}
                  className="w-full py-5 bg-white text-blue-600 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95"
                >
                  Join Professional
                </button>
             </div>

             {/* Enterprise */}
             <div className="bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] text-left hover:scale-[1.02] transition-all">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Corporate</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-white">$199</span>
                  <span className="text-slate-500 text-xs font-bold uppercase">/mo</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {['Team Management', 'Custom AI Fine-tuning', 'White Label Options', 'Dedicated API Support', 'Compliance Vault'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                      <ShieldCheck className="w-4 h-4 text-blue-500" /> {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigateTo('#/login')}
                  className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-700 transition-all"
                >
                  Contact Sales
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* 7. Footer Section */}
      <footer className="py-20 bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
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

            <div>
               <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Ecosystem</h4>
               <ul className="space-y-4">
                 {['Features', 'Marketplace', 'API Docs', 'Safety Cloud'].map(item => (
                   <li key={item}><a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors">{item}</a></li>
                 ))}
               </ul>
            </div>

            <div>
               <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Governance</h4>
               <ul className="space-y-4">
                 {['Privacy Protocol', 'Service Agreement', 'Security Audit', 'Billing'].map(item => (
                   <li key={item}><a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors">{item}</a></li>
                 ))}
               </ul>
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
          onClick={() => navigateTo('#/login')}
          className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-3"
         >
            Get Started <ChevronRight className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
};

export default LandingPage;
