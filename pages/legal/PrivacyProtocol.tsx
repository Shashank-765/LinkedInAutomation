
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { Shield, Lock } from 'lucide-react';

const PrivacyProtocol: React.FC = () => (
  <StaticWrapper 
    title="Privacy" 
    subtitle="Data Sovereignty Protocol" 
    icon={Shield}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        Your data is your identity. We never store LinkedIn passwords; all access is tokenized via secure OAuth.
      </p>
      <div className="grid gap-4">
        {[
          "Zero-knowledge LinkedIn credential storage.",
          "Encrypted content and telemetry logs.",
          "Strict 3rd-party data processing audits.",
          "Granular user-level privacy controls."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <Lock className="w-5 h-5 text-blue-500 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default PrivacyProtocol;
