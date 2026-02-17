import { StaticPageConfig } from "@/types";

export const staticPages: StaticPageConfig[] = [

  // ================= PLATFORM =================

  {
    title: "Autonomous Ops",
    slug: "/autonomous-ops",
    category: "Platform",
    description: `
      <p class="text-lg font-semibold mb-3">Self-Operating Intelligence Layer</p>
      <p class="mb-4">Autonomous Ops removes manual execution from your workflow. AI systems continuously plan, execute, and optimize operations in real time.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>Fully automated publishing pipelines</li>
        <li>Adaptive performance optimization</li>
        <li>Continuous learning from engagement signals</li>
      </ul>
    `,
    features: [
      { title: "Workflow Automation", description: "End-to-end AI execution of content pipelines." },
      { title: "Smart Decision Engine", description: "Adaptive systems that optimize based on performance signals." },
      { title: "Continuous Learning", description: "AI models improve from real engagement data." }
    ]
  },

  {
    title: "AI Synthesis",
    slug: "/ai-synthesis",
    category: "Platform",
    description: `
      <p class="text-lg font-semibold mb-3">Advanced Content Intelligence</p>
      <p class="mb-4">AI Synthesis transforms intent into high-quality communication using contextual understanding and behavioral modeling.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>Audience-aligned content generation</li>
        <li>Brand tone consistency engine</li>
        <li>Multi-format output creation</li>
      </ul>
    `,
    features: [
      { title: "Context-Aware Generation", description: "Produces content aligned with intent and audience." },
      { title: "Tone Intelligence", description: "Maintains brand voice consistency automatically." },
      { title: "Multi-Format Output", description: "Generate text, visuals, and structured content." }
    ]
  },

  {
    title: "Telemetry",
    slug: "/telemetry",
    category: "Platform",
    description: `
      <p class="text-lg font-semibold mb-3">Real-Time Performance Intelligence</p>
      <p class="mb-4">Telemetry provides continuous insight into system behavior, engagement trends, and predictive performance analytics.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>Live engagement monitoring</li>
        <li>Predictive performance modeling</li>
        <li>Actionable insight dashboards</li>
      </ul>
    `,
    features: [
      { title: "Engagement Monitoring", description: "Track reactions, impressions, and growth signals." },
      { title: "Performance Modeling", description: "Predictive analytics for content success." },
      { title: "Insight Dashboards", description: "Actionable intelligence, not vanity metrics." }
    ]
  },

  {
    title: "Asset Engine",
    slug: "/asset-engine",
    category: "Platform",
    description: `
      <p class="text-lg font-semibold mb-3">Centralized Content Infrastructure</p>
      <p class="mb-4">Asset Engine manages, organizes, and distributes digital content across AI workflows with precision and control.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>Secure media storage</li>
        <li>Version tracking & revision history</li>
        <li>Automated distribution pipelines</li>
      </ul>
    `,
    features: [
      { title: "Media Management", description: "Store and organize all content assets securely." },
      { title: "Version Control", description: "Track asset history and revisions." },
      { title: "Distribution Pipeline", description: "Automated deployment across publishing channels." }
    ]
  },

  // ================= COMPANY =================

  {
    title: "Infrastructure",
    slug: "/infrastructure",
    category: "Company",
    description: `
      <p class="text-lg font-semibold mb-3">Enterprise-Grade Architecture</p>
      <p class="mb-4">Built for scale, reliability, and performance across global environments with advanced security layers.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>Distributed cloud architecture</li>
        <li>Multi-layered security protection</li>
        <li>Global performance optimization</li>
      </ul>
    `,
    features: [
      { title: "Cloud Native Systems", description: "Highly available distributed infrastructure." },
      { title: "Security Layers", description: "Multi-layered protection and monitoring." },
      { title: "Global Deployment", description: "Optimized performance across regions." }
    ]
  },

  {
    title: "Strategic Partners",
    slug: "/strategic-partners",
    category: "Company",
    description: `
      <p class="text-lg font-semibold mb-3">Collaborative Innovation Network</p>
      <p class="mb-4">Strategic partnerships accelerate growth through shared technology, integration, and enterprise collaboration.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>Technology ecosystem integration</li>
        <li>Industry growth alliances</li>
        <li>Enterprise co-development initiatives</li>
      </ul>
    `,
    features: [
      { title: "Technology Integrations", description: "Seamless interoperability with partner platforms." },
      { title: "Growth Alliances", description: "Joint innovation with industry leaders." },
      { title: "Enterprise Collaborations", description: "Custom solutions for large-scale deployment." }
    ]
  },

  {
    title: "Network Status",
    slug: "/network-status",
    category: "Company",
    description: `
      <p class="text-lg font-semibold mb-3">Operational Transparency</p>
      <p class="mb-4">Monitor system health, uptime metrics, and service performance with complete real-time visibility.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>Live system monitoring</li>
        <li>Incident tracking & reporting</li>
        <li>Historical uptime analytics</li>
      </ul>
    `,
    features: [
      { title: "Real-Time Monitoring", description: "Track platform health instantly." },
      { title: "Incident Reporting", description: "Transparent issue tracking and resolution." },
      { title: "Uptime Metrics", description: "Historical performance analytics." }
    ]
  },

  {
    title: "Press Node",
    slug: "/press-node",
    category: "Company",
    description: `
      <p class="text-lg font-semibold mb-3">Official Communication Hub</p>
      <p class="mb-4">Access company announcements, media resources, and public statements in one centralized archive.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>Press releases & announcements</li>
        <li>Brand media resources</li>
        <li>Public communication archive</li>
      </ul>
    `,
    features: [
      { title: "Media Resources", description: "Brand assets and press materials." },
      { title: "Company News", description: "Platform updates and milestones." },
      { title: "Public Statements", description: "Official communication archive." }
    ]
  },

  // ================= RESOURCES =================

  {
    title: "API Interface",
    slug: "/api-interface",
    category: "Resources",
    description: `
      <p class="text-lg font-semibold mb-3">Developer Control Layer</p>
      <p class="mb-4">Programmatic access to platform capabilities with secure authentication and scalable architecture.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>Secure token authentication</li>
        <li>Workflow automation endpoints</li>
        <li>Enterprise-grade scalability</li>
      </ul>
    `,
    features: [
      { title: "Secure Authentication", description: "Token-based access control." },
      { title: "Automation Endpoints", description: "Control workflows via API." },
      { title: "Scalable Requests", description: "Built for enterprise load handling." }
    ]
  },

  {
    title: "Documentation",
    slug: "/documentation",
    category: "Resources",
    description: `
      <p class="text-lg font-semibold mb-3">Comprehensive Knowledge Base</p>
      <p class="mb-4">Technical guides, references, and best practices to help teams deploy and operate efficiently.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>Integration tutorials</li>
        <li>Technical reference material</li>
        <li>Operational best practices</li>
      </ul>
    `,
    features: [
      { title: "Integration Guides", description: "Step-by-step setup instructions." },
      { title: "Technical Reference", description: "Detailed system specifications." },
      { title: "Best Practices", description: "Optimized usage frameworks." }
    ]
  },

  {
    title: "Playbooks",
    slug: "/playbooks",
    category: "Resources",
    description: `
      <p class="text-lg font-semibold mb-3">Strategic Execution Frameworks</p>
      <p class="mb-4">Proven operational models designed for scalable growth and intelligent automation.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>Content growth strategies</li>
        <li>Automation deployment blueprints</li>
        <li>Enterprise scaling systems</li>
      </ul>
    `,
    features: [
      { title: "Content Strategies", description: "Proven publishing models." },
      { title: "Automation Blueprints", description: "Prebuilt operational workflows." },
      { title: "Scaling Systems", description: "Enterprise deployment strategies." }
    ]
  },

  {
    title: "Community",
    slug: "/community",
    category: "Resources",
    description: `
      <p class="text-lg font-semibold mb-3">Professional Network</p>
      <p class="mb-4">Connect with operators, creators, and teams leveraging AI automation to scale growth.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>Knowledge sharing network</li>
        <li>Collaborative support channels</li>
        <li>Workshops & live sessions</li>
      </ul>
    `,
    features: [
      { title: "Knowledge Sharing", description: "Learn from experienced operators." },
      { title: "Support Channels", description: "Peer-to-peer assistance." },
      { title: "Events & Sessions", description: "Workshops and live discussions." }
    ]
  },

  // ================= LEGAL =================

  {
    title: "Privacy Protocol",
    slug: "/privacy-protocol",
    category: "Legal",
    description: `
      <p class="text-lg font-semibold mb-3">Data Protection Framework</p>
      <p class="mb-4">Privacy-first architecture ensuring secure handling, minimal collection, and strict access control.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>End-to-end encryption</li>
        <li>Minimal data collection</li>
        <li>Role-based access control</li>
      </ul>
    `,
    features: [
      { title: "End-to-End Encryption", description: "All sensitive data secured in transit and at rest." },
      { title: "Data Minimization Policy", description: "We collect only what is required." },
      { title: "Access Control Layers", description: "Strict role-based permissions." }
    ]
  },

  {
    title: "Service Agreement",
    slug: "/service-agreement",
    category: "Legal",
    description: `
      <p class="text-lg font-semibold mb-3">Platform Usage Terms</p>
      <p class="mb-4">Transparent policies defining responsibilities, standards, and subscription structures.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>Usage guidelines</li>
        <li>Liability framework</li>
        <li>Subscription policies</li>
      </ul>
    `,
    features: [
      { title: "Usage Standards", description: "Defined expectations for platform use." },
      { title: "Liability Framework", description: "Transparent responsibilities." },
      { title: "Subscription Terms", description: "Billing and renewal clarity." }
    ]
  },

  {
    title: "Security Audit",
    slug: "/security-audit",
    category: "Legal",
    description: `
      <p class="text-lg font-semibold mb-3">Independent Security Assurance</p>
      <p class="mb-4">Continuous monitoring, vulnerability testing, and rapid response procedures.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>Regular penetration testing</li>
        <li>24/7 threat monitoring</li>
        <li>Incident response protocols</li>
      </ul>
    `,
    features: [
      { title: "Penetration Testing", description: "Regular third-party audits." },
      { title: "Threat Monitoring", description: "24/7 protection systems." },
      { title: "Incident Response", description: "Rapid containment protocols." }
    ]
  },

  {
    title: "GDPR Node",
    slug: "/gdpr-node",
    category: "Legal",
    description: `
      <p class="text-lg font-semibold mb-3">Regulatory Compliance Framework</p>
      <p class="mb-4">Ensuring full alignment with international data protection standards.</p>
      <ul class="list-disc pl-5 space-y-1 text-sm opacity-80">
        <li>User data control rights</li>
        <li>Transparent consent management</li>
        <li>Global regulatory compliance</li>
      </ul>
    `,
    features: [
      { title: "User Data Rights", description: "Access, correction, and deletion controls." },
      { title: "Consent Management", description: "Transparent data processing permissions." },
      { title: "Regulatory Compliance", description: "Aligned with international standards." }
    ]
  }

];
