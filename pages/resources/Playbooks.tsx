
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { Target, Lightbulb } from 'lucide-react';

const Playbooks: React.FC = () => (
  <StaticWrapper 
    title="Playbooks" 
    subtitle="Proven Authority Frameworks" 
    icon={Target}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        Industry-specific strategies used by the top 1% of creators. Learn the content rhythms that drive engagement.
      </p>
      <div className="grid gap-4">
        {[
          "Founder-focused thought leadership framework.",
          "SaaS-specific educational content loops.",
          "Recruitment and talent branding sequences.",
          "Personal branding for executive leaders."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default Playbooks;
