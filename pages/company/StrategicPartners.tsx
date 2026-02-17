
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { Globe, Users } from 'lucide-react';

const StrategicPartners: React.FC = () => (
  <StaticWrapper 
    title="Partners" 
    subtitle="Global Strategic Network" 
    icon={Globe}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        We collaborate with industry leaders in AI research and professional services to build the future of autonomous professional branding.
      </p>
      <div className="grid gap-4">
        {[
          "Direct integration with AI research labs.",
          "Joint initiatives with marketing agencies.",
          "Venture-backed growth ecosystems.",
          "Exclusive partner-only API access."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <Users className="w-5 h-5 text-indigo-500 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default StrategicPartners;
