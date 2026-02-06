
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Clock, Users, CheckCircle, TrendingUp, Sparkles, Loader2, ArrowRight,Image } from 'lucide-react';
import api from '../services/api';

const StatCard: React.FC<{ label: string; value: string | number; icon: any; color: string; trend?: string }> = ({ label, value, icon: Icon, color, trend }) => (
  <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
        <h3 className="text-3xl font-black mt-2 text-slate-900 dark:text-white uppercase tracking-tighter ">{value}</h3>
        {trend && (
          <p className="text-[10px] font-black text-green-500 mt-3 flex items-center gap-1 uppercase tracking-widest">
            <TrendingUp className="w-3 h-3" /> {trend}
          </p>
        )}
      </div>
      <div className={`p-4 rounded-2xl ${color} shadow-lg shadow-current/10 group-hover:rotate-12 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, postsRes] = await Promise.all([
          api.get('/posts/analytics'),
          api.get('/posts/status')
        ]);
        setStats(statsRes.data.stats);
        setChartData(statsRes.data.chartData);
        setQueue(postsRes.data.filter((p: any) => p.status === 'SCHEDULED').slice(0, 3));
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>;

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tighter  leading-none">
            Welcome back, {user?.name?.split(' ')[0]} <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Your LinkedIn automation engine is running at peak capacity.</p>
        </div>
        <button 
          onClick={() => window.location.hash = '#/create'}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-95"
        >
          <Zap className="w-5 h-5 fill-current" /> Create Post
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Packets" value={stats?.total || 0} icon={CheckCircle} color="bg-green-500" trend="+12% Cycle Growth" />
        <StatCard label="Active Queue" value={stats?.scheduled || 0} icon={Clock} color="bg-blue-600" />
        <StatCard label="AI Post Usage" value={`${user?.usage?.aiGenerationsThisMonth || 0}/${user?.planId?.limits?.maxAiGenerationsPerMonth}`} icon={Zap} color="bg-indigo-600" />
        <StatCard label="AI Image Usage" value={`${user?.usage?.aiImagesThisMonth || 0}/${user?.planId?.limits?.maxAiImagesPerMonth}`} icon={Image} color="bg-pink-500" />
        {/* <StatCard label="Success Rate" value="98.2%" icon={Users} color="bg-orange-500" trend="Nominal" /> */}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-12">
             <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter ">Generation Velocity</h2>
             <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded-full" /><span className="text-[10px] font-black uppercase tracking-widest opacity-60">AI Synthesis</span></div>
             </div>
          </div>
          <div className="h-[350px] w-full">
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

        <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <h2 className="text-xl font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tighter ">Temporal Queue</h2>
          <div className="space-y-5">
            {queue.length > 0 ? queue.map((post, idx) => (
              <div key={post._id || idx} className="flex gap-5 p-5 rounded-[1.75rem] bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer group">
                <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex flex-col items-center justify-center font-black text-blue-600 shadow-sm shrink-0 border dark:border-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <span className="text-[9px] uppercase opacity-50">{new Date(post.scheduledAt).toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-xl leading-none mt-0.5">{new Date(post.scheduledAt).getDate()}</span>
                </div>
                <div className="flex-1 overflow-hidden flex flex-col justify-center">
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter ">{post.topic || 'Untitled Post'}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-bold uppercase tracking-widest">{new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            )) : (
              <div className="py-16 text-center space-y-4">
                 <Clock className="w-12 h-12 text-slate-200 mx-auto" />
                 <p className="text-xs text-slate-400 font-black uppercase tracking-widest">No Active Packets</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => window.location.hash = '#/schedule'}
            className="w-full mt-10 py-5 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-2xl transition-all flex items-center justify-center gap-3"
          >
            Audit Schedule <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
