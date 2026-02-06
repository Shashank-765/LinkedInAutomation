
import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Edit2, Shield, Building, Briefcase, Sparkles, 
  X, Loader2, Save, User as UserIcon, Settings, 
  Target, Globe, Mail, Eye, ChevronRight, Activity, CreditCard, Trash2
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { UserRole, User } from '../../types';
import { toast } from 'react-toastify';


const STRATEGY_TYPES = ['Educational', 'Sales', 'Thought Leadership', 'Personal Story', 'Recruitment'];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<'NONE' | 'CREATE' | 'EDIT' | 'VIEW'>('NONE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({ 
    name: '', email: '', planId: '', companyName: '', industry: '', postTypePreference: 'Educational', role: UserRole.USER, status: 'active' as 'active' | 'suspended'
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [uRes, pRes] = await Promise.all([adminApi.getUsers(), adminApi.getPlans()]);
      setUsers(uRes.data);
      setPlans(pRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleOpenModal = (mode: 'CREATE' | 'EDIT' | 'VIEW', user?: User) => {
    if (user) {
      setSelectedUser(user);
      const planId = user.planId?._id || user.planId || '';
      setFormData({ name: user.name, email: user.email, planId, companyName: user.companyName || '', industry: user.industry || '', postTypePreference: user.postTypePreference || 'Educational', role: user.role, status: user.status || 'active' });
    } else {
      setFormData({ name: '', email: '', planId: plans[0]?._id || '', companyName: '', industry: '', postTypePreference: 'Educational', role: UserRole.USER, status: 'active' });
    }
    setModalState(mode);
  };
 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalState === 'EDIT' && selectedUser) await adminApi.updateUser(selectedUser._id, formData);
      else await adminApi.createUser(formData);
      await fetchInitialData();
      setModalState('NONE');
    } catch (err) { toast.error("Error saving user."); }
    finally { setIsSubmitting(false); }
  };


  const confirmToast = (message: string) =>
  new Promise<boolean>((resolve) => {
    toast(
      ({ closeToast }) => (
        <div className="bg-white shadow-lg rounded-lg p-4 w-[320px]">
          <p className="text-sm mb-4">{message}</p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                closeToast();
                resolve(false);
              }}
              className="px-3 py-1 text-sm border rounded"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                closeToast();
                resolve(true);
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        position: "top-center"
      }
    );
  });

  const handleDeleteUser = async (id: string, name: string) => {
  const confirmed = await confirmToast(
    `Are you sure you want to delete user "${name}"? This action is permanent and cannot be reversed.`
  );

  if (!confirmed) return;

  try {
    await adminApi.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u._id !== id));
    toast.success("User permanently deleted successfully.");
  } catch {
    toast.error("Error decommissioning user.");
  }
};


  if (loading) return <div className="h-[60vh] flex flex-col items-center justify-center space-y-4"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /><p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Accessing Directory...</p></div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter  leading-none">Clients Directory</h1>
          <p className="text-slate-500 font-medium text-sm md:text-base mt-2">Onboard for all organization identities.</p>
        </div>
        <button onClick={() => handleOpenModal('CREATE')} className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/30 transition-all active:scale-95 hover:scale-[1.02]">
          <UserPlus className="w-4 h-4" /> Onboard Client
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-[3rem] border dark:border-slate-700 shadow-sm overflow-hidden text-left">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b dark:border-slate-700">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">License</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Health</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group">
                <td className="px-8 py-6"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center font-black text-blue-600 border dark:border-blue-800">{u.name.charAt(0)}</div><div><p className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">{u.name}</p><p className="text-[10px] text-slate-500 font-bold">{u.email}</p></div></div></td>
                <td className="px-8 py-6"><p className="text-sm font-bold dark:text-slate-300">{u.companyName}</p><p className="text-[10px] text-slate-500 uppercase font-black">{u.industry}</p></td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                      {u.planId?.name || 'Starter'}
                    </span>
                    <span className="px-2 py-1 bg-slate-50 dark:bg-slate-900/40 text-slate-400 rounded-lg text-[8px] font-bold uppercase tracking-widest">{u.postTypePreference}</span>
                  </div>
                </td>
                <td className="px-8 py-6"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} /><span className={`text-[9px] font-black uppercase tracking-widest ${u.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{u.status}</span></div></td>
                <td className="px-8 py-6 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleOpenModal('VIEW', u)} className="p-2.5 bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-blue-600 rounded-xl transition-all" title="View Profile"><Eye className="w-5 h-5"/></button><button onClick={() => handleOpenModal('EDIT', u)} className="p-2.5 bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-blue-600 rounded-xl transition-all" title="Edit Configuration"><Edit2 className="w-5 h-5"/></button><button onClick={() => handleDeleteUser(u._id, u.name)} className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-400 hover:text-red-600 rounded-xl transition-all" title="Delete Identity"><Trash2 className="w-5 h-5"/></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-left">
        {users.map((u) => (
          <div key={u._id} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border dark:border-slate-700 shadow-sm space-y-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-xl ">{u.name.charAt(0)}</div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">{u.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${u.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{u.status}</div>
                <button onClick={() => handleDeleteUser(u._id, u.name)} className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-4 border-y dark:border-slate-700">
              <div><p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Entity</p><p className="text-xs font-bold dark:text-slate-300 truncate">{u.companyName}</p></div>
              <div><p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">License</p><p className="text-xs font-bold text-blue-600 truncate">{u.planId?.name || 'Starter'}</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleOpenModal('VIEW', u)} className="flex-1 py-3 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">Profile <Eye className="w-3.5 h-3.5"/></button>
              <button onClick={() => handleOpenModal('EDIT', u)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">Configure <ChevronRight className="w-3.5 h-3.5"/></button>
            </div>
          </div>
        ))}
      </div>

      {/* Profile/Config Modal */}
      {modalState !== 'NONE' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-3 sm:p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-[3rem] shadow-2xl border dark:border-slate-700 max-h-[92vh] overflow-y-auto">
            <div className="p-7 md:p-10 border-b dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
              <div className="flex items-center gap-5 text-left">
                <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-lg ${modalState === 'CREATE' ? 'bg-green-600 shadow-green-500/30' : 'bg-blue-600 shadow-blue-500/30'}`}>{modalState === 'CREATE' ? <UserPlus className="text-white w-7 h-7" /> : <Settings className="text-white w-7 h-7" />}</div>
                <div><h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter  leading-none">{modalState === 'VIEW' ? 'Audit Insight' : 'Config Identity'}</h3><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Directory Endpoint Management</p></div>
              </div>
              <button onClick={() => setModalState('NONE')} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-2xl"><X className="w-6 h-6 dark:text-slate-400" /></button>
            </div>
            <div className="p-7 md:p-12">
               {modalState === 'VIEW' && selectedUser ? (
                 <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                       {[
                         { icon: UserIcon, label: 'Full Legal Name', val: selectedUser.name },
                         { icon: Mail, label: 'Endpoint (Email)', val: selectedUser.email },
                         { icon: Building, label: 'Organization', val: selectedUser.companyName },
                         { icon: Globe, label: 'Vertical', val: selectedUser.industry },
                         { icon: Target, label: 'Post Persona', val: selectedUser.postTypePreference },
                         { icon: Shield, label: 'License Tier', val: selectedUser.planId?.name || 'Starter' }
                       ].map((item, i) => (
                         <div key={i} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border dark:border-slate-700"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{item.label}</p><div className="flex items-center gap-3"><item.icon className="w-4 h-4 text-blue-500" /><span className="text-sm font-black dark:text-white truncate uppercase">{item.val}</span></div></div>
                       ))}
                    </div>
                    <div className="p-10 bg-blue-600 rounded-[3rem] text-white relative overflow-hidden"><div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left"><div className="space-y-2"><h3 className="text-2xl font-black uppercase tracking-tighter ">Cycle Metrics</h3><p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Real-time automation health score</p></div><div className="flex gap-10"><div className="text-center"><div className="text-5xl font-black">{selectedUser.usage.aiGenerationsThisMonth}</div><div className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">AI Ops</div></div><div className="text-center"><div className="text-5xl font-black">{selectedUser.usage.scheduledToday}</div><div className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Live Queue</div></div></div></div><Sparkles className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 opacity-30 rotate-12" /></div>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-8 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {[
                         { id: 'name', label: 'Identity Name', ph: 'John Doe', icon: UserIcon },
                         { id: 'email', label: 'Auth Endpoint', ph: 'john@org.com', type: 'email', icon: Mail },
                         { id: 'companyName', label: 'Commercial Entity', ph: 'Acme Global', icon: Building },
                         { id: 'industry', label: 'Vertical Sector', ph: 'Fintech', icon: Globe }
                       ].map(f => (
                         <div key={f.id} className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2"><f.icon className="w-3.5 h-3.5" /> {f.label}</label><input required className="w-full px-7 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-blue-500 outline-none text-slate-900 dark:text-white font-black transition-all" value={(formData as any)[f.id]} onChange={e => setFormData({...formData, [f.id]: e.target.value})} placeholder={f.ph} /></div>
                       ))}
                    </div>
                    
                    <div className="p-8 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Protocol</label>
                         <select className="w-full px-6 py-4 bg-white dark:bg-slate-800 rounded-2xl font-black text-[11px] uppercase outline-none border dark:border-slate-700" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                           <option value={UserRole.USER}>Standard Profile</option>
                           <option value={UserRole.ADMIN}>Regional Admin</option>
                           <option value={UserRole.SUPER_ADMIN}>System Architect</option>
                         </select>
                       </div>
                       
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><CreditCard className="w-3 h-3 text-blue-500"/> License Tier</label>
                         <select className="w-full px-6 py-4 bg-white dark:bg-slate-800 rounded-2xl font-black text-[11px] uppercase outline-none border dark:border-slate-700" value={formData.planId} onChange={e => setFormData({...formData, planId: e.target.value})}>
                           <option value="">Starter / Basic</option>
                           {plans.map(p => <option key={p._id} value={p._id}>{p.name} (${p.price})</option>)}
                         </select>
                       </div>

                       <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Persona Sync</label><select className="w-full px-6 py-4 bg-white dark:bg-slate-800 rounded-2xl font-black text-[11px] uppercase outline-none border dark:border-slate-700" value={formData.postTypePreference} onChange={e => setFormData({...formData, postTypePreference: e.target.value})} >{STRATEGY_TYPES.map(s => <option key={s} value={s}>{s} Mode</option>)}</select></div>
                       <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Health</label><div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl border dark:border-slate-700"><button type="button" onClick={() => setFormData({...formData, status: 'active'})} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${formData.status === 'active' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400'}`}>Live</button><button type="button" onClick={() => setFormData({...formData, status: 'suspended'})} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${formData.status === 'suspended' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400'}`}>Halted</button></div></div>
                    </div>
                    
                    <button disabled={isSubmitting} className="w-full py-7 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-4 active:scale-95 transition-all">
                       {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                       Onboard Client
                    </button>
                 </form>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
