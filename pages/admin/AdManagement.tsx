
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Globe, Monitor, Smartphone, Layout, 
  ExternalLink, Save, X, Loader2, Sparkles, Megaphone, CheckCircle2
} from 'lucide-react';
import { adApi } from '../../services/api';
import { Ad, AdLocation } from '../../types';
import { toast } from 'react-toastify';

const AdManagement: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    location: AdLocation.DASHBOARD as AdLocation,
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await adApi.getAds();
      setAds(res.data || []);
    } catch (err) {
      toast.error("Failed to load ads registry");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (ad?: Ad) => {
    if (ad) {
      setEditingAd(ad);
      setFormData({
        title: ad.title,
        description: ad.description,
        imageUrl: ad.imageUrl,
        linkUrl: ad.linkUrl,
        location: ad.location,
        status: ad.status
      });
    } else {
      setEditingAd(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        location: AdLocation.DASHBOARD,
        status: 'active'
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingAd) {
        await adApi.updateAd(editingAd._id, formData);
        toast.success("Advertisement updated successfully");
      } else {
        await adApi.createAd(formData);
        toast.success("New advertisement published");
      }
      setModalOpen(false);
      fetchAds();
    } catch (err) {
      toast.error("Failed to process advertisement node");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this advertisement permanently?")) return;
    try {
      await adApi.deleteAd(id);
      setAds(prev => prev.filter(a => a._id !== id));
      toast.success("Advertisement decommissioned");
    } catch (err) {
      toast.error("Failed to remove node");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, imageUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Accessing Ad Registry...</p>
    </div>
  );

  return (
    <div className="px-10 mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Ad Inventory</h1>
          <p className="text-slate-500 font-medium">Manage cross-platform promotional assets and campaigns.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-5 h-5" /> Create New Ad
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ads.map((ad) => (
          <div key={ad._id} className="bg-white dark:bg-slate-800 rounded-[3rem] border dark:border-slate-700 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-xl hover:border-blue-500/50">
            <div className="relative aspect-video overflow-hidden">
               <img src={ad.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={ad.title} />
               <div className={`absolute top-6 left-6 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${ad.status === 'active' ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30'}`}>
                  {ad.status}
               </div>
               <div className="absolute top-6 right-6 px-3 py-1 bg-slate-900/80 text-white rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md flex items-center gap-1.5">
                  {ad.location === 'HOME' ? <Globe className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                  {ad.location}
               </div>
            </div>
            
            <div className="p-8 space-y-4 flex-1 flex flex-col">
               <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{ad.title}</h3>
                  <p className="text-sm text-slate-500 font-medium mt-3 line-clamp-2">{ad.description}</p>
               </div>
               
               <div className="pt-4 flex items-center justify-between border-t dark:border-slate-700 mt-auto">
                  <div className="flex gap-2">
                     <button onClick={() => handleOpenModal(ad)} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                     <button onClick={() => handleDelete(ad._id)} className="p-3 bg-red-50 dark:bg-red-900/20 text-red-400 hover:text-red-600 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                     <ExternalLink className="w-4 h-4" />
                  </a>
               </div>
            </div>
          </div>
        ))}
        {ads.length === 0 && (
          <div className="col-span-full py-24 text-center space-y-6">
             <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border-2 border-dashed border-slate-200 dark:border-slate-700">
                <Megaphone className="w-10 h-10 text-slate-200" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Empty Broadcast</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2">No promotional campaigns detected. Deploy your first ad node to reach your audience.</p>
             </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-4 animate-in zoom-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border dark:border-slate-700">
            <div className="p-10 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
               <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                     <Megaphone className="w-6 h-6" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter ">{editingAd ? 'Refine Ad Node' : 'Deploy Campaign'}</h2>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cross-Platform Broadcast Configuration</p>
                  </div>
               </div>
               <button onClick={() => setModalOpen(false)} className="p-3 bg-white dark:bg-slate-700 rounded-2xl hover:scale-90 transition-all shadow-sm"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8 text-left max-h-[75vh] overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Campaign Headline</label>
                     <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g. Join the AI Revolution" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Deployment Location</label>
                     <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value as AdLocation})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer">
                        <option value={AdLocation.DASHBOARD}>User Dashboard</option>
                        <option value={AdLocation.HOME}>Landing Page (Public)</option>
                     </select>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Campaign Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px] resize-none" placeholder="Elaborate on the value proposition..." />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Target Action Link (URL)</label>
                  <input required type="url" value={formData.linkUrl} onChange={e => setFormData({...formData, linkUrl: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="https://..." />
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Visual Asset</label>
                  {formData.imageUrl ? (
                    <div className="relative rounded-[2rem] overflow-hidden group aspect-video">
                       <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                       <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button type="button" onClick={() => setFormData({...formData, imageUrl: ''})} className="bg-red-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl">Reset Asset</button>
                       </div>
                    </div>
                  ) : (
                    <label className="w-full aspect-video border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all gap-3">
                       <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                       <Monitor className="w-10 h-10 text-slate-200" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Campaign Creative</span>
                    </label>
                  )}
               </div>

               <div className="flex bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl border dark:border-slate-700">
                  <button type="button" onClick={() => setFormData({...formData, status: 'active'})} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'active' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>Active Broadcast</button>
                  <button type="button" onClick={() => setFormData({...formData, status: 'inactive'})} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'inactive' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400'}`}>Paused / Draft</button>
               </div>

               <button disabled={isSubmitting} type="submit" className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {editingAd ? 'Update Ad Node' : 'Initialize Campaign Broadcast'}
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdManagement;
