
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, MessageSquare, Heart, Sparkles, Activity, Loader2 } from 'lucide-react';
import api from '../../services/api';

const Analytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/posts/analytics');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
         <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Performance Engine</h1>
         <p className="text-slate-500 dark:text-slate-400">Real-time telemetry from your LinkedIn automation cycles.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Posts', value: data?.stats.total || 0, icon: TrendingUp, color: 'text-blue-500' },
          { label: 'Live Content', value: data?.stats.posted || 0, icon: Activity, color: 'text-green-500' },
          { label: 'Avg Engagement', value: '4.2%', icon: Heart, color: 'text-red-500' },
          { label: 'Time Saved', value: `${(data?.stats.posted || 0) * 1.5}h`, icon: Sparkles, color: 'text-yellow-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</span>
                <stat.icon className={`w-5 h-5 ${stat.color}`}/>
             </div>
             <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{stat.value}</div>
             <p className="text-[10px] text-green-500 font-bold mt-2 uppercase tracking-tighter">Live from automation node</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold mb-10 text-xl text-slate-900 dark:text-white flex items-center gap-2"><TrendingUp className="text-blue-600" /> Publication Frequency</h3>
        <div className="h-[400px]">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chartData}>
                <defs>
                   <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorReach)" />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
