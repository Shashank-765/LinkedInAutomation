
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { Layers, ImageIcon } from 'lucide-react';

const AssetEngine: React.FC = () => (
  <StaticWrapper 
    title="Asset Engine" 
    subtitle="Visual Authority Generation" 
    icon={Layers}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        Stop the scroll with professional, high-impact imagery. Our vision models generate corporate-ready visuals that align perfectly with your brand aesthetic.
      </p>
      <div className="grid gap-4">
        {[
          "Minimalist corporate illustration generation.",
          "Automated aspect ratio optimization (16:9, 1:1).",
          "Unified brand-aware color mapping.",
          "Cloud-synced asset management vault."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <ImageIcon className="w-5 h-5 text-blue-400 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default AssetEngine;
