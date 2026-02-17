
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { Shield, Server } from 'lucide-react';

const Infrastructure: React.FC = () => (
  <StaticWrapper 
    title="Infrastructure" 
    subtitle="Enterprise-Grade Foundations" 
    icon={Shield}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        Built on high-redundancy cloud nodes, our stack is designed for 99.9% uptime, ensuring your automation cycles are never interrupted.
      </p>
      <div className="grid gap-4">
        {[
          "Distributed computing for low-latency synthesis.",
          "Global redundancy across US, EU, and Asia.",
          "Auto-scaling server architecture.",
          "Hardened security perimeters."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <Server className="w-5 h-5 text-blue-500 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default Infrastructure;
