
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { Zap, CheckCircle2 } from 'lucide-react';

const AutonomousOps: React.FC = () => (
  <StaticWrapper 
    title="Autonomous Ops" 
    subtitle="Zero-Touch Authority Scaling" 
    icon={Zap}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        Scale your LinkedIn presence with a background engine that handles the complexity of scheduling, distribution, and engagement cycles automatically.
      </p>
      <div className="grid gap-4">
        {[
          "Smart-Time Scheduling based on audience activity.",
          "Automatic content distribution across multiple nodes.",
          "Intelligent engagement cycles to boost post reach.",
          "Self-optimizing lifecycle management."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default AutonomousOps;
