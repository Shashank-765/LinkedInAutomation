
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { Lock, ShieldAlert } from 'lucide-react';

const SecurityAudit: React.FC = () => (
  <StaticWrapper 
    title="Security" 
    subtitle="Verified Infrastructure" 
    icon={Lock}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        Hardened authority. We undergo regular third-party audits to ensure our infrastructure remains fortified.
      </p>
      <div className="grid gap-4">
        {[
          "Bi-annual penetration testing.",
          "SOC 2 Type II compliance roadmap.",
          "End-to-end data encryption (AES-256).",
          "Automated threat detection nodes."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default SecurityAudit;
