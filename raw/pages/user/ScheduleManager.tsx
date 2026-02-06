
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Filter, Clock, Trash2, Edit2, 
  Loader2, Sparkles, X, Save, CalendarDays, CheckCircle, ArrowRight,
  List, Send, AlertCircle, History, Image as ImageIcon, ExternalLink, Activity,
  FileText, PlayCircle, ThumbsUp, MessageSquare, RotateCw, ChevronRight
} from 'lucide-react';
import { PostStatus } from '../../types';
import { postApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

type TabType = 'ALL' | 'SCHEDULED' | 'POSTED' | 'FAILED' | 'PENDING';

const ScheduleManager: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  
  const [viewingPost, setViewingPost] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    setLoading(true);
    try {
      const res = await postApi.getScheduled();
      setPosts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(p => {
    if (activeTab === 'ALL') return true;
    return p.status === activeTab;
  }).sort((a, b) => {
    const timeA = new Date(a.postedAt || a.scheduledAt || a.createdAt).getTime();
    const timeB = new Date(b.postedAt || b.scheduledAt || b.createdAt).getTime();
    return activeTab === 'POSTED' ? timeB - timeA : timeA - timeB;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this post from the automation cycle?")) return;
    try {
      await postApi.delete(id);
      setPosts(prev => prev.filter(p => p._id !== id));
      if (viewingPost?._id === id) setViewingPost(null);
    } catch (err) {
      toast.error("Removal failed.");
    }
  };

  const handlePostNow = async (id: string) => {
    if (!user?.linkedInConnected) {
      toast.error("Please connect LinkedIn in Settings first.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await postApi.deploy(id);
      toast.success("Published Successfully!");
      fetchScheduledPosts();
      if (viewingPost?._id === id) setViewingPost(response.data.post);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Deployment failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLike = async () => {
    if (!viewingPost) return;
    setIsProcessing(true);
    try {
      await postApi.like(viewingPost._id);
      toast.success("Liked on LinkedIn!");
      handleSyncMetrics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Like failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComment = async () => {
    if (!viewingPost || !commentText.trim()) return;
    setIsProcessing(true);
    try {
      await postApi.comment(viewingPost._id, commentText);
      setCommentText('');
      toast.success("Comment posted!");
      handleSyncMetrics();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Comment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSyncMetrics = async () => {
    if (!viewingPost) return;
    setIsProcessing(true);
    try {
      const res = await postApi.syncMetrics(viewingPost._id);
      setViewingPost({ ...viewingPost, metrics: res.data.metrics });
      setPosts(prev => prev.map(p => p._id === viewingPost._id ? { ...p, metrics: res.data.metrics } : p));
    } catch (err) {
      console.error("Sync failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const viewLivePost = (postId: string) => {
    const url = `https://www.linkedin.com/feed/update/${postId}`;
    window.open(url, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'POSTED': return 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:border-green-800';
      case 'SCHEDULED': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800';
      case 'FAILED': return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-800';
      default: return 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/20 dark:border-slate-800';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter  leading-none">Posts Overview</h1>
          <p className="text-slate-500 font-medium mt-3">Real-time status of your autonomous LinkedIn presence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border dark:border-slate-700 shadow-sm">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Filter className="w-4 h-4 text-blue-500"/> Stream Filters</h3>
             <div className="space-y-3">
               {[
                 { id: 'ALL', label: 'Global View', icon: List, count: posts.length },
                 { id: 'SCHEDULED', label: 'In Orbit', icon: Send, count: posts.filter(p => p.status === 'SCHEDULED').length },
                 { id: 'POSTED', label: 'History', icon: History, count: posts.filter(p => p.status === 'POSTED').length },
                 { id: 'FAILED', label: 'Criticals', icon: AlertCircle, count: posts.filter(p => p.status === 'FAILED').length },
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as TabType)}
                   className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all border font-black uppercase tracking-tighter text-xs ${activeTab === tab.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                 >
                   <div className="flex items-center gap-3">
                     <tab.icon className="w-4 h-4" /> {tab.label}
                   </div>
                   <span className={`px-2 py-0.5 rounded-lg text-[9px] ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>{tab.count}</span>
                 </button>
               ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="p-24 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Consulting Post Registry...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map(post => {
                const isPosted = post.status === 'POSTED';
                const date = new Date(post.postedAt || post.scheduledAt || post.createdAt);
                
                return (
                  <div key={post._id} 
                    onClick={() => setViewingPost(post)}
                    className="bg-white dark:bg-slate-800 p-7 rounded-[2.5rem] border dark:border-slate-700 flex items-center justify-between group hover:border-blue-500 transition-all shadow-sm cursor-pointer overflow-hidden relative"
                  >
                    <div className="flex gap-8 items-center flex-1 overflow-hidden">
                      <div className={`w-16 h-16 rounded-[1.5rem] flex flex-col items-center justify-center font-black shrink-0 ${
                        isPosted ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                      }`}>
                        <span className="text-[10px] uppercase opacity-60 font-black">{date.toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-2xl tracking-tighter leading-none mt-1">{date.getDate()}</span>
                      </div>
                      <div className="flex-1 overflow-hidden text-left">
                        <h4 className="font-black text-lg text-slate-900 dark:text-white leading-tight uppercase tracking-tighter truncate">{post.topic || 'Deployment Packet'}</h4>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Clock className="w-3.5 h-3.5 text-blue-500"/> {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className={`px-2.5 py-1 rounded-lg uppercase font-black text-[9px] tracking-widest border ${getStatusColor(post.status)}`}>
                            {post.status}
                          </span>
                          {post.metrics && isPosted && (
                             <span className="text-[9px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center gap-3">
                               <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3"/> {post.metrics.likes}</span>
                               <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3"/> {post.metrics.comments}</span>
                             </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* FIXED: ChevronRight imported and available */}
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-24 text-center bg-white dark:bg-slate-800 rounded-[3.5rem] border-2 border-dashed border-slate-100 dark:border-slate-700 flex flex-col items-center">
               <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6">
                 <Calendar className="w-10 h-10 text-slate-300" />
               </div>
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter ">Sector Empty</h3>
               <p className="text-slate-500 mt-2 font-medium max-w-xs mx-auto">No posts currently match the active filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Post Details Modal (The Inspector) */}
      {viewingPost && (
        <div className= 'flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-2xl p-4 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-800 w-full max-w-5xl rounded-[4rem] shadow-2xl border dark:border-slate-700 overflow-hidden flex flex-col max-h-[92vh]">
              <div className="p-8 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                 <div className="flex items-center gap-4 text-left">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${viewingPost.status === 'POSTED' ? 'bg-green-600 shadow-green-500/20' : 'bg-blue-600 shadow-blue-500/20'}`}>
                       {viewingPost.status === 'POSTED' ? <CheckCircle className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter  leading-none">{viewingPost.topic || 'Packet Insight'}</h3>
                       <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${viewingPost.status === 'POSTED' ? 'text-green-500' : 'text-blue-500'}`}>Protocol status: {viewingPost.status}</p>
                    </div>
                 </div>
                 <button onClick={() => setViewingPost(null)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-18">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8 text-left">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" /> Lifecycle Metadata</h4>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Created</p>
                             <p className="text-sm font-bold dark:text-white">{new Date(viewingPost.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{viewingPost.status === 'POSTED' ? 'Published' : 'Target Date'}</p>
                             <p className="text-sm font-bold dark:text-white">
                                {new Date(viewingPost.postedAt || viewingPost.scheduledAt || viewingPost.createdAt).toLocaleDateString()}
                             </p>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Content Buffer</label>
                          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border dark:border-slate-700 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                             {viewingPost.content}
                          </p>
                       </div>
                    </div>

                    <div className="space-y-8 text-left">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ExternalLink className="w-4 h-4 text-green-500" /> Platform Engagement</h4>
                       
                       <div className="p-8 bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] border border-slate-800 space-y-6 shadow-inner relative">
                          {viewingPost.status === 'POSTED' ? (
                            <>
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                                       <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                       <p className="text-xs font-black text-white uppercase tracking-tighter">Live on LinkedIn</p>
                                       <p className="text-[9px] text-green-400 font-bold uppercase tracking-widest">Active Thread</p>
                                    </div>
                                 </div>
                                 <button onClick={handleSyncMetrics} disabled={isProcessing} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                    <RotateCw className={`w-4 h-4 text-white ${isProcessing ? 'animate-spin' : ''}`} />
                                 </button>
                               </div>

                               <div className="grid grid-cols-3 gap-4">
                                  <button onClick={handleLike} className="p-4 bg-white/5 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all border border-white/5">
                                     <ThumbsUp className="w-5 h-5 text-blue-400" />
                                     <span className="text-xl font-black text-white leading-none">{viewingPost.metrics?.likes || 0}</span>
                                     <span className="text-[8px] font-black text-slate-500 uppercase">Likes</span>
                                  </button>
                                  <div className="p-4 bg-white/5 rounded-2xl flex flex-col items-center gap-2 border border-white/5">
                                     <MessageSquare className="w-5 h-5 text-indigo-400" />
                                     <span className="text-xl font-black text-white leading-none">{viewingPost.metrics?.comments || 0}</span>
                                     <span className="text-[8px] font-black text-slate-500 uppercase">Comments</span>
                                  </div>
                                  <div className="p-4 bg-white/5 rounded-2xl flex flex-col items-center gap-2 border border-white/5">
                                     <History className="w-5 h-5 text-orange-400" />
                                     <span className="text-xl font-black text-white leading-none">{viewingPost.metrics?.impressions || 0}</span>
                                     <span className="text-[8px] font-black text-slate-500 uppercase">Reach</span>
                                  </div>
                               </div>

                               <div className="space-y-4 pt-4 border-t border-white/10">
                                  <div className="flex gap-2">
                                     <input 
                                      value={commentText} 
                                      onChange={e => setCommentText(e.target.value)} 
                                      placeholder="Add an executive response..." 
                                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-blue-500"
                                     />
                                     <button onClick={handleComment} className="px-6 bg-blue-600 rounded-xl text-[10px] font-black uppercase text-white hover:bg-blue-700 transition-colors">Post</button>
                                  </div>
                                  <button 
                                    onClick={() => viewLivePost(viewingPost.linkedInPostId)}
                                    className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all"
                                  >
                                    <ExternalLink className="w-4 h-4" /> View Live Profile Feed
                                  </button>
                               </div>
                            </>
                          ) : (
                            <div className="py-8 text-center space-y-6">
                               <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto border border-slate-700">
                                  <Clock className="w-8 h-8 text-slate-500" />
                                </div>
                               <div>
                                  <p className="text-sm text-slate-300 font-black uppercase tracking-tighter">Standby for Authorization</p>
                                  <p className="text-[9px] text-slate-500 mt-2  font-medium">Pending automated or manual deployment trigger.</p>
                               </div>
                               <button 
                                onClick={() => handlePostNow(viewingPost._id)}
                                disabled={isProcessing}
                                className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all disabled:opacity-50"
                               >
                                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                                  Authorize Deployment
                               </button>
                            </div>
                          )}
                       </div>

                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Asset Inventory</h4>
                          <div className="flex gap-3 flex-wrap">
                             {viewingPost.images?.length > 0 ? viewingPost.images.map((img: string, i: number) => (
                               <img key={i} src={img} className="w-24 h-24 rounded-2xl object-cover border dark:border-slate-700 shadow-md hover:scale-110 transition-transform cursor-zoom-in" alt="Post Asset" />
                             )) : (
                               <div className="w-full py-10 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
                                  <ImageIcon className="w-6 h-6 mb-2" />
                                  <p className="text-[10px] font-black uppercase tracking-widest">No Visual Assets</p>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t dark:border-slate-700 flex gap-4 bg-slate-50/30 dark:bg-slate-900/30">
                 <button 
                  onClick={() => handleDelete(viewingPost._id)} 
                  className="px-8 py-5 bg-red-50 text-red-600 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-red-100 transition-all active:scale-95"
                 >
                    <Trash2 className="w-4 h-4" /> Purge Packet
                 </button>
                 <div className="flex-1" />
                 <button onClick={() => setViewingPost(null)} className="px-14 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all">
                    Dismiss Inspector
                 </button>
              </div>
           </div>
        </div>
      </div>
      )}

    </div>
  );
};

export default ScheduleManager;
