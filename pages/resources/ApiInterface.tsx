
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { Cpu, Terminal } from 'lucide-react';

const ApiInterface: React.FC = () => (
  <StaticWrapper 
    title="API Interface" 
    subtitle="Developer Node Access" 
    icon={Cpu}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        Extend LinkAutomate into your own ecosystem. Our RESTful API provides endpoints for content generation, scheduling, and metrics.
      </p>
      <div className="grid gap-4">
        {[
          "Secured OAuth 2.0 authorization.",
          "Webhooks for real-time post status updates.",
          "GraphQL support for complex telemetry queries.",
          "Scalable rate limits for enterprise use."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <Terminal className="w-5 h-5 text-blue-500 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default ApiInterface;
