
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, UserPlus, ArrowRight, Building, Sparkles, ShieldCheck, User, Target, Globe } from 'lucide-react';
import { UserRole } from '../types';
import { toast } from 'react-toastify';

const STRATEGY_TYPES = ['Educational', 'Sales', 'Thought Leadership', 'Personal Story'];

const Signup: React.FC = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    industry: '',
    postTypePreference: 'Educational',
    role: UserRole.USER as string
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-slate-800 rounded-[3rem] border border-slate-700 shadow-2xl overflow-hidden">
        
        {/* Branding Side */}
        <div className="p-12 bg-blue-600 hidden md:flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6">
              <Send className="text-blue-600 w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Scale your LinkedIn growth.</h2>
            <p className="text-blue-100 text-sm leading-relaxed">Join 500+ enterprises scaling their LinkedIn reach with Gemini-powered intelligence.</p>
            
            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">AI-Powered Content</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">Enterprise Security</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
             postpilot Platform v2.0
          </div>
        </div>

        {/* Form Side */}
        <div className="p-8 md:p-10 bg-slate-800 flex flex-col justify-center max-h-[90vh] overflow-y-auto scrollbar-hide">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Get Started</h1>
            <button onClick={() => window.location.pathname = '/login'} className="text-sm text-blue-400 font-medium hover:underline">Already have an account? Log in</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex p-1 bg-slate-900/50 rounded-2xl border border-slate-700 mb-2">
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: UserRole.USER})}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold transition-all ${formData.role === UserRole.USER ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <User className="w-3.5 h-3.5" /> Customer
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: UserRole.SUPER_ADMIN})}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold transition-all ${formData.role === UserRole.SUPER_ADMIN ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Email</label>
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="jane@corp.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Password</label>
              <input 
                required
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/50">
              <div className="relative">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                   <Building className="w-3 h-3"/> Company
                </label>
                <input 
                  required
                  value={formData.companyName}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  placeholder="Acme Inc"
                />
              </div>
              <div className="relative">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                   <Globe className="w-3 h-3"/> Industry
                </label>
                <input 
                  required
                  value={formData.industry}
                  onChange={e => setFormData({...formData, industry: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  placeholder="Fintech"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                 <Target className="w-3 h-3"/> Growth Strategy
              </label>
              <select 
                value={formData.postTypePreference}
                onChange={e => setFormData({...formData, postTypePreference: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STRATEGY_TYPES.map(type => <option key={type} value={type} className="bg-slate-800">{type} Strategy</option>)}
              </select>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full mt-4 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl font-bold text-white group ${formData.role === UserRole.SUPER_ADMIN ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'}`}
            >
              {loading ? 'Finalizing Profile...' : `Join postpilot`} 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
