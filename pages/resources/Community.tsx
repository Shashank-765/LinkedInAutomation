
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { Globe, Heart } from 'lucide-react';

const Community: React.FC = () => (
  <StaticWrapper 
    title="Community" 
    subtitle="Network of Authority Nodes" 
    icon={Globe}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        Join an exclusive network of high-growth visionaries. Share insights, debate strategies, and scale together.
      </p>
      <div className="grid gap-4">
        {[
          "Weekly strategy debriefs and webinars.",
          "Cross-industry networking events.",
          "Exclusive growth hack repositories.",
          "Member-only Beta access nodes."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <Heart className="w-5 h-5 text-red-500 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default Community;
