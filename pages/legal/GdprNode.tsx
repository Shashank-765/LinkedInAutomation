
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { Globe, UserCheck } from 'lucide-react';

const GdprNode: React.FC = () => (
  <StaticWrapper 
    title="GDPR Node" 
    subtitle="Global Data Standards" 
    icon={Globe}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        Full compliance with EU data protection. We empower you with complete control over your professional data.
      </p>
      <div className="grid gap-4">
        {[
          "Right to erasure (the 'forgotten' node).",
          "One-click data portability exports.",
          "Localized EU data residency support.",
          "Detailed processing activity logs."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <UserCheck className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default GdprNode;
