
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  LayoutDashboard, Send, Users, CreditCard, Settings, LogOut, Moon, Sun, Menu, X, PlusCircle, 
  BarChart3, CheckSquare, Linkedin, ShieldCheck, Zap, Activity, ArrowUpCircle, Rocket, Megaphone
} from 'lucide-react';

import logo from '/assets/darklogo.png'

// import '../assets'
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = window.location.pathname || '/';
// console.log('isDarkMode', isDarkMode)
useEffect(() => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const isDark = savedTheme === 'dark';

  setIsDarkMode(isDark);
  document.documentElement.classList.toggle('dark', isDark);
}, []);


const toggleTheme = () => {
  setIsDarkMode(prev => {
    const next = !prev;
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
    return next;
  });
};




  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, role: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN], path: '/dashboard' },
    { label: 'Create Post', icon: PlusCircle, role: [UserRole.SUPER_ADMIN,UserRole.ADMIN, UserRole.USER], path: '/create' },
    { label: 'Review Pending Post', icon: CheckSquare, role: [UserRole.SUPER_ADMIN,UserRole.ADMIN, UserRole.USER], path: '/user/review' },
    { label: 'Post Management', icon: Send, role: [UserRole.SUPER_ADMIN,UserRole.ADMIN, UserRole.USER], path: '/schedule' },
    { label: 'autopost syncing', icon: Rocket, role: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN], path: '/autopilot' },
    { label: 'User Management', icon: Users, role: [UserRole.ADMIN, UserRole.SUPER_ADMIN], path: '/admin/users' },
    { label: 'Ad Management', icon: Megaphone, role: [UserRole.ADMIN, UserRole.SUPER_ADMIN], path: '/admin/ads' }, // Added
    { label: 'Plans & Billing', icon: CreditCard, role: [UserRole.SUPER_ADMIN,UserRole.ADMIN, UserRole.USER], path: '/admin/plans' },
    { label: 'Analytics', icon: BarChart3, role: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN], path: '/analytics' },
    { label: 'Settings', icon: Settings, role: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN], path: '/settings' },
  ];

  const navigate = (path: string) => {
    window.location.pathname = path;
    setIsMobileMenuOpen(false);
  };

  const planName = user?.planId?.name || 'Starter';
  const aiUsage = user?.usage?.aiGenerationsThisMonth || 0;
  const aiLimit = user?.planId?.limits?.maxAiGenerationsPerMonth || 10;
  const imageUsage = user?.usage?.aiImagesThisMonth || 0;
  const imageLimit = user?.planId?.limits?.maxAiImagesPerMonth || 10;
  const usagePercentage = Math.min((aiUsage / aiLimit) * 100, 100);
  const imageUsagePercentage = Math.min((imageUsage / imageLimit) * 100, 100);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/50 transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div
  onClick={() => (window.location.pathname = '/')}
  className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 cursor-pointer h-20"
>
  <div className="">
    <img
      src={logo}
      alt="PostPilot AI"
      className="px-5"
    />
  </div>

  <button
    onClick={(e) => {
      e.stopPropagation();
      setIsMobileMenuOpen(false);
    }}
    className="lg:hidden"
  >
    <X className="w-6 h-6 dark:text-slate-400" />
  </button>
</div>



        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          {navItems.filter(item => user && item.role.includes(user.role)).map((item) => (
            <button 
              key={item.label} 
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-black uppercase tracking-widest text-[10px] group ${
                currentPath === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <item.icon className={`w-4 h-4 ${currentPath === item.path ? 'text-white' : 'group-hover:text-blue-600'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-100 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900">
           {user?.autoPilotConfig?.enabled && (
             <div className="flex items-center gap-2 px-3 py-2 bg-blue-600/10 rounded-xl border border-blue-500/20 mb-4 animate-pulse">
                <Zap className="w-3 h-3 text-blue-500 fill-current" />
                <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">AutoPilot Active</span>
             </div>
           )}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                       <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2">
                           <Zap className="w-3 h-3 text-blue-500 fill-current" />
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{planName} Plan</span>
                         </div>
                         <span className="text-[9px] font-black text-blue-600">{Math.round((usagePercentage + imageUsagePercentage)/2)}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                         <div 
                           className={`h-full transition-all duration-1000 ${usagePercentage > 90 ? 'bg-red-500' : 'bg-blue-600'}`} 
                           style={{ width: `${usagePercentage}%` }} 
                         />
                       </div>
    
                       <div className="flex justify-between items-center mt-2">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                           {aiUsage} / {aiLimit} AI Posts
                          </p>
                          {usagePercentage > 80 && (user?.role === UserRole.USER || user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) && (
                            <button onClick={() => navigate('/admin/plans')} className="text-[8px] font-black text-blue-600 uppercase flex items-center gap-1 hover:underline">
                               Upgrade <ArrowUpCircle className="w-2.5 h-2.5" />
                            </button>
                          )}
                       </div>
                       <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-3">
                         <div 
                           className={`h-full transition-all duration-1000 ${imageUsagePercentage > 90 ? 'bg-red-500' : 'bg-blue-500'}`} 
                           style={{ width: `${imageUsagePercentage}%` }} 
                         />
                       </div>
                       <div className="flex justify-between items-center mt-2">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                           {imageUsage} / {imageLimit} AI Images
                          </p>
                       </div>
                     </div>
           
                     { (
                       <div className={`p-4 rounded-2xl border transition-all ${user?.linkedInConnected ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900' : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900'}`}>
                          <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${user?.linkedInConnected ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                                <Linkedin className="w-4 h-4 fill-current"/>
                             </div>
                             <div onClick={() => navigate('/settings')}  className="overflow-hidden cursor-pointer">
                                <p className="text-[9px] font-black uppercase tracking-widest leading-none text-slate-500">LinkedIn Status</p>
                                <p className={`text-[10px] font-black uppercase tracking-tighter truncate ${user?.linkedInConnected ? 'text-blue-600' : 'text-red-600'}`}>
                                   {user?.linkedInConnected ? 'Connected' : 'Offline'}
                                </p>
                             </div>
                          </div>
                       </div>
                     )}
           <div className="flex items-center gap-3 p-1">
            <img src={user?.linkedInProfile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 object-cover shadow-sm" alt="User" />
            <div className="overflow-hidden text-left">
              <p className="text-xs font-black truncate dark:text-white uppercase tracking-tighter">{user?.name}</p>
              <p className="text-[9px] text-slate-500 truncate font-bold uppercase tracking-widest">{user?.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-black uppercase tracking-widest text-[10px]">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 fixed top-0 z-40 w-full">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden"><Menu className="w-6 h-6 dark:text-slate-300" /></button>
          <div className="flex-1" />
          <div className="flex items-center gap-6">
            {/* <button onClick={toggleTheme} className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border dark:border-slate-700">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button> */}
          </div>
        </header>

        <div className="p-6 md:p-10 flex-1 overflow-y-auto mt-20">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
