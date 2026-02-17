import { useAuth } from "@/context/AuthContext";
import React from "react";
import logo from '/assets/darklogo.png';
import { 
  Linkedin, Globe, ChevronRight, MessageSquare,
  Activity
} from 'lucide-react';
import { staticPages } from "@/config/staticPages";
import { StaticPageConfig } from "@/types";
import { Link } from "react-router-dom";

interface Props {
  page: StaticPageConfig;
}

const StaticPage: React.FC<Props> = ({ page }) => {

  const { user, logout } = useAuth();

  const grouped = staticPages.reduce((acc, page) => {
    if (!acc[page.category]) acc[page.category] = [];
    acc[page.category].push(page);
    return acc;
  }, {} as Record<string, typeof staticPages>);

  const categories = ["Platform", "Company", "Resources", "Legal"];

  const navigateTo = () => {
    window.location.pathname = user ? '/dashboard' : '/login';
  };

  const navigateToStatic = (slug: string) => {
    window.location.pathname = slug;
  };

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-sans overflow-x-hidden">

      {/* ===================================================== */}
      {/* GLOBAL BACKGROUND LAYERS */}
      {/* ===================================================== */}

      <div className="fixed inset-0 -z-10 overflow-hidden">

        {/* gradient mesh */}
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-indigo-600/20 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-250px] right-[-200px] w-[700px] h-[700px] bg-cyan-500/20 blur-[140px] rounded-full" />
        <div className="absolute top-[30%] left-[-200px] w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full" />

      </div>

      {/* ===================================================== */}
      {/* NAV */}
      {/* ===================================================== */}

      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-2xl">
        <div className="max-w-[1400px] mx-auto h-20 flex items-center justify-between px-6">

          <div
            onClick={() => (window.location.pathname = '/')}
            className="cursor-pointer"
          >
            <img src={logo} className="w-[170px]" />
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-slate-400">{user.email}</span>
                <button onClick={logout} className="text-blue-400 hover:underline text-sm">
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={navigateTo}
                className="px-6 py-2.5 bg-white text-slate-950 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ===================================================== */}
      {/* HERO SECTION */}
      {/* ===================================================== */}

      <section className="pt-40 pb-24 relative">

        <div className="max-w-6xl mx-auto px-6">

          {/* breadcrumb */}
          <div className="text-xs uppercase tracking-[0.3em] text-slate-600 mb-10">
            Platform / {page.title}
          </div>

          {/* GLASS HERO CARD */}
          <div className="relative rounded-[40px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-16 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">

            <h1 className="text-6xl font-black tracking-tight bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
              {page.title}
            </h1>

            <div
              className="mt-8 text-lg text-slate-400 leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: page.description }}
            />

            <div className="mt-10 flex gap-4">
              <button 
                onClick={navigateTo}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 font-semibold hover:opacity-90 transition"
              >
                Get Started
              </button>

              <button className="px-8 py-4 rounded-xl border border-white/10 hover:border-white/30 transition">
                Explore Platform
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ===================================================== */}
      {/* FEATURES */}
      {/* ===================================================== */}

      <section className="py-32">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-24">
            <h2 className="text-4xl font-bold">Core Capabilities</h2>
            <p className="text-slate-500 mt-4">
              Designed for performance, scalability, and precision.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">

            {page.features?.map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-10 transition-all duration-500 hover:-translate-y-4 hover:border-indigo-500/60 hover:shadow-[0_30px_80px_rgba(99,102,241,0.25)]"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-3xl" />

                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <div
                  className="mt-4 text-slate-400 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: feature.description }}
                />
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* ===================================================== */}
      {/* CTA BLOCK */}
      {/* ===================================================== */}

      <section className="pb-32">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <div className="rounded-[40px] border border-white/10 bg-gradient-to-br from-indigo-600/10 to-cyan-600/10 backdrop-blur-xl p-16">

            <h2 className="text-3xl font-bold">
              Build Systems That Scale Themselves
            </h2>

            <p className="mt-4 text-slate-400">
              Replace manual effort with intelligent execution.
            </p>

            <button 
              onClick={navigateTo}
              className="mt-8 px-10 py-4 rounded-xl bg-white text-slate-900 font-semibold flex items-center gap-2 mx-auto hover:scale-105 transition"
            >
              Start Now <ChevronRight className="w-5 h-5" />
            </button>

          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FOOTER (UNCHANGED STRUCTURE) */}
      {/* ===================================================== */}

      <footer className="py-32 bg-slate-950 border-t border-white/5 relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-16 mb-32 text-left">

            <div className="col-span-2 space-y-10">
              <div
                onClick={() => (window.location.pathname = '/')}
                className="cursor-pointer"
              >
                <img src={logo} className="px-5 w-[310px]" />
              </div>

              <p className="text-slate-500 font-medium max-w-sm leading-relaxed text-lg">
                The autonomous operating system for executive influence and professional category leadership.
              </p>

              <div className="flex gap-4">
                {[Linkedin, Activity, Globe, MessageSquare].map((Icon, i) => (
                  <button key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-blue-500 transition-all">
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-1 flex flex-row gap-[200px] hidden md:flex width-full">
              {categories.map((category) => (
                <div key={category}>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10">
                    {category}
                  </h4>

                  <ul className="space-y-6 text-sm ">
                    {grouped[category]?.map((page) => (
                      <li key={page.slug}>
                        <Link
                          to={page.slug}
                          onClick={() => navigateToStatic(page.slug)}
                          className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors whitespace-nowrap overflow-hidden text-ellipsis block max-w-[180px]"
                        >
                          {page.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
};

export default StaticPage;
