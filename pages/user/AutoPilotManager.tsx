
import React, { useState, useEffect } from 'react';
import { 
  Zap, Calendar, ShieldCheck, Sparkles, Plus, Trash2, Save, 
  Loader2, Globe, Clock, Target, Rocket, Activity, CheckCircle2, 
  X, CalendarDays, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { postApi } from '../../services/api';
import { toast } from 'react-toastify';

const AutoPilotManager: React.FC = () => {
  const { user, setUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState(user?.autoPilotConfig || {
    enabled: false,
    industryKeywords: user?.industry || 'technology',
    calendarEvents: []
  });

  const [newEvent, setNewEvent] = useState({ date: '', topic: '' });

  const handleToggle = () => setConfig({ ...config, enabled: !config.enabled });

  const addEvent = () => {
    if (!newEvent.date || !newEvent.topic) return;
    setConfig({
      ...config,
      calendarEvents: [...(config.calendarEvents || []), newEvent]
    });
    console.log('config', config)
    setNewEvent({ date: '', topic: '' });
  };

  const removeEvent = (idx: number) => {
    const events = [...(config.calendarEvents || [])];
    events.splice(idx, 1);
    setConfig({ ...config, calendarEvents: events });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await postApi.updateAutoPilot(config);
      setUser(res.data);
      toast.success("Autonomous Protocol Updated");
    } catch (err) {
      toast.error("Failed to update protocol");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-24 text-left animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Auto Post Manager</h1>
          <p className="text-slate-500 font-medium mt-3">Configure autonomous content generation and sequence logic.</p>
        </div>
        <button 
          onClick={handleToggle}
          className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl flex items-center gap-3 ${config.enabled ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}
        >
          {config.enabled ? <Zap className="w-5 h-5 fill-current" /> : <Clock className="w-5 h-5" />}
          {config.enabled ? 'AutoPilot Active' : 'AutoPilot Offline'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border dark:border-slate-700 shadow-sm space-y-8">
              <div className="space-y-2">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> Content Keywords</h3>
                 <p className="text-xs text-slate-500 font-medium">Used to fetch trending news when no calendar events exist.</p>
                 <input 
                  value={config.industryKeywords} 
                  onChange={e => setConfig({...config, industryKeywords: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500 mt-2" 
                  placeholder="e.g. crypto, ai, fintech"
                 />
              </div>

              <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800 space-y-4">
                 <div className="flex items-center gap-3 text-blue-600">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Protocol Insight</span>
                 </div>
                 <p className="text-[11px] text-blue-900 dark:text-blue-300 font-bold leading-relaxed">
                   When enabled, the system will check your Event Calendar first. If empty for the current date, it will source real-time trending news based on your keywords.
                 </p>
              </div>

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Commit Protocol
              </button>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white dark:bg-slate-800 p-10 rounded-[4rem] border dark:border-slate-700 shadow-sm space-y-10">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3"><CalendarDays className="w-6 h-6 text-indigo-500" /> Event Calendar</h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{config.calendarEvents?.length || 0} Triggers</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2.5rem] border dark:border-slate-800">
                 <div className="md:col-span-4 space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Trigger Date</label>
                    <input 
                      type="date" 
                      value={newEvent.date} 
                      onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full px-5 py-4 bg-white dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none border dark:border-slate-700" 
                    />
                 </div>
                 <div className="md:col-span-6 space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Event Topic or descryption</label>
                    <input 
                      value={newEvent.topic} 
                      onChange={e => setNewEvent({...newEvent, topic: e.target.value})}
                      placeholder="e.g. Christmas Celebration" 
                      className="w-full px-5 py-4 bg-white dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none border dark:border-slate-700" 
                    />
                 </div>
                 <div className="md:col-span-2">
                    <button 
                      onClick={addEvent}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                       <Plus className="w-6 h-6" />
                    </button>
                 </div>
              </div>

              <div className="space-y-3">
                 {config.calendarEvents?.length === 0 ? (
                   <div className="py-20 text-center space-y-4">
                      <Calendar className="w-12 h-12 text-slate-200 mx-auto" />
                      <p className="text-xs text-slate-400 font-black uppercase tracking-widest">No Autonomous Triggers Defined</p>
                   </div>
                 ) : (
                   config.calendarEvents?.map((event: any, i: number) => (
                     <div key={i} className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-700 group hover:border-blue-500/50 transition-all">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-400 uppercase tracking-widest text-[9px] border dark:border-slate-700">
                              {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">{event.topic}</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Scheduled Deployment: {event.date}</p>
                           </div>
                        </div>
                        <button onClick={() => removeEvent(i)} className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                           <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                   ))
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AutoPilotManager;
