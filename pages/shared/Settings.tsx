
import React, { useState, useEffect } from 'react';
import { User as UserIcon, Shield, Bell, Linkedin, Key, Save, Building, Globe, Target, Loader2, CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { toast } from 'react-toastify';

const STRATEGY_TYPES = ['Educational', 'Sales', 'Thought Leadership', 'Personal Story', 'Recruitment'];

const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    companyName: user?.companyName || '',
    industry: user?.industry || '',
    postTypePreference: user?.postTypePreference || 'Educational'
  });
  // console.log('user', user)
  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      companyName: user?.companyName || '',
      industry: user?.industry || '',
      postTypePreference: user?.postTypePreference || 'Educational'
    });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;
    
    setIsSaving(true);
    try {
      const response = await authApi.updateProfile(user._id, formData);
      updateProfile(response.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLinkedInConnect = async () => {
    setIsLinking(true);
    try {
      // 1. Get the real LinkedIn Authorization URL from your backend (configured with your Admin credentials)
      const response = await authApi.getLinkedInLink();
      //console.log("Redirecting to LinkedIn Auth URL:", response);
      if (response.data.url) {
        // console.log('url', response.data.url)
        // alert(response.data.url);
        // 2. Redirect the user to LinkedIn
        window.location.href = response.data.url;
      } else {
        throw new Error("Could not retrieve LinkedIn Auth URL");
      }
    } catch (err) {
      toast.error("Failed to initiate LinkedIn connection. Check backend configuration.");
      setIsLinking(false);
    }
  };

  const handleLinkedInDisconnect = async () => {
    if (!confirm("Confirm disconnection? This will halt all active LinkedIn automation cycles.")) return;
    setIsLinking(true);
    try {
      const response = await authApi.disconnectLinkedIn();
      updateProfile(response.data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pb-20 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">System Configuration</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your profile metadata and automation handshakes.</p>
      </div>

      <div className="space-y-8">
        <div className={`rounded-[3rem] border transition-all overflow-hidden shadow-sm ${user?.linkedInConnected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
          <div className={`p-8 border-b flex items-center justify-between ${user?.linkedInConnected ? 'border-white/10' : 'dark:border-slate-700'}`}>
             <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user?.linkedInConnected ? 'bg-white text-blue-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'}`}>
                   <Linkedin className="w-5 h-5"/>
                </div>
                <h3 className="font-black text-lg uppercase tracking-tighter">LinkedIn Synchronization</h3>
             </div>
             {user?.linkedInConnected && (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/20 rounded-full border border-green-500/30">
                   <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Active Link</span>
                </div>
             )}
          </div>
          
          <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-10">
             {user?.linkedInConnected ? (
               <div className="flex items-center gap-6">
                  <div className="relative">
                    <img 
                      src={user.linkedInProfile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                      className="w-20 h-20 rounded-[1.5rem] object-cover border-4 border-white/20 shadow-2xl" 
                      alt="LinkedIn Profile" 
                    />
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-lg p-1 shadow-md">
                       <Linkedin className="w-4 h-4 text-blue-600 fill-current" />
                    </div>
                  </div>
                  <div className="text-left">
                     <p className="text-2xl font-black uppercase tracking-tighter leading-none">{user.linkedInProfile?.firstName} {user.linkedInProfile?.lastName}</p>
                     <p className="text-blue-100/70 text-sm font-medium mt-1">LinkedIn URN: {user.linkedInProfile?.urn}</p>
                     <div className="flex gap-4 mt-4">
                        <div className="text-center">
                           <p className="text-xs font-black uppercase tracking-widest opacity-60">Status</p>
                           <p className="font-black">Synced</p>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-center">
                           <p className="text-xs font-black uppercase tracking-widest opacity-60">Protocol</p>
                           <p className="font-black text-xs">OAuth 2.0</p>
                        </div>
                     </div>
                  </div>
               </div>
             ) : (
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                     <Linkedin className="w-10 h-10 text-slate-200" />
                  </div>
                  <div className="text-left max-w-md">
                     <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">COnnect To Your LInkedin</p>
                     <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2">To automate posts and pull analytics, you must authorize postpilot to access your LinkedIn professional profile.</p>
                  </div>
               </div>
             )}

             <div className="shrink-0 w-full md:w-auto">
               {user?.linkedInConnected ? (
                 <button 
                  onClick={handleLinkedInDisconnect}
                  disabled={isLinking}
                  className="w-full md:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                 >
                   {isLinking ? <Loader2 className="w-4 h-4 animate-spin"/> : <RefreshCw className="w-4 h-4" />}
                   Reset Connection
                 </button>
               ) : (
                 <button 
                  onClick={handleLinkedInConnect}
                  disabled={isLinking}
                  className="w-full md:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                 >
                   {isLinking ? <Loader2 className="w-5 h-5 animate-spin" /> : <ExternalLink className="w-5 h-5"/>}
                   Connect via LinkedIn
                 </button>
               )}
             </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="p-8 border-b dark:border-slate-700 flex items-center gap-4">
               <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-slate-400"/>
               </div>
               <h3 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tighter">Identity Profile</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                  <input className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                  <input disabled className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-900/20 text-slate-400 border-none rounded-2xl outline-none font-bold cursor-not-allowed" value={formData.email} />
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="p-8 border-b dark:border-slate-700 flex items-center gap-4">
               <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">
                  <Building className="w-5 h-5 text-slate-400"/>
               </div>
               <h3 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tighter">Strategic Context</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Company Entity</label>
                  <input className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Vertical Market</label>
                  <input className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
               </div>
               <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Automation Persona</label>
                  <select className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-black uppercase tracking-tighter text-xs" value={formData.postTypePreference} onChange={e => setFormData({...formData, postTypePreference: e.target.value})} >
                    {STRATEGY_TYPES.map(type => <option key={type} value={type}>{type} Strategy</option>)}
                  </select>
               </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
             <button type="button" onClick={() => window.location.reload()} className="px-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Discard Local Buffers</button>
             <button type="submit" disabled={isSaving} className="px-12 py-5 font-black uppercase tracking-widest text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5"/>}
                Commit Changes
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
