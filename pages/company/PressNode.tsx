
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { MessageSquare, Megaphone } from 'lucide-react';

const PressNode: React.FC = () => (
  <StaticWrapper 
    title="Press Node" 
    subtitle="Company News & Media" 
    icon={MessageSquare}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        Official source for LinkAutomate announcements, executive briefings, and media assets.
      </p>
      <div className="grid gap-4">
        {[
          "Quarterly Platform Evolution reports.",
          "Strategic partnership announcements.",
          "High-resolution executive media kits.",
          "Official brand and style guidelines."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <Megaphone className="w-5 h-5 text-blue-500 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default PressNode;
