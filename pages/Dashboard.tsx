import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Zap,
  Clock,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Loader2,
  ArrowRight,
  Image,
  ExternalLink
} from 'lucide-react';
import api, { adApi } from '../services/api';
import { Ad } from '../types';

/* -------------------- Stat Card -------------------- */
const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: string;
}> = ({ label, value, icon: Icon, color, trend }) => (
  <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:scale-[1.02] hover:shadow-xl group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
          {label}
        </p>
        <h3 className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
          {value}
        </h3>
        {trend && (
          <p className="text-[10px] font-black text-green-500 mt-3 flex items-center gap-1 uppercase tracking-widest">
            <TrendingUp className="w-3 h-3" /> {trend}
          </p>
        )}
      </div>
      <div
        className={`p-4 rounded-2xl ${color} shadow-lg shadow-current/10 group-hover:rotate-12 transition-transform`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

/* -------------------- Dashboard -------------------- */
const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);


  /* -------------------- Ads Auto Swap -------------------- */
const [activeAdIndex, setActiveAdIndex] = useState(0);
const hasMultipleAds = ads.length > 1;

useEffect(() => {
  if (!hasMultipleAds) return;

  const interval = setInterval(() => {
    setActiveAdIndex((prev) => (prev + 1) % ads.length);
  }, 8000);

  return () => clearInterval(interval);
}, [ads.length, hasMultipleAds]);


  /* -------------------- Fetch Data -------------------- */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, postsRes, adsRes] = await Promise.all([
          api.get('/posts/analytics'),
          api.get('/posts/status'),
          adApi.getActiveAds('DASHBOARD')
        ]);

        setStats(statsRes.data.stats);
        setChartData(statsRes.data.chartData);
        setQueue(
          postsRes.data
            .filter((p: any) => p.status === 'SCHEDULED')
            .slice(0, 3)
        );
        setAds(adsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  const shouldAutoScroll = ads.length > 2;
  const displayAds = shouldAutoScroll ? [...ads, ...ads] : ads;

  return (
    <div className="space-y-10 max-w-7xl mx-auto">

      {/* -------------------- Header -------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tighter">
            Welcome back, {user?.name?.split(' ')[0]}
            <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
          </h1>
          <p className="text-slate-500 mt-3 font-medium">
            Your LinkedIn automation engine is running at peak capacity.
          </p>
        </div>

        <button
          onClick={() => (window.location.hash = '#/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-2xl shadow-blue-500/30"
        >
          <Zap className="w-5 h-5" /> Create Post
        </button>
      </div>

      {/* -------------------- Stats -------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Packets"
          value={stats?.total || 0}
          icon={CheckCircle}
          color="bg-green-500"
          trend="+12% Cycle Growth"
        />
        <StatCard
          label="Active Queue"
          value={stats?.scheduled || 0}
          icon={Clock}
          color="bg-blue-600"
        />
        <StatCard
          label="AI Post Usage"
          value={`${user?.usage?.aiGenerationsThisMonth || 0}/${user?.planId?.limits?.maxAiGenerationsPerMonth}`}
          icon={Zap}
          color="bg-indigo-600"
        />
        <StatCard
          label="AI Image Usage"
          value={`${user?.usage?.aiImagesThisMonth || 0}/${user?.planId?.limits?.maxAiImagesPerMonth}`}
          icon={Image}
          color="bg-pink-500"
        />
      </div>

      {/* -------------------- ADS (NEW VIEW) -------------------- */}
      {ads.length > 0 && (
          <div className="relative w-full overflow-hidden group">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${activeAdIndex * 100}%)`
              }}
            >
              {ads.map((ad, i) => (
                <a
                  key={i}
                  href={ad.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-full px-4"
                >
                  <div className="h-[220px] flex flex-col md:flex-row bg-slate-900 border border-white/5 rounded-[3rem] overflow-hidden hover:border-blue-500/30 transition-all shadow-2xl">

                    {/* IMAGE */}
                    <div className="md:w-[70%] flex items-center justify-center bg-black/10 p-4">
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="md:w-[30%] p-6 flex flex-col justify-center">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                        {ad.title}
                      </h3>

                      <p className="text-sm text-slate-400 font-medium mt-4 line-clamp-3">
                        {ad.description}
                      </p>

                      <span className="mt-8 inline-flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-[9px]">
                        Learn More <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* DOT INDICATORS */}
            {hasMultipleAds && (
              <div className="flex justify-center gap-2 mt-4">
                {ads.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === activeAdIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}


      {/* -------------------- Chart + Queue -------------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* Chart */}
        <div className="xl:col-span-8 bg-white dark:bg-slate-800 p-10 rounded-[3rem]  shadow-sm">
          <h2 className="text-xl font-black mb-8 uppercase">
            Generation Velocity
          </h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '24px', color: '#fff', padding: '16px', fontWeight: 'black' }} />
                            <Area type="monotone" dataKey="count" stroke="#2563eb" fillOpacity={1} fill="url(#colorViews)" strokeWidth={5} />
                          </AreaChart>
                        </ResponsiveContainer>
          </div>
        </div>

        {/* Queue */}
        <div className="xl:col-span-4 bg-white dark:bg-slate-800 p-10 rounded-[3rem]  shadow-sm">
          <h2 className="text-xl font-black mb-8 uppercase">
            Temporal Queue
          </h2>

          <div className="space-y-4">
            {queue.length ? (
              queue.map((post: any) => (
                <div
                  key={post._id}
                  className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition"
                >
                  <p className="font-black truncate">
                    {post.topic || 'Untitled Post'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(post.scheduledAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-10">
                No Active Packets
              </p>
            )}
          </div>

          <button
            onClick={() => (window.location.hash = '#/schedule')}
            className="w-full mt-8 py-4 bg-blue-90 text-blue-600 font-black uppercase tracking-widest text-[10px] border border-blue-600 rounded-2xl flex items-center justify-center gap-2"
          >
            Audit Schedule <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
