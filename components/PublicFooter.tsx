
import React from 'react';
import { Send, Linkedin, Activity, Globe, MessageSquare } from 'lucide-react';
import logo from '/assets/darklogo.png';

const PublicFooter: React.FC = () => {
  return (
    <footer className="py-32 bg-slate-950 border-t border-white/5 relative">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-16 mb-32 text-left">
          <div className="col-span-2 space-y-2">
            <div className="flex items-center gap-4">
               <div
                              onClick={() => (window.location.pathname = '/')}
                              className="cursor-pointer"
                            >
                              <img src={logo} className="w-[170px]" />
                            </div>
            </div>
            <p className="text-slate-500 font-medium max-w-sm leading-relaxed text-lg">The autonomous operating system for executive influence and professional category leadership.</p>
            <div className="flex gap-4">
              {[Linkedin, Activity, Globe, MessageSquare].map((Icon, i) => (
                <button key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-blue-500 transition-all">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-10">Platform</h4>
            <ul className="space-y-6">
              <li><a href="/platform/autonomous-ops" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">Autonomous Ops</a></li>
              <li><a href="/platform/ai-synthesis" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">AI Synthesis</a></li>
              <li><a href="/platform/telemetry" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">Telemetry</a></li>
              <li><a href="/platform/asset-engine" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">Asset Engine</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-10">Company</h4>
            <ul className="space-y-6">
              <li><a href="/company/infrastructure" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">Infrastructure</a></li>
              <li><a href="/company/strategic-partners" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">Strategic Partners</a></li>
              <li><a href="/company/network-status" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">Network Status</a></li>
              <li><a href="/company/press-node" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">Press Node</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-10">Resources</h4>
            <ul className="space-y-6">
              <li><a href="/resources/api-interface" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">API Interface</a></li>
              <li><a href="/resources/documentation" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">Documentation</a></li>
              <li><a href="/resources/playbooks" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">Playbooks</a></li>
              <li><a href="/resources/community" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">Community</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-10">Legal</h4>
            <ul className="space-y-6">
              <li><a href="/legal/privacy-protocol" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">Privacy Protocol</a></li>
              <li><a href="/legal/service-agreement" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">Service Agreement</a></li>
              <li><a href="/legal/security-audit" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">Security Audit</a></li>
              <li><a href="/legal/gdpr-node" className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors">GDPR Node</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-white/5 gap-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">© 2025 LinkAutomate AI. Engineered for Scale.</p>
          </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Infrastructure: Online</span>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
