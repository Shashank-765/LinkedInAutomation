
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { Cpu, Sparkles } from 'lucide-react';

const AiSynthesis: React.FC = () => (
  <StaticWrapper 
    title="AI Synthesis" 
    subtitle="High-Context Persona Modeling" 
    icon={Cpu}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        Distill your unique professional DNA into high-impact content. Our Gemini-powered engine synthesizes authority by blending industry expertise with trending signals.
      </p>
      <div className="grid gap-4">
        {[
          "Industry-calibrated tone and voice matching.",
          "Real-time market signal integration.",
          "Multi-strategy content generation (Sales, Storytelling, etc).",
          "Advanced context-aware editing protocols."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default AiSynthesis;
