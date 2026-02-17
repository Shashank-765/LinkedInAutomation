
import React from 'react';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
// Fix: Consolidating lucide-react imports and adding missing 'Target'
import { 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Cpu, 
  Zap, 
  Globe, 
  Activity, 
  Layers, 
  MessageSquare, 
  Lock, 
  Target 
} from 'lucide-react';

const STATIC_CONTENT: Record<string, { title: string, subtitle: string, description: string[], icon: any }> = {
  // Platform
  'autonomous-ops': {
    title: 'Autonomous Operations',
    subtitle: 'Zero-Touch Authority Scaling',
    icon: Zap,
    description: [
      'Scale your professional presence with a background engine that never sleeps. Our Autonomous Operations layer handles the complexity of scheduling, distribution, and engagement cycles.',
      'By analyzing your historical performance and vertical news signals, the system determines the optimal moment for deployment, ensuring your voice is heard when your audience is most active.'
    ]
  },
  'ai-synthesis': {
    title: 'AI Synthesis Engine',
    subtitle: 'High-Context Persona Generation',
    icon: Cpu,
    description: [
      'Gemini-powered creative suite designed to capture your professional DNA. Our models don\'t just generate text; they synthesize authority by blending your industry expertise with trending market signals.',
      'Every post is calibrated to sound authentically like you, maintaining a consistent executive voice across every lifecycle event.'
    ]
  },
  'telemetry': {
    title: 'Precision Telemetry',
    subtitle: 'Surgical Engagement Insights',
    icon: Activity,
    description: [
      'Real-time data visualization of your LinkedIn professional graph. Track reach, velocity, and conversion with surgical precision.',
      'Move beyond vanity metrics and understand the true impact of your content strategy through deep audience vertical analysis and performance heatmaps.'
    ]
  },
  'asset-engine': {
    title: 'AI Asset Engine',
    subtitle: 'Visual Dominance at Scale',
    icon: Layers,
    description: [
      'Automated generation of professional, high-impact imagery for every post. Our vision models understand corporate aesthetics and create minimalist, powerful visuals that stop the scroll.',
      'Manage all your creative assets in a unified vault, synchronized across all active deployment nodes.'
    ]
  },
  // Company
  'infrastructure': {
    title: 'Global Infrastructure',
    subtitle: 'Resilient SaaS Foundations',
    icon: Shield,
    description: [
      'Built on enterprise-grade clouds with multiple redundancies. Our stack is designed for 99.9% uptime, ensuring your automation cycles are never interrupted by system fatigue.',
      'We utilize distributed computing nodes to handle massive content generation requests simultaneously with minimal latency.'
    ]
  },
  'strategic-partners': {
    title: 'Strategic Partners',
    subtitle: 'Building the Future of Work',
    icon: Globe,
    description: [
      'Our ecosystem thrives through deep integration with industry leaders in AI research, professional networking, and enterprise security.',
      'We collaborate with visionary organizations to refine the boundaries of what is possible in autonomous professional branding.'
    ]
  },
  'network-status': {
    title: 'Network Status',
    subtitle: 'Real-Time System Health',
    icon: Activity,
    description: [
      'Full transparency into our API endpoints and synthesis nodes. We maintain a public record of system performance and scheduled maintenance.',
      'Current Status: All systems operational across Global Regions (US-East, EU-West, Asia-Pacific).'
    ]
  },
  'press-node': {
    title: 'Press Node',
    subtitle: 'Company News & Media Kit',
    icon: MessageSquare,
    description: [
      'Latest announcements, product releases, and strategic updates from the LinkAutomate leadership team.',
      'Access high-resolution assets and brand guidelines for media use.'
    ]
  },
  // Resources
  'api-interface': {
    title: 'API Interface',
    subtitle: 'Developer Node Access',
    icon: Cpu,
    description: [
      'Extend LinkAutomate functionality into your own enterprise tools. Our RESTful API provides endpoints for content generation, scheduling, and metrics extraction.',
      'Secure OAuth 2.0 authorization ensures seamless and safe data exchange between your infrastructure and ours.'
    ]
  },
  'documentation': {
    title: 'System Documentation',
    subtitle: 'The Blueprint for Growth',
    icon: Layers,
    description: [
      'Comprehensive guides on mastering AI synthesis, configuring AutoPilot nodes, and interpreting telemetry reports.',
      'From beginner setup to advanced enterprise configuration, find everything you need to scale your authority.'
    ]
  },
  'playbooks': {
    title: 'Growth Playbooks',
    subtitle: 'Proven Authority Frameworks',
    icon: Target,
    description: [
      'Industry-specific strategies for CEOs, Founders, and Thought Leaders. Learn the exact content cycles that drive high-value engagement in your vertical.',
      'Curated playbooks updated weekly based on changing LinkedIn algorithm patterns and global market trends.'
    ]
  },
  'community': {
    title: 'Community Hub',
    subtitle: 'The Network of Visionaries',
    icon: Globe,
    description: [
      'Connect with other high-growth professionals leveraging autonomous branding. Share insights, debate strategies, and grow together.',
      'Exclusive webinars and networking events for LinkAutomate license holders.'
    ]
  },
  // Legal
  'privacy-protocol': {
    title: 'Privacy Protocol',
    subtitle: 'Your Data, Your Identity',
    icon: Shield,
    description: [
      'We adhere to the highest standards of data protection. Your LinkedIn credentials never touch our storage; they are handled via secured OAuth handshakes.',
      'Complete transparency on data usage: we only process what is necessary to generate and distribute your authorized content.'
    ]
  },
  'service-agreement': {
    title: 'Service Agreement',
    subtitle: 'Terms of Engagement',
    icon: Activity,
    description: [
      'Defined service levels, usage policies, and responsibilities. Our agreement ensures a professional and safe environment for all automation nodes.',
      'We maintain strict compliance with professional networking guidelines to protect your account integrity.'
    ]
  },
  'security-audit': {
    title: 'Security Audit',
    subtitle: 'Fortified Authority',
    icon: Lock,
    description: [
      'Regular third-party security assessments and penetration testing. We provide our enterprise clients with regular audit reports to maintain trust.',
      'End-to-end encryption for all content buffers and metric logs.'
    ]
  },
  'gdpr-node': {
    title: 'GDPR Compliance',
    subtitle: 'Global Data Standards',
    icon: Globe,
    description: [
      'Full compliance with European data protection regulations. We provide tools for data portability, the right to be forgotten, and granular privacy controls.',
      'Every node in our network is configured to respect regional data sovereignty and user rights.'
    ]
  }
};

