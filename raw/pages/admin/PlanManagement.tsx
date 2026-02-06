
import React, { useState, useEffect } from 'react';
import { 
  Check, Zap, Rocket, Building2, Plus, Edit2, Trash2, X, CreditCard, Loader2, 
  ShieldCheck, Lock, ChevronRight, CheckCircle2, Sparkles, Star, Globe, History 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { adminApi } from '../../services/api';
import { toast } from 'react-toastify';

const PlanManagement: React.FC = () => {
  const { user, updatePlan, checkAuth } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [editingPlan, setEditingPlan] = useState<any>(null);
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanToBuy, setSelectedPlanToBuy] = useState<any>(null);
  const [checkoutStep, setCheckoutStep] = useState<'DETAILS' | 'SUCCESS'>('DETAILS');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isAdmin = user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN;

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPlans();
      setPlans(res.data || []);
    } catch (err) {
      console.error("Plan Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCheckout = (plan: any) => {
    const currentPlanId = user?.planId?._id || user?.planId;
    if (currentPlanId === plan._id) {
      toast.warning("You are already subscribed to this tier.");
      return;
    }
    
    setSelectedPlanToBuy(plan);
    setCheckoutStep('DETAILS');
    setIsCheckoutOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPlanToBuy) return;
    setIsProcessing(true);
    
    setTimeout(async () => {
      try {
        await updatePlan(selectedPlanToBuy._id);
        setCheckoutStep('SUCCESS');
      } catch (err) {
        console.log('err', err)
        toast.error("Payment processor encountered an error. Please check your credentials.");
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan);
    setModalMode('EDIT');
    setIsModalOpen(true);
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan tier? This action cannot be undone.")) return;
    
    try {
      await adminApi.deletePlan(id);
      toast.success("Plan deleted successfully");
      await fetchPlans();
    } catch (err) {
      toast.error("Error deleting plan");
    }
  };

  const handleSavePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const planPayload = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      limits: {
        maxAiGenerationsPerMonth: Number(formData.get('ai_limit')),
        maxAiImagesPerMonth: Number(formData.get('ai_image_limit')),
        maxScheduledPostsPerDay: Number(formData.get('schedule_limit')),
        bulkScheduling: formData.get('bulk') === 'true',
        autoPilot: formData.get('autopilot') === 'true',
        imageGeneration: formData.get('image_gen') === 'true',
        teamMemberLimit: Number(formData.get('team_limit'))
      },
      icon: 'Zap'
    };

    setIsProcessing(true);
    try {
      if (modalMode === 'EDIT' && editingPlan) {
        await adminApi.updatePlan(editingPlan._id, planPayload);
        toast.success("Plan updated successfully");
      } else {
        await adminApi.createPlan(planPayload);
        toast.success("Plan created successfully");
      }
      await fetchPlans();
      checkAuth()
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Error saving plan");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Accessing Commercial Database...</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Enterprise Tiers</h1>
          <p className="text-slate-500 font-medium">Define usage quotas and revenue streams for your organization.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { setModalMode('CREATE'); setEditingPlan(null); setIsModalOpen(true); }} 
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/25 flex items-center gap-3 hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" /> New Product Tier
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrent = (user?.planId?._id || user?.planId) === plan._id;
          const isPopular = plan.name.toLowerCase().includes('pro');
          
          return (
            <div key={plan._id} className={`bg-white dark:bg-slate-800 p-10 rounded-[3.5rem] border transition-all relative overflow-hidden flex flex-col ${isCurrent ? 'border-blue-500 shadow-2xl shadow-blue-500/10' : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
              {isPopular && (
                <div className="absolute top-8 right-[-35px] bg-indigo-600 text-white text-[10px] font-black uppercase py-1 px-12 rotate-45 shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'}`}>
                      {plan.price > 100 ? <Building2 className="w-6 h-6" /> : plan.price > 49 ? <Rocket className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                   </div>
                   <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{plan.name}</h3>
                 </div>
                 {isAdmin && (
                   <div className="flex gap-1">
                      <button onClick={() => handleEditPlan(plan)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeletePlan(plan._id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                   </div>
                 )}
              </div>

              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">${plan.price}</span>
                <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">/mo</span>
              </div>
              
              <div className="flex-1 space-y-5">
                {[
                  { label: `${plan.limits.maxAiGenerationsPerMonth} AI Generations`, check: true },
                  { label: `${plan.limits.maxAiImagesPerMonth} AI Images`, check: true },
                  { label: `${plan.limits.maxScheduledPostsPerDay} Posts per Day`, check: true },
                  { label: `Bulk Scheduling`, check: plan.limits.bulkScheduling },
                  { label: `Auto-Pilot Mode`, check: plan.limits.autoPilot },
                  { label: `AI Image Engine`, check: plan.limits.imageGeneration },
                  { label: `${plan.limits.teamMemberLimit} Team Members`, check: plan.limits.teamMemberLimit > 1 }
                ].map((feature, i) => (
                  <div key={i} className={`flex items-center gap-3 text-sm font-medium ${feature.check ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600 line-through'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${feature.check ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                      <Check className="w-3 h-3 stroke-[4]" />
                    </div>
                    {feature.label}
                  </div>
                ))}
              </div>

              <button 
                disabled={isCurrent}
                onClick={() => handleOpenCheckout(plan)}
                className={`w-full mt-12 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${isCurrent ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-default' : 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95'}`}
              >
                {isCurrent ? <CheckCircle2 className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                {isCurrent ? 'Active Subscription' : 'Upgrade Account'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Admin Plan Creator/Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-4 animate-in zoom-in duration-300 text-left">
          <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-[3rem] p-10 overflow-hidden shadow-2xl border dark:border-slate-700">
            <div className="flex justify-between items-center mb-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                     {modalMode === 'EDIT' ? <Edit2 className="text-white w-6 h-6" /> : <Plus className="text-white w-6 h-6" />}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter ">
                    {modalMode === 'EDIT' ? 'Update Tier' : 'Tier Factory'}
                  </h2>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl"><X className="w-5 h-5 text-slate-400"/></button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Name</label>
                  <input name="name" defaultValue={editingPlan?.name || ''} placeholder="Pro / Elite" required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price/mo</label>
                  <input name="price" type="number" defaultValue={editingPlan?.price || ''} placeholder="99" required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">AI Limit</label>
                  <input name="ai_limit" type="number" defaultValue={editingPlan?.limits?.maxAiGenerationsPerMonth || ''} placeholder="100" required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Posts/day</label>
                  <input name="schedule_limit" type="number" defaultValue={editingPlan?.limits?.maxScheduledPostsPerDay || ''} placeholder="5" required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">AI Image Limit</label>
                  <input name="ai_image_limit" type="number" defaultValue={editingPlan?.limits?.maxAiImagesPerMonth || ''} placeholder="5" required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
               
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest"><input type="checkbox" name="autopilot" value="true" defaultChecked={editingPlan?.limits?.autoPilot} className="w-4 h-4 rounded-lg accent-blue-600" /> Auto-Pilot</label>
                <label className="flex items-center gap-3 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest"><input type="checkbox" name="bulk" value="true" defaultChecked={editingPlan?.limits?.bulkScheduling} className="w-4 h-4 rounded-lg accent-blue-600" /> Bulk Ops</label>
                <label className="flex items-center gap-3 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest"><input type="checkbox" name="image_gen" value="true" defaultChecked={editingPlan?.limits?.imageGeneration} className="w-4 h-4 rounded-lg accent-blue-600" /> AI Imagery</label>
                <div className="flex items-center gap-2">
                  <input name="team_limit" type="number" defaultValue={editingPlan?.limits?.teamMemberLimit || 1} placeholder="1" className="w-12 bg-white dark:bg-slate-800 rounded-lg p-1 text-center font-bold" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Members</span>
                </div>
              </div>

              <button type="submit" disabled={isProcessing} className="w-full py-6 bg-blue-600 text-white font-black uppercase tracking-widest text-sm rounded-[1.5rem] shadow-2xl shadow-blue-500/30 hover:scale-[1.02] transition-all disabled:opacity-50">
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : modalMode === 'EDIT' ? 'Update Commercial Tier' : 'Publish Commercial Tier'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Secure Checkout Modal remains the same */}
      {isCheckoutOpen && selectedPlanToBuy && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/95 backdrop-blur-2xl p-4 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-[4rem] shadow-2xl overflow-hidden border dark:border-slate-700">
              {checkoutStep === 'DETAILS' ? (
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="bg-blue-600 p-16 text-white flex flex-col justify-between relative overflow-hidden text-left">
                    <div className="relative z-10">
                       <h3 className="text-xs font-black uppercase tracking-widest text-blue-200 mb-2">Order Summary</h3>
                       <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 ">{selectedPlanToBuy.name} Plan</h2>
                       
                       <div className="space-y-4 mb-10">
                          <div className="flex justify-between items-center py-4 border-b border-white/10">
                             <span className="text-sm font-medium text-blue-100">Monthly License</span>
                             <span className="text-xl font-black">${selectedPlanToBuy.price}</span>
                          </div>
                          <div className="flex justify-between items-center py-4">
                             <span className="text-sm font-medium text-blue-100">Automation Setup</span>
                             <span className="text-xs font-black uppercase tracking-widest">Free</span>
                          </div>
                       </div>

                       <div className="p-6 bg-white/10 rounded-3xl border border-white/10">
                          <p className="text-xs leading-relaxed font-medium">Includes high-priority API tokens and executive LinkedIn support. Recurring billing monthly.</p>
                       </div>
                    </div>
                    <div className="relative z-10 flex items-center gap-3 opacity-60">
                       <ShieldCheck className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-widest">PCI-DSS Level 1 Secure</span>
                    </div>
                    <Sparkles className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/5 opacity-20 rotate-12" />
                  </div>

                  <div className="p-16 space-y-8 bg-white dark:bg-slate-800 text-left">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Payment Node</h3>
                       <button onClick={() => setIsCheckoutOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X className="w-6 h-6"/></button>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cardholder Name</label>
                          <input type="text" placeholder="Full legal name" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none font-bold text-slate-900 dark:text-white" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Card Credentials</label>
                          <div className="relative">
                             <input type="text" placeholder="•••• •••• •••• ••••" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none font-bold text-slate-900 dark:text-white pl-14" />
                             <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="MM/YY" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none font-bold text-slate-900 dark:text-white" />
                          <input type="text" placeholder="CVC" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none font-bold text-slate-900 dark:text-white" />
                       </div>
                    </div>

                    <button 
                      onClick={handleConfirmPurchase}
                      disabled={isProcessing}
                      className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-4 hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                       {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                       Authorize Transaction
                    </button>
                    <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">By confirming, you agree to our terms of service.</p>
                  </div>
                </div>
              ) : (
                <div className="p-24 text-center space-y-8 bg-white dark:bg-slate-800">
                   <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40 animate-bounce">
                      <CheckCircle2 className="text-white w-12 h-12 stroke-[3]" />
                   </div>
                   <div>
                      <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter ">Tier Activated</h2>
                      <p className="text-slate-500 mt-4 font-medium max-w-sm mx-auto text-lg leading-relaxed">Your account has been upgraded to the <span className="text-blue-600 font-black">{selectedPlanToBuy.name} tier</span>. Automation limits are now active.</p>
                   </div>
                   <button 
                    onClick={() => { setIsCheckoutOpen(false); window.location.hash = '/#/dashboard'; }}
                    className="px-16 py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/30 hover:scale-105 transition-all inline-flex items-center gap-4"
                   >
                      Go to Dashboard <ChevronRight className="w-5 h-5" />
                   </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default PlanManagement;
