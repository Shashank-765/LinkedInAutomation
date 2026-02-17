
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { Activity, CheckCircle } from 'lucide-react';

const NetworkStatus: React.FC = () => (
  <StaticWrapper 
    title="Status" 
    subtitle="Real-Time System Health" 
    icon={Activity}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        Full transparency into our API endpoints and synthesis nodes. We maintain 99.9% uptime for all global clusters.
      </p>
      <div className="grid gap-4">
        {[
          "API Endpoints: Operational (42ms latency).",
          "Synthesis Nodes: 100% Active.",
          "Asset Engine: Nominal Performance.",
          "Database Sync: Synchronized (Global)."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default NetworkStatus;
