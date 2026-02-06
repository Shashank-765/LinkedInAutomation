import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Calendar, Wand2, RefreshCw, Sparkles, 
  Image as ImageIcon, Upload, ListChecks, 
  Loader2, Settings2, PlayCircle, Target, 
  Trash2, CheckCircle, Square, FileText, ChevronRight, 
  LayoutGrid, Type, Monitor, Smartphone, MoreHorizontal, 
  ThumbsUp, MessageSquare, Share2, Send, Plus, X, ArrowRight
} from 'lucide-react';
import { aiService } from '../services/geminiService';
import { postApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PostStatus } from '../../';
import { toast } from 'react-toastify';

const POST_TYPES = ['Educational', 'Sales', 'Thought Leadership', 'Personal Story'];

const PostCreator: React.FC = () => {
  const { user, updateUserUsage } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [industry, setIndustry] = useState(user?.industry || '');
  const [selectedPostType, setSelectedPostType] = useState(
    user?.postTypePreference || 'Educational'
  );
  const [activeView, setActiveView] = useState<'DESKTOP' | 'MOBILE'>('DESKTOP');

  const [topic, setTopic] = useState('');
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);

  const [currentContent, setCurrentContent] = useState('');
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageCount, setImageCount] = useState(1);
  const [isDrafting, setIsDrafting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (industry) fetchTopicSuggestions();
    }, 1000);
    return () => clearTimeout(timer);
  }, [industry, selectedPostType]);

  const fetchTopicSuggestions = async () => {
    setIsLoadingTopics(true);
    try {
      const suggestions = await aiService.suggestTopics(
        industry,
        user?.companyName || 'Brand',
        selectedPostType
      );
      setSuggestedTopics(suggestions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingTopics(false);
    }
  };

  // //update user usage when generating content or images
  // useEffect(() => {
  //   if (isGenerating) {
  //     updateUserUsage('ai');
  //   }
  // }, [isGenerating]);

  /* ================= CONTENT ONLY ================= */

  const handleGenerate = async (targetTopic: string = topic) => {
    if (user?.usage.aiGenerationsThisMonth >= user?.planId.limits.maxAiGenerationsPerMonth) {
      toast.error("AI generation limit reached for your plan.");
      return;
    }
    const currentTopic = targetTopic || topic;
    if (!currentTopic || !user) return;

    setIsGenerating(true);
    try {
      const content = await aiService.generateLinkedInPost(
        currentTopic,
        'professional',
        { ...user, industry, postTypePreference: selectedPostType }
      );

      setCurrentContent(content);
      updateUserUsage('ai');
    } catch (error) {
      toast.error("Generation failed. Check your API key or usage limits.");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ================= IMAGE GENERATION (MANUAL) ================= */

  const handleGenerateImages = async () => {
    if (!topic) {
      toast.error('Please select a topic first');
      return;
    }

    setIsGenerating(true);
    try {
      if (user?.usage.aiImagesThisMonth >= user?.plan.maxAiGenerationsPerMonth) {
        toast.error("AI image generation limit reached for your plan.");
        return;
      }
      const images = await aiService.generateImagesForPost(
        topic,
        industry || 'Business',
        imageCount
      );
      setCurrentImages(prev => [...prev, ...images]);
      updateUserUsage('image');
    } catch (error) {
      toast.error('Image generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  /* ================= MANUAL UPLOAD ================= */

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  /* ================= SAVE DRAFT ================= */

  const handleDraftPost = async () => {
    if (!currentContent) return;

    setIsDrafting(true);
    try {
      await postApi.save({
        topic: topic || "Generated Draft",
        content: currentContent,
        images: currentImages,
        imageSource: currentImages.length > 0 ? 'AI' : 'NONE',
        status: PostStatus.PENDING
      });

      toast.success("✅ Saved to Review Queue!");
      setCurrentContent('');
      setCurrentImages([]);
      setTopic('');
    } catch (err) {
      toast.error("Failed to draft post.");
    } finally {
      setIsDrafting(false);
    }
  };

  /* ================= PREVIEW ================= */

// LinkedIn Preview Component
  const LinkedInPreview = ({ content, images }: { content: string, images: string[] }) => (
    <div className={`bg-white dark:bg-slate-900 border dark:border-slate-700 shadow-sm transition-all duration-500 overflow-hidden ${activeView === 'MOBILE' ? 'max-w-[375px] mx-auto rounded-[2rem]' : 'w-full rounded-xl'}`}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" />
          </div>
          <div>
            <p className="text-sm font-bold dark:text-white flex items-center gap-1">{user?.name} <span className="text-[10px] text-slate-400 font-normal">• 1st</span></p>
            <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{user?.industry} Strategy Lead @ {user?.companyName}</p>
            <p className="text-[10px] text-slate-400">1h • 🌐</p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-slate-400" />
      </div>
      <div className="px-4 pb-3">
        <p className="text-sm dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{content || "Start typing or generate content..."}</p>
      </div>
      {images.length > 0 && (
        <div className={`grid gap-0.5 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} bg-slate-100 dark:bg-slate-800`}>
          {images.map((img, i) => (
            <img key={i} src={img} className={`w-full aspect-square object-cover ${images.length === 3 && i === 0 ? 'col-span-2' : ''}`} alt="Post content" />
          ))}
        </div>
      )}
      <div className="p-3 border-t dark:border-slate-800 flex items-center justify-around">
        <button className="flex items-center gap-2 text-slate-500 text-xs font-semibold"><ThumbsUp className="w-4 h-4"/> Like</button>
        <button className="flex items-center gap-2 text-slate-500 text-xs font-semibold"><MessageSquare className="w-4 h-4"/> Comment</button>
        <button className="flex items-center gap-2 text-slate-500 text-xs font-semibold"><Share2 className="w-4 h-4"/> Repost</button>
        <button className="flex items-center gap-2 text-slate-500 text-xs font-semibold"><Send className="w-4 h-4"/> Send</button>
      </div>
    </div>
  );
  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Settings Column */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border dark:border-slate-700 shadow-sm">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter  mb-8">Creation Studio</h1>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Vertical Market</label>
                <input value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Fintech" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Post Objective</label>
                <select value={selectedPostType} onChange={(e) => setSelectedPostType(e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-sm font-bold dark:text-white outline-none">
                  {POST_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              {/* <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">AI Image Multiplier</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(num => (
                    <button key={num} onClick={() => setImageCount(num)} className={`py-3 rounded-xl text-xs font-black transition-all ${imageCount === num ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>{num}x</button>
                  ))}
                </div>
              </div> */}

              <div className="pt-4 space-y-3">
                 <input 
                  value={topic} 
                  onChange={e => setTopic(e.target.value)} 
                  onKeyPress={e => e.key === 'Enter' && handleGenerate()}
                  placeholder="Subject or context..." 
                  className="w-full px-6 py-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-sm font-bold text-blue-900 dark:text-blue-100 border-2 border-transparent focus:border-blue-500 outline-none"
                />
                <button 
                  onClick={() => handleGenerate()} 
                  disabled={isGenerating || !topic}
                  className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin"/> : <Sparkles className="w-5 h-5"/>}
                  Generate Packet
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border dark:border-slate-700 shadow-sm">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Target className="w-4 h-4" /> Growth Vectors</h2>
            {isLoadingTopics ? (
               <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-50 dark:bg-slate-900/50 rounded-2xl animate-pulse" />)}</div>
            ) : (
              <div className="space-y-3">
                {suggestedTopics.map((t, idx) => (
                  <button key={idx} onClick={() => { setTopic(t); handleGenerate(t); }} className="w-full text-left p-4 rounded-2xl text-[11px] font-bold bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-600 hover:text-white transition-all group flex items-center justify-between">
                    <span className="truncate pr-2">{t}</span>
                    <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Canvas Column */}
        <div className="xl:col-span-9 space-y-8">
           <div className="bg-white dark:bg-slate-800 rounded-[3.5rem] border dark:border-slate-700 shadow-xl overflow-hidden min-h-[700px] flex flex-col relative">
              {isGenerating ? (
                <div className="absolute inset-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center space-y-8">
                   <div className="relative">
                      <Loader2 className="w-24 h-24 text-blue-600 animate-spin" />
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-blue-400 animate-pulse" />
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter ">Engine Cycling...</h3>
                </div>
              ) : currentContent ? (
                <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div className="flex justify-between items-center px-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FileText className="w-4 h-4"/> Editorial Canvas</label>
                        <button onClick={handleDraftPost} disabled={isDrafting} className="text-blue-600 font-black uppercase text-[10px] flex items-center gap-2 hover:underline">
                          {isDrafting ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />} Send to Queue
                        </button>
                      </div>
                      <textarea 
                        value={currentContent} 
                        onChange={(e) => setCurrentContent(e.target.value)} 
                        className="w-full h-[400px] bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-10 text-base leading-relaxed text-slate-700 dark:text-slate-200 resize-none border-2 border-transparent focus:border-blue-500 outline-none transition-all"
                      />
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Assets ({currentImages.length})</label>
                        <button
          onClick={handleGenerateImages}
          disabled={isGenerating}
          className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline flex items-center gap-1"
        >
          <Wand2 className="w-3 h-3" />
          Generate Images
        </button>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                           {currentImages.map((img, i) => (
                             <div key={i} className="relative group shrink-0">
                                <img src={img} className="w-24 h-24 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-md" alt="Asset" />
                                <button onClick={() => setCurrentImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"><X className="w-3 h-3"/></button>
                             </div>
                           ))}
                           <button onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all gap-1"><Plus className="w-5 h-5"/><span className="text-[9px] font-black uppercase">Add</span></button>
                        </div>
                      </div>
                      <button onClick={handleDraftPost} className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">Save as Draft to Review Queue</button>
                   </div>

                   <div className="space-y-6">
                      <div className="flex items-center justify-between px-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Monitor className="w-4 h-4"/> Live Telemetry</label>
                         <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
                            <button onClick={() => setActiveView('DESKTOP')} className={`p-2 rounded-lg transition-all ${activeView === 'DESKTOP' ? 'bg-white dark:bg-slate-800 shadow-md text-blue-600' : 'text-slate-400'}`}><Monitor className="w-4 h-4"/></button>
                            <button onClick={() => setActiveView('MOBILE')} className={`p-2 rounded-lg transition-all ${activeView === 'MOBILE' ? 'bg-white dark:bg-slate-800 shadow-md text-blue-600' : 'text-slate-400'}`}><Smartphone className="w-4 h-4"/></button>
                         </div>
                      </div>
                      <LinkedInPreview content={currentContent} images={currentImages} />
                   </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-8">
                   <div className="w-32 h-32 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] flex items-center justify-center"><LayoutGrid className="w-16 h-16 text-slate-200" /></div>
                   <div>
                      <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter ">Studio Engine Idle</h3>
                      <p className="text-slate-500 font-medium max-w-sm mx-auto mt-4">Enter a topic on the left to generate content, or upload your own assets to begin drafting.</p>
                   </div>
                   <button onClick={() => fileInputRef.current?.click()} className="px-12 py-5 bg-white dark:bg-slate-700 border-2 border-blue-600 text-blue-600 dark:text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95">Manual Import Cycle</button>
                </div>
              )}
           </div>
        </div>
      </div>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
    </div>
  );
  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

        {/* ===== EVERYTHING BELOW IS YOUR ORIGINAL JSX ===== */}
        {/* ONLY ADDITION: Generate Images button */}

        {/* Inside Assets section */}
        {/* PLACE JUST BELOW Assets label */}

        {/* 
        <button
          onClick={handleGenerateImages}
          disabled={isGenerating}
          className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline flex items-center gap-1"
        >
          <Wand2 className="w-3 h-3" />
          Generate Images
        </button>
        */}

      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default PostCreator;
