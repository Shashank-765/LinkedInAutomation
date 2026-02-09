
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, Clock, Building2, Eye, ChevronRight, Sparkles, 
  AlertCircle, Search, CheckSquare, MessageSquare, ShieldCheck, History, ThumbsUp, RotateCcw,
  Square, CheckCircle, Loader2, Calendar, ListChecks, X, Trash2, Edit2, Save, FileText, Monitor, Smartphone, MoreHorizontal, 
  ThumbsUp as LikeIcon, MessageSquare as CommentIcon, Share2, Send,
  Image as ImageIcon, PlayCircle, CalendarDays, Check, Plus
} from 'lucide-react';
import { PostStatus, UserRole, Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { postApi } from '../../services/api';
import { toast } from 'react-toastify';

const PostApprovals: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Modals
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showSingleScheduleModal, setShowSingleScheduleModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeView, setActiveView] = useState<'DESKTOP' | 'MOBILE'>('DESKTOP');

  // Single Schedule State
  const [singleScheduleData, setSingleScheduleData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '10:00'
  });

  // Bulk Config State
  const [bulkConfig, setBulkConfig] = useState({
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    postsPerDay: 1
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postApi.getPending();
      setPosts(response.data || []);
    } catch (err) {
      console.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handlePostNow = async (id: string) => {
    setIsProcessing(true);
    try {
      await postApi.updateStatus(id, PostStatus.SCHEDULED,  new Date().toISOString());
      setPosts(prev => prev.filter(p => p._id !== id));
      setSelectedPost(null);
      toast.success('🚀 Published Successfully!');
    } catch (err) {
      toast.error("Failed to post.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSingleSchedule = async () => {
    if (!selectedPost) return;
    setIsProcessing(true);
    try {
      const scheduledAt = new Date(`${singleScheduleData.date}T${singleScheduleData.time}`).toISOString();
      await postApi.updateStatus(selectedPost._id, PostStatus.SCHEDULED, scheduledAt);
      setPosts(prev => prev.filter(p => p._id !== selectedPost._id));
      setSelectedPost(null);
      setShowSingleScheduleModal(false);
      toast.success('Post Scheduled!');
    } catch (err) {
      toast.error("Scheduling failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedPost) return;
    setIsProcessing(true);
    try {
      await postApi.updatePost(selectedPost._id, { content: editContent });
      setPosts(prev => prev.map(p => p._id === selectedPost._id ? { ...p, content: editContent } : p));
      setSelectedPost(prev => prev ? { ...prev, content: editContent } : null);
      setIsEditing(false);
      toast.success("Draft Updated");
    } catch (err) {
      toast.error("Failed to save edits");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkSchedule = async () => {
    setIsProcessing(true);
    try {
      const ids = Array.from(selectedIds);
      const postsToSchedule = posts.filter(p => ids.includes(p._id));
      
      const bulkOps = postsToSchedule.map((post, index) => {
        const dayOffset = Math.floor(index / bulkConfig.postsPerDay);
        const date = new Date(bulkConfig.startDate);
        date.setDate(date.getDate() + dayOffset);
        const [hours, minutes] = bulkConfig.startTime.split(':');
        date.setHours(parseInt(hours), parseInt(minutes), 0);
        
        return postApi.updateStatus(post._id, PostStatus.SCHEDULED, date.toISOString());
      });

      await Promise.all(bulkOps);
      toast.success(`🚀 Scheduled ${ids.length} posts!`);
      setSelectedIds(new Set());
      setShowBulkModal(false);
      fetchPosts();
    } catch (err) {
      toast.error("Bulk operation failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently discard this draft?")) return;
    try {
      await postApi.delete(id);
      setPosts(prev => prev.filter(p => p._id !== id));
      if (selectedPost?._id === id) setSelectedPost(null);
    } catch (err) {
      toast.error("Failed to delete draft.");
    }
  };

  const toggleSelect = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === posts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(posts.map(p => p._id)));
    }
  };

  // LinkedIn Preview Component
  const LinkedInPreview = ({ content, images }: { content: string, images: string[] }) => (
    <div className={`bg-white dark:bg-slate-900 border dark:border-slate-700 shadow-sm transition-all duration-500 custom-scrollbar overflow-y-auto ${activeView === 'MOBILE' ? 'max-w-[340px] max-h-[600px] mx-auto rounded-[2.5rem]' : 'w-[700px] mx-auto rounded-2xl'}`}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold dark:text-white flex items-center gap-1">
              <span className="truncate">{user?.name}</span> 
              <span className="text-[10px] text-slate-400 font-normal flex-shrink-0">• 1st</span>
            </p>
            <p className="text-[10px] text-slate-500 truncate">{user?.industry} Strategy Lead @ {user?.companyName}</p>
            <p className="text-[10px] text-slate-400">1h • 🌐</p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-slate-400 flex-shrink-0" />
      </div>
      <div className="px-4 pb-3">
        <p className="text-sm dark:text-slate-200 whitespace-pre-wrap leading-relaxed break-words">{content || "Draft content preview will appear here..."}</p>
      </div>
      {images && images.length > 0 && (
        <div className={`grid gap-0.5 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} bg-slate-100 dark:bg-slate-800`}>
          {images.map((img, i) => (
            <img key={i} src={img} className={`w-full aspect-square object-cover ${images.length === 3 && i === 0 ? 'col-span-2' : ''}`} alt="Post content" />
          ))}
        </div>
      )}
      <div className="p-2 border-t dark:border-slate-800 flex items-center justify-around">
        <button className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold py-1.5"><LikeIcon className="w-3.5 h-3.5"/> Like</button>
        <button className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold py-1.5"><CommentIcon className="w-3.5 h-3.5"/> Comment</button>
        <button className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold py-1.5"><Share2 className="w-3.5 h-3.5"/> Repost</button>
        <button className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold py-1.5"><Send className="w-3.5 h-3.5"/> Send</button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Querying Pending Packets...</p>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter  flex items-center gap-3">
            Review Queue
            <span className="text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-1 rounded-2xl text-xs font-black border border-blue-100 dark:border-blue-800">
              {posts.length} Packets
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">Refine, preview, and authorize drafted content cycles.</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <button 
              onClick={() => setShowBulkModal(true)}
              className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-500/25 flex items-center gap-2 hover:scale-[1.02] transition-all"
            >
              <ListChecks className="w-4 h-4" /> Bulk Orchestration ({selectedIds.size})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-[calc(100vh-200px)]">
        {/* Sidebar List */}
        <div className="lg:col-span-4 md:col-span-12 sm:col-span-12 flex flex-col gap-4 h-full">
          <div className="flex justify-between items-center px-4 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border dark:border-slate-800">
             <button onClick={toggleSelectAll} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2">
                {selectedIds.size === posts.length ? <CheckCircle className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                {selectedIds.size === posts.length ? 'Clear Selection' : 'Select All Queue'}
             </button>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{posts.length} Total</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide">
            {posts.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 p-12 rounded-[2.5rem] text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                <ThumbsUp className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No pending drafts</h3>
              </div>
            ) : (
              posts.map(post => {
                const id = post._id;
                const isSelected = selectedIds.has(id);
                const isActive = selectedPost?._id === id;
                
                return (
                  <div
                    key={id}
                    onClick={() => { setSelectedPost(post); setEditContent(post.content); setIsEditing(false); }}
                    className={`group relative w-full text-left p-5 rounded-[2rem] border transition-all flex items-center gap-4 cursor-pointer overflow ${
                      isActive 
                        ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-500/20' 
                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <div 
                      onClick={(e) => toggleSelect(id, e)}
                      className={`shrink-0 p-1 rounded-lg transition-all ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-50 dark:bg-slate-700 text-slate-300'}`}
                    >
                      {isSelected ? <CheckCircle className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-black truncate text-base uppercase tracking-tighter ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {post.topic || "Untitled Packet"}
                      </h4>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex -space-x-1.5">
                          {post.images && post.images.slice(0, 2).map((img, i) => (
                            <img key={i} src={img} className="w-6 h-6 rounded-md object-cover border-2 border-white dark:border-slate-800" alt="Asset" />
                          ))}
                          {post.images && post.images.length > 2 && (
                            <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[8px] font-black text-slate-500">
                              +{post.images.length - 2}
                            </div>
                          )}
                        </div>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white translate-x-0' : 'text-slate-300 -translate-x-2 group-hover:translate-x-0 group-hover:text-blue-500'}`} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Workspace Column */}
        <div className="lg:col-span-8 md:col-span-12 sm:col-span-12 h-auto">
          {selectedPost ? (
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] border dark:border-slate-700 shadow-2xl h-full flex flex-col overflow-hidden">
              <div className="p-6 border-b dark:border-slate-700 flex flex-col xl:flex-row justify-between items-center gap-6 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex items-center gap-4 min-w-0">
                   <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white  font-black text-lg shrink-0">R</div>
                   <div className="min-w-0">
                      <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg truncate">{selectedPost.topic}</h3>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">Draft Signature: {selectedPost._id}</p>
                   </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center xl:justify-end shrink-0">
                   <button onClick={() => handleDelete(selectedPost._id)} className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-100 transition-colors" title="Discard"><Trash2 className="w-4 h-4"/></button>
                   <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />
                   {isEditing ? (
                     <button onClick={handleSaveEdit} disabled={isProcessing} className="px-5 py-3 bg-green-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center gap-2 active:scale-95">
                       {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Save className="w-3.5 h-3.5"/>} Commit Edits
                     </button>
                   ) : (
                     <button onClick={() => setIsEditing(true)} className="px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center gap-2 active:scale-95 transition-all">
                       <Edit2 className="w-3.5 h-3.5"/> Edit Content
                     </button>
                   )}
                   <button 
                    onClick={() => setShowSingleScheduleModal(true)} 
                    className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95"
                   >
                     <CalendarDays className="w-3.5 h-3.5" /> Schedule
                   </button>
                   <button onClick={() => handlePostNow(selectedPost._id)} disabled={isProcessing} className="px-5 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-blue-700 transition-all active:scale-95">
                     Post Now
                   </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6 flex flex-col h-full">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500"/> Editorial Canvas</label>
                    <div className="flex-1 min-h-[300px] flex flex-col">
                      {isEditing ? (
                        <textarea 
                          value={editContent} 
                          onChange={(e) => setEditContent(e.target.value)} 
                          className="w-full flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-8 text-sm leading-relaxed text-slate-700 dark:text-slate-200 resize-none border-2 border-blue-500 outline-none transition-all shadow-inner font-medium"
                        />
                      ) : (
                        <div className="w-full flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-8 text-sm leading-relaxed text-slate-700 dark:text-slate-200 overflow-y-auto border-2 border-transparent font-medium whitespace-pre-wrap">
                          {selectedPost.content}
                        </div>
                      )}
                    </div>
                    
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-indigo-500" />
                        Visual Assets
                        {selectedPost.video
                          ? " (1 Video)"
                          : ` (${selectedPost.images?.length || 0})`}
                      </label>

                      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">

                        {/* 🎥 VIDEO (priority) */}
                        {selectedPost.video ? (
                          <div className="relative shrink-0">
                            <video
                              controls
                              className="w-64 h-40 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm bg-black"
                            >
                              <source src={selectedPost.video} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>

                            <div className="absolute inset-0 bg-blue-600/10 opacity-0 hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center pointer-events-none">
                              <Eye className="w-6 h-6 text-white" />
                            </div>
                          </div>

                        /* 🖼️ IMAGES */
                        ) : selectedPost.images?.length > 0 ? (
                          selectedPost.images.map((img: string, i: number) => (
                            <div key={i} className="relative group shrink-0">
                              <img
                                src={img}
                                className="w-24 h-24 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                                alt="Asset"
                              />
                              <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center pointer-events-none">
                                <Eye className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          ))

                        /* 🚫 EMPTY STATE */
                        ) : (
                          <div className="w-full py-10 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
                            <ImageIcon className="w-6 h-6 mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">
                              No Visual Assets
                            </p>
                          </div>
                        )}

                        {/* ➕ Add More (only when images exist, not video) */}
                        {!selectedPost.video && selectedPost.images?.length > 0 && (
                          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-300 gap-1 shrink-0">
                            <Plus className="w-5 h-5" />
                            <span className="text-[8px] font-black uppercase">Add More</span>
                          </div>
                        )}
                      </div>
                    </div>

                 </div>

                 <div className="space-y-6 flex flex-col h-full">
                    <div className="flex items-center justify-between px-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Monitor className="w-4 h-4 text-orange-500"/> Prediction Telemetry</label>
                       <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
                          <button onClick={() => setActiveView('DESKTOP')} className={`p-1.5 rounded-lg transition-all ${activeView === 'DESKTOP' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-slate-400'}`}><Monitor className="w-3.5 h-3.5"/></button>
                          <button onClick={() => setActiveView('MOBILE')} className={`p-1.5 rounded-lg transition-all ${activeView === 'MOBILE' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-slate-400'}`}><Smartphone className="w-3.5 h-3.5"/></button>
                       </div>
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] p-6 lg:p-8 flex items-center justify-center  overflow-y-auto">
                      <LinkedInPreview content={isEditing ? editContent : selectedPost.content} images={selectedPost.images || []} />
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-800 rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-700 text-center space-y-8">
               <div className="w-32 h-32 bg-slate-50 dark:bg-slate-900 rounded-[3rem] flex items-center justify-center shadow-inner">
                  <CheckSquare className="w-16 h-16 text-slate-200" />
               </div>
               <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter ">Selection Required</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto mt-4 leading-relaxed">Select a high-context draft from the left to audit, refine, and deploy to your audience.</p>
               </div>
               <button onClick={() => window.location.pathname = '/create'} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 active:scale-95 flex items-center gap-3">
                 <Sparkles className="w-4 h-4" /> Generate New Cycles
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Single Post Schedule Modal */}
      {showSingleScheduleModal && selectedPost && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-4 animate-in fade-in zoom-in-95 duration-300">
           <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[3.5rem] shadow-2xl border dark:border-slate-700 overflow-hidden">
              <div className="p-10 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                 <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                       <CalendarDays className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter ">Schedule Event</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Calibration: Single Packet</p>
                    </div>
                 </div>
                 <button onClick={() => setShowSingleScheduleModal(false)} className="p-3 bg-white dark:bg-slate-700 rounded-2xl shadow-sm border dark:border-slate-600 hover:scale-90 transition-transform"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="p-10 space-y-8 text-left">
                 <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Publication Date</label>
                       <input type="date" value={singleScheduleData.date} onChange={e => setSingleScheduleData({...singleScheduleData, date: e.target.value})} className="w-full px-7 py-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Engagement Time</label>
                       <input type="time" value={singleScheduleData.time} onChange={e => setSingleScheduleData({...singleScheduleData, time: e.target.value})} className="w-full px-7 py-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                    </div>
                 </div>
                 
                 <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-center gap-4">
                    <Sparkles className="w-8 h-8 text-indigo-600 shrink-0" />
                    <p className="text-[11px] text-indigo-900 dark:text-indigo-300 font-bold leading-relaxed">Automation engine will finalize deployment at peak engagement for your vertical.</p>
                 </div>

                 <button 
                  onClick={handleSingleSchedule}
                  disabled={isProcessing}
                  className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-500/30 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-95"
                 >
                   {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />} Authorize Deployment
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Bulk Orchestration Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/95 backdrop-blur-2xl p-4 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[4rem] shadow-2xl border dark:border-slate-700 overflow-hidden">
              <div className="p-12 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                 <div className="flex items-center gap-6 text-left">
                    <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                       <ListChecks className="text-white w-8 h-8" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter  leading-none">Bulk Sync</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Deploying {selectedIds.size} Packets in Sequence</p>
                    </div>
                 </div>
                 <button onClick={() => setShowBulkModal(false)} className="p-4 bg-white dark:bg-slate-700 rounded-2xl shadow-sm border dark:border-slate-600 hover:scale-90 transition-transform"><X className="w-6 h-6 text-slate-400" /></button>
              </div>
              <div className="p-12 space-y-10 text-left">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Rollout Start Date</label>
                       <input type="date" value={bulkConfig.startDate} onChange={e => setBulkConfig({...bulkConfig, startDate: e.target.value})} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] border-none font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Temporal Window</label>
                       <input type="time" value={bulkConfig.startTime} onChange={e => setBulkConfig({...bulkConfig, startTime: e.target.value})} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] border-none font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" />
                    </div>
                    <div className="space-y-4 md:col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Deployment Velocity (Cycles Per Day)</label>
                       <div className="flex items-center gap-3">
                          {[1, 2, 3, 4].map(v => (
                            <button key={v} onClick={() => setBulkConfig({...bulkConfig, postsPerDay: v})} className={`flex-1 py-5 rounded-2xl text-xs font-black transition-all border-2 ${bulkConfig.postsPerDay === v ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-900 border-transparent text-slate-400 hover:border-slate-200'}`}>
                              {v} Cycle{v > 1 ? 's' : ''}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>
                 
                 <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-800 flex items-center gap-6">
                    <Sparkles className="w-12 h-12 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-sm text-blue-900 dark:text-blue-300 font-black uppercase tracking-tighter ">Engine Ready</p>
                      <p className="text-[11px] text-blue-700/70 dark:text-blue-400/70 font-medium leading-relaxed">The system will automatically space out your {selectedIds.size} posts based on the defined velocity starting from {bulkConfig.startDate}.</p>
                    </div>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                      onClick={handleBulkSchedule}
                      disabled={isProcessing}
                      className="w-full py-7 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-indigo-500/30 flex items-center justify-center gap-4 hover:scale-[1.01] transition-all active:scale-[0.99]"
                    >
                       {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <PlayCircle className="w-6 h-6" />}
                       Synchronize Entire Selection
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PostApprovals;
