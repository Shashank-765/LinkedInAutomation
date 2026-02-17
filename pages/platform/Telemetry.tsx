
import React from 'react';
import StaticWrapper from '../../components/StaticWrapper';
import { Activity, BarChart3 } from 'lucide-react';

const Telemetry: React.FC = () => (
  <StaticWrapper 
    title="Telemetry" 
    subtitle="Surgical Engagement Insights" 
    icon={Activity}
  >
    <div className="space-y-8">
      <p className="text-xl text-slate-300 leading-relaxed">
        Gain real-time visibility into your professional graph. Track reach, velocity, and conversion with precision beyond standard vanity metrics.
      </p>
      <div className="grid gap-4">
        {[
          "Real-time engagement heatmaps.",
          "Detailed audience vertical breakdown.",
          "Velocity tracking for viral potential.",
          "Conversion-focused growth telemetry."
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <BarChart3 className="w-5 h-5 text-blue-500 shrink-0" />
            <span className="text-sm font-medium text-slate-400">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </StaticWrapper>
);

export default Telemetry;