const StaticPage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const path = window.location.pathname.split('/').pop() || '';
  const content = STATIC_CONTENT[path];

  const navigateTo = () => {
    window.location.pathname = isAuthenticated ? '/dashboard' : '/login';
  };

  if (!content) {
    return (
      <div className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-10">
        <div className="text-center space-y-6">
           <h1 className="text-8xl font-black text-slate-800 uppercase tracking-tighter">404</h1>
           <p className="text-slate-500 font-bold uppercase tracking-widest">Node Not Found</p>
           <button onClick={() => navigateTo()} className="px-8 py-4 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">Return to Origin</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-sans selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">
      <PublicNavbar user={user} logout={logout} navigateTo={navigateTo} />
      
      <main className="pt-48 pb-32">
        <div className="max-w-4xl mx-auto px-6 text-left space-y-16">
           <div className="space-y-6">
              <div className="flex items-center gap-4 text-blue-500">
                 <content.icon className="w-12 h-12" />
                 <div className="h-px bg-blue-600 flex-1" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none italic">{content.title}</h1>
              <p className="text-xl md:text-2xl text-slate-500 font-black uppercase tracking-widest">{content.subtitle}</p>
           </div>

           <div className="space-y-10">
              {content.description.map((p, i) => (
                <p key={i} className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">{p}</p>
              ))}
           </div>

           <div className="pt-20 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 bg-slate-900 rounded-[3rem] border border-white/5 space-y-6">
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter">Ready to scale?</h3>
                 <p className="text-sm text-slate-500 font-medium">Initialize your professional authority today with Gemini-powered automation.</p>
                 <button onClick={() => navigateTo()} className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 flex items-center gap-2 group transition-all">
                    Initialize Setup <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
              <div className="p-10 bg-white/5 rounded-[3rem] border border-white/5 flex flex-col justify-center">
                 <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Industry Insight</span>
                 </div>
                 <p className="text-sm italic font-medium text-slate-400 leading-relaxed">
                   "The shift towards autonomous branding is the most significant change in executive communication in a decade. LinkAutomate is at the forefront of this revolution."
                 </p>
              </div>
           </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default StaticPage;
