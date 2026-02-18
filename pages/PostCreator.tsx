// (imports unchanged)
import React, { useState, useEffect, useRef } from 'react';
import {
  Zap, Calendar, Wand2, RefreshCw, Sparkles,
  Image as ImageIcon, Upload, ListChecks,
  Loader2, Settings2, PlayCircle, Target,
  Trash2, CheckCircle, Square, FileText, ChevronRight,
  LayoutGrid, Type, Monitor, Smartphone, MoreHorizontal,
  ThumbsUp, MessageSquare, Share2, Send, Plus, X, ArrowRight,
  TrendingUp, Globe, Newspaper, CalendarDays, Rocket,
  Search, Filter, Hash, ExternalLink
} from 'lucide-react';

import { aiService } from '../services/geminiService';
import { postApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PostStatus } from '../types';
import { toast } from 'react-toastify';
import '../global.css';

const POST_TYPES = ['Educational', 'Sales', 'Thought Leadership', 'Personal Story'];


const PostCreator: React.FC = () => {
  const { user, updateUserUsage } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===== STATE (UNCHANGED) =====
  const [industry, setIndustry] = useState(user?.industry || 'Technology');
   const [selectedPostType, setSelectedPostType] = useState(
      user?.postTypePreference || 'Educational'
    );
  const [searchQuery, setSearchQuery] = useState(user?.industry || 'Technology');
  const [topic, setTopic] = useState('');
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  
  const [trendingNews, setTrendingNews] = useState<any[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [currentContent, setCurrentContent] = useState('');
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string>('');
  const [selectedVideoFile,setSelectedVideoFile] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [activeView, setActiveView] = useState<'DESKTOP' | 'MOBILE'>('MOBILE');
  const [activeTab, setActiveTab] = useState<'CANVAS' | 'PREVIEW'>('CANVAS'); 
  const [suggestedTab, setSuggestedTab] = useState<'AI' | 'NEWS'>('NEWS');
  const [imageCount, setImageCount] = useState(1);
  // console.log('user?.industry', user?.industry)
  // ===== EFFECTS (UNCHANGED) =====
  // console.log('currentVideo', currentVideo)
  useEffect(() => {
    fetchTrendingNews(searchQuery);
  }, []);
  useEffect(() => { 
    if (user?.industry) {
      setSearchQuery(user?.industry);
      setIndustry(user?.industry);
    }
  }, [user?.industry]);
  useEffect(() => {
    if (currentContent) setActiveTab('CANVAS');
  }, [currentContent]);

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

    
  // ===== LOGIC (UNCHANGED) =====
  const fetchTrendingNews = async (query: string) => {
    setIsLoadingNews(true);
    try {
      const res = await postApi.getTrendingTopics(query);
      setTrendingNews(res.data.topics || []);
    } catch {
      toast.error('Failed to fetch news signals');
    } finally {
      setIsLoadingNews(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) fetchTrendingNews(searchQuery);
  };

  const handleGenerateFromNews = async (newsItem: any) => {
    setTopic(newsItem.topic);
    setCurrentImages(newsItem.image ? [newsItem.image] : []);
    setIsGenerating(true);
    try {
      const content = await aiService.generateLinkedInPost(newsItem.topic, 'professional', user);
      setCurrentContent(content);
      updateUserUsage('ai');
      toast.success('Content generated from news!');
    } catch {
      toast.error('Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (user?.usage.aiGenerationsThisMonth >= user?.planId.limits.maxAiGenerationsPerMonth) {
        toast.error("AI image generation limit reached for your plan.");
        return;
      }
    // if (!topic) return toast.info('Please enter a topic.');
    setIsGenerating(true);
    try {
      const content = await aiService.generateLinkedInPost(topic, 'professional', user);
      setCurrentContent(content);
      updateUserUsage('ai');
    } catch {
      toast.error('Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };
  const handleGenerateImages = async () => {
    if (!topic) {
      toast.error('Please select a topic first');
      return;
    }

    setIsGenerating(true);
    try {
      if (user?.usage.aiImagesThisMonth >= user?.planId.limits.maxAiImagesPerMonth) {
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
      console.error(error);
      toast.error('Image generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

 

 const handleSaveToQueue = async () => {
  if (!currentContent) return;

  setIsDrafting(true);
  try {
    const formData = new FormData();
    formData.append("topic", topic || "Generated Draft");
    formData.append("content", currentContent);
    formData.append("urn", user.activeUrn);
    formData.append("imageSource", currentImages.length ? "AI" : "NONE");
    formData.append("status", PostStatus.PENDING);

    currentImages.forEach((img) =>
      formData.append("images[]", img)
    );

    // console.log('selectedVideoFile', selectedVideoFile)
    if (selectedVideoFile) {
      formData.append("video", selectedVideoFile); // REAL FILE
    }

    await postApi.save(formData);

    toast.success("Added to Review Queue");
    setCurrentContent("");
    setCurrentImages([]);
    setCurrentVideo("");
    setTopic("");
  } finally {
    setIsDrafting(false);
  }
};


  // ===== PREVIEW COMPONENT (UNCHANGED) =====
   const LinkedInPreview = ({ content, images }: { content: string, images: string[] }) => (
    <div className={`bg-white dark:bg-slate-900 border dark:border-slate-700 shadow-2xl transition-all duration-500 custom-scrollbar overflow-y-auto ${activeView === 'MOBILE' ? 'max-w-[340px] max-h-[600px] mx-auto rounded-[3rem] border-8 border-slate-200 dark:border-slate-800' : 'w-[700px] mx-auto rounded-2xl'}`}>
      <div className="p-4 flex items-center justify-between border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border dark:border-slate-700">
             <img src={user?.linkedInProfile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" />
          </div>
          <div className="text-left">
            <p className="text-xs font-black dark:text-white flex items-center gap-1 uppercase tracking-tighter">
              {user?.name} <span className="text-[9px] text-slate-400 font-normal tracking-normal">• 1st</span>
            </p>
            <p className="text-[10px] text-slate-500 truncate max-w-[150px] font-medium">{user?.industry} Lead @ {user?.companyName}</p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-slate-400" />
      </div>
      <div className="p-4 bg-white dark:bg-slate-900">
        <p className="text-sm dark:text-slate-200 whitespace-pre-wrap leading-relaxed text-left font-medium">{content || "Waiting for your Post to preview..."}</p>
      </div>
      {images.length > 0 && (
        <div className="bg-slate-100 dark:bg-slate-800">
           <img src={images[0]} className="w-full aspect-video object-cover" alt="Post visual" />
        </div>
      )}
      {
        currentVideo && (
        <div className="bg-slate-100 dark:bg-slate-800 p-4 flex justify-center">
            <video controls className="w-full max-h-[400px] rounded-2xl bg-black">
              <source src={currentVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
        </div>
        )
      }
      <div className="p-3 border-t dark:border-slate-800 flex items-center justify-around bg-slate-50/30 dark:bg-slate-900/30">
        <button className="flex items-center gap-1 text-slate-500 text-[10px] font-black uppercase"><ThumbsUp className="w-3 h-3"/> Like</button>
        <button className="flex items-center gap-1 text-slate-500 text-[10px] font-black uppercase"><MessageSquare className="w-3 h-3"/> Comment</button>
        <button className="flex items-center gap-1 text-slate-500 text-[10px] font-black uppercase"><Share2 className="w-3 h-3"/> Repost</button>
        <button className="flex items-center gap-1 text-slate-500 text-[10px] font-black uppercase"><Send className="w-3 h-3"/> Send</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1700px] mx-auto pb-12 px-2">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

        {/* ===== COLUMN 1: INSPIRATION (UNCHANGED) ===== */}
          <div className="xl:col-span-4 space-y-6">
            {/* ✅ TABS MOVED HERE */}
           <div className="flex justify-center">
            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border">
            <button
                onClick={() => setSuggestedTab('NEWS')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase
                  ${suggestedTab === 'NEWS'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 shadow'
                    : 'text-slate-400'
                  }`}
              >
                Trening Topics
              </button>
              <button
                onClick={() => setSuggestedTab('AI')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase
                  ${suggestedTab === 'AI'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 shadow'
                    : 'text-slate-400'
                  }`}
              >
                AI Suggestions
              </button>
              
            </div>
          </div>
          {suggestedTab === 'NEWS' && (
            <>
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border dark:border-slate-700 shadow-sm flex flex-col h-[98vh] overflow-hidden">
            <div className="p-6 border-b dark:border-slate-700 text-left bg-slate-50/50 dark:bg-slate-900/50">
               <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                 <Newspaper className="w-6 h-6 text-blue-600" /> Trending Topics
               </h2>
               
               <form onSubmit={handleSearch} className="mt-4 relative group">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics, news, trends..."
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-2xl text-xs font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <button type="submit" className="hidden" />
               </form>

               <div className="flex gap-2 mt-4 overflow-x-auto custom-scrollbar pb-1">
                  {['AI', 'SaaS', 'Fintech', 'Game', 'Blockchain', 'Web3', 'Crypto', 'VR', 'AR', 'Metaverse', 'India', 'Tech'].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => { setSearchQuery(tag); fetchTrendingNews(tag); }}
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${searchQuery === tag ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-900 text-slate-400 hover:text-blue-500 border dark:border-slate-700'}`}
                    >
                      {tag}
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30 dark:bg-slate-900/20">
               {isLoadingNews ? (
                 [1,2,3,4].map(i => (
                   <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-3xl border dark:border-slate-700 space-y-4 animate-pulse">
                      <div className="h-32 bg-slate-100 dark:bg-slate-900 rounded-2xl" />
                      <div className="space-y-2">
                        <div className="h-3 w-1/4 bg-slate-100 dark:bg-slate-900 rounded" />
                        <div className="h-4 w-full bg-slate-100 dark:bg-slate-900 rounded" />
                        <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-900 rounded" />
                      </div>
                   </div>
                 ))
               ) : trendingNews.length > 0 ? (
                 trendingNews.map((news, idx) => (
                   <div 
                    key={idx} 
                    className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 text-left"
                   >
                      {news.image && (
                        <div className="relative overflow-hidden aspect-video">
                          <img src={news.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="News" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                      <div className="p-5 space-y-3">
                         <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                              <Globe className="w-3 h-3" /> {news.source}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(news.publishedAt).toLocaleDateString()}</span>
                         </div>
                         <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{news.topic}</h4>
                         <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 font-medium leading-relaxed">
                            {news.description || "Synthesize this real-time signal into a high-impact professional narrative."}
                         </p>
                         <div className="pt-2 flex items-center gap-2">
                            <button 
                              onClick={() => handleGenerateFromNews(news)}
                              className="flex-1 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            >
                               <Rocket className="w-3.5 h-3.5" /> Generate Post
                            </button>
                            <a 
                              href={news.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-400 rounded-2xl hover:text-blue-500 border dark:border-slate-700 transition-all"
                            >
                               <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                         </div>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="py-24 text-center space-y-5 px-6">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                      <Search className="w-10 h-10 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">No signals found</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2 leading-loose">Try adjusting your keywords or checking another industry sector.</p>
                    </div>
                    <button 
                      onClick={() => {setSearchQuery('Technology'); fetchTrendingNews('Technology');}}
                      className="px-6 py-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:border-blue-600/50 transition-all"
                    >
                      Reset to Industry
                    </button>
                 </div>
               )}
            </div>
          </div>
            </>

          )}
          {suggestedTab === 'AI' && (
            <>
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
            
                          <div className="space-y-3">
                           <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Target className="w-4 h-4" /> Suggestions</h2>
                        {isLoadingTopics ? (
                           <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-50 dark:bg-slate-900/50 rounded-2xl animate-pulse" />)}</div>
                        ) : (
                          <div className="space-y-3">
                            {suggestedTopics.map((t, idx) => (
                              <button key={idx} onClick={() => { setTopic(t); handleGenerate(); }} className="w-full text-left p-4 rounded-2xl text-[12px] font-bold bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-600 hover:text-white transition-all group flex items-center justify-between">
                                <span className=" pr-2">{t}</span>
                                <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                              </button>
                            ))}
                          </div>
                        )}
                          </div>
            
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
                              Generate POst
                            </button>
                          </div>
                        </div>
                      </div>
            
                      
            </>
          )}
        </div>

        {/* ===== COLUMN 2+3: TABBED AREA (FIXED) ===== */}
        <div className="xl:col-span-8 space-y-6">

          {/* ✅ TABS MOVED HERE */}
          <div className="flex justify-center">
            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border">
              <button
                onClick={() => setActiveTab('CANVAS')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase
                  ${activeTab === 'CANVAS'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 shadow'
                    : 'text-slate-400'
                  }`}
              >
                EDIT POST
              </button>
              <button
                onClick={() => setActiveTab('PREVIEW')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase
                  ${activeTab === 'PREVIEW'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 shadow'
                    : 'text-slate-400'
                  }`}
              >
                Live Preview
              </button>
            </div>
          </div>

          {/* ===== CANVAS ===== */}
          {activeTab === 'CANVAS' && (
            /* your FULL Creative Canvas JSX — unchanged */
            <>

             <div className="xl:col-span-9 space-y-6 animate-in fade-in duration-300">

               <div className="bg-white dark:bg-slate-800 rounded-[3.5rem] border dark:border-slate-700 shadow-2xl overflow-hidden min-h-[85vh] flex flex-col relative">
              {isGenerating ? (
                <div className="absolute inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center space-y-10">
                   <div className="relative">
                      <div className="w-32 h-32 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-yellow-500 animate-pulse" />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Generating Post...</h3>
                      <p className="text-slate-500 font-bold uppercase text-xs tracking-widest animate-pulse">Analyzing context • Aligning Persona • Generating Post</p>
                   </div>
                </div>
              ) : currentContent ? (
                <div className="p-10 space-y-10 text-left flex flex-col h-[85vh]">
                   <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border dark:border-slate-800">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                           <FileText className="w-6 h-6" />
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Creative Canvas</h3>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Draft ID: {Math.random().toString(36).substring(7)}</p>
                        </div>
                     </div>
                     <button onClick={() => {setCurrentContent(''); setTopic(''); setCurrentImages([]);}} className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl transition-all hover:bg-red-600 hover:text-white shadow-sm">
                        <Trash2 className="w-5 h-5" />
                     </button>
                   </div>
                   
                   <textarea 
                    value={currentContent} 
                    onChange={(e) => setCurrentContent(e.target.value)} 
                    className="w-full flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-10 text-base leading-relaxed text-slate-700 dark:text-slate-200 resize-none border-2 border-transparent focus:border-blue-500 outline-none transition-all shadow-inner font-medium custom-scrollbar"
                    placeholder="Content flows here..."
                   />


                   <div className="flex flex-col sm:flex-row gap-6 pt-4">
                      <button
                                onClick={handleGenerateImages}
                                disabled={isGenerating}
                                className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <Wand2 className="w-3 h-3" />
                                Generate Images
                              </button>
                                              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                                {currentVideo && (
                                                        <div className="relative group shrink-0">
                                                          <video
                                                            src={currentVideo}
                                                            controls
                                                            className="w-48 h-28 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-md bg-black"
                                                          />
                                                          <button
                                                            onClick={() => setCurrentVideo('')}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                                          >
                                                            <X className="w-3 h-3" />
                                                          </button>
                                                        </div>
                                                      )}

                                                 {currentImages.map((img, i) => (
                                                   <div key={i} className="relative group shrink-0">
                                                      <img src={img} className="w-24 h-24 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-md" alt="Asset" />
                                                      <button onClick={() => setCurrentImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"><X className="w-3 h-3"/></button>
                                                   </div>
                                                 ))}
                                                    <button
                                                      disabled={!!currentVideo}
                                                      onClick={() => fileInputRef.current?.click()}
                                                      className={`w-24 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all
                                                        ${currentVideo
                                                          ? 'opacity-40 cursor-not-allowed border-slate-300'
                                                          : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-500 hover:border-blue-500'}
                                                      `}
                                                    ></button>
                                              </div>
                                            </div>
                      <button onClick={handleSaveToQueue} disabled={isDrafting} className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                         {isDrafting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                         Finalize & Add to Review Queue
                      </button>
                      
                   </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-12">
                   <div className="relative">
                      <div className="w-32 h-32 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] flex items-center justify-center shadow-inner relative z-10">
                        <Sparkles className="w-16 h-16 text-blue-600 animate-pulse" />
                      </div>
                      <div className="absolute inset-0 bg-blue-600/10 blur-[60px] rounded-full animate-pulse" />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Start To generate POst</h3>
                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] max-w-sm mx-auto leading-loose">Enter a topic or select from global news signals to begin the AI generation process.</p>
                   </div>
                   <div className="w-full max-w-xl space-y-4 bg-slate-50 dark:bg-slate-900/40 p-8 rounded-[3rem] border dark:border-slate-800">
                     <div className="relative">
                        <input 
                          value={topic} 
                          onChange={e => setTopic(e.target.value)} 
                          placeholder="Topic: Future of AI Agents in Enterprise" 
                          className="w-full pl-8 pr-16 py-6 bg-white dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm border dark:border-slate-700" 
                        />
                        <button 
                          onClick={handleGenerate} 
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-90"
                        >
                           <ArrowRight className="w-5 h-5" />
                        </button>
                     </div>
                     <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {['Thought Leadership', 'Case Study', 'News Break', 'Educational'].map(tag => (
                          <button key={tag} onClick={() => setTopic(tag + ": " + topic)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase text-slate-500 rounded-lg hover:text-blue-600 transition-colors">#{tag}</button>
                        ))}
                     </div>
                     {!currentContent ? (
                      <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full group-hover:bg-blue-600/20 transition-all" />
                    <div className="relative z-10 space-y-4 text-left">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                          <Zap className="w-5 h-5" />
                      </div>
                      <h4 className="text-xl font-black uppercase tracking-tighter">AutoPost Handle</h4>
                      <button onClick={() => window.location.pathname = '/autopilot'} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                          Manage Autopost <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                </div>
                ):(
                  <>
                  </>
                )}

                   </div>
                </div>
              )}
              </div>
             </div>
            </>
          )}

          {/* ===== PREVIEW ===== */}
          {activeTab === 'PREVIEW' && (
            <>
              <div className="xl:col-span-9 space-y-6 animate-in fade-in slide-in-from-right-5 duration-300">

                <div className="flex items-center justify-between px-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><Monitor className="w-4 h-4 text-orange-500" /> Live Telemetry</label>
                    <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border dark:border-slate-800">
                      <button onClick={() => setActiveView('DESKTOP')} className={`p-2.5 rounded-xl transition-all ${activeView === 'DESKTOP' ? 'bg-white dark:bg-slate-800 shadow-md text-blue-600' : 'text-slate-400'}`}><Monitor className="w-4 h-4" /></button>
                      <button onClick={() => setActiveView('MOBILE')} className={`p-2.5 rounded-xl transition-all ${activeView === 'MOBILE' ? 'bg-white dark:bg-slate-800 shadow-md text-blue-600' : 'text-slate-400'}`}><Smartphone className="w-4 h-4" /></button>
                    </div>
                </div>
                
                <div className="animate-in slide-in-from-right-10 duration-500">
                    <LinkedInPreview content={currentContent} images={currentImages} />
                </div>
                
                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full group-hover:bg-blue-600/20 transition-all" />
                    <div className="relative z-10 space-y-4 text-left">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                          <Zap className="w-5 h-5" />
                      </div>
                      <h4 className="text-xl font-black uppercase tracking-tighter">AutoPilot Insight</h4>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-widest">When inactive, our engine sources global news signals from your industry to maintain authority.</p>
                      <button onClick={() => window.location.pathname = '/autopilot'} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                          Manage Protocol <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                </div>
              </div>
       
            </>
          )}
        </div>
      </div>

      {/* file input unchanged */}
      <input
  type="file"
  ref={fileInputRef}
  className="hidden"
  multiple
  accept="image/*,video/mp4"
  onChange={(e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const file: any = files[0];

    // 🎥 VIDEO
    if (file?.type.startsWith('video')) {
      const videoURL = URL.createObjectURL(file);
      setCurrentImages([]);      // clear images
      setSelectedVideoFile(file);

      setCurrentVideo(videoURL); // set video
      return;
    }

    // 🖼️ IMAGES (existing behavior)
    setCurrentVideo(''); // clear video
    files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setCurrentImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }}
/>

    </div>
  );
};

export default PostCreator;
