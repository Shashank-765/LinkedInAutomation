
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { Activity, FileCheck } from 'lucide-react';

const ServiceAgreement: React.FC = () => (
  <StaticWrapper 
    title="Agreement" 
    subtitle="Terms of Engagement" 
    icon={Activity}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        Rules of engagement for our autonomous platform. Defined service levels for maximum network reliability.
      </p>
      <div className="grid gap-4">
        {[
          "Guaranteed 99.9% uptime SLA.",
          "Fair usage policy for AI synthesis.",
          "Responsible AI content generation rules.",
          "Clear account protection protocols."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <FileCheck className="w-5 h-5 text-indigo-500 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default ServiceAgreement;
