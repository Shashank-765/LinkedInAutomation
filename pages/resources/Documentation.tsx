
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { Layers, BookOpen } from 'lucide-react';

const Documentation: React.FC = () => (
  <StaticWrapper 
    title="Docs" 
    subtitle="Technical System Blueprint" 
    icon={Layers}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        Comprehensive guides on mastering AI synthesis, configuring AutoPilot, and interpreting telemetry.
      </p>
      <div className="grid gap-4">
        {[
          "Quickstart guide for rapid onboarding.",
          "Advanced AutoPilot configuration parameters.",
          "Telemetry data dictionary and mapping.",
          "Step-by-step LinkedIn OAuth setup."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <BookOpen className="w-5 h-5 text-indigo-400 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default Documentation;
