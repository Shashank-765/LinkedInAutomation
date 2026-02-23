import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  CalendarDays,
  TrendingUp,
  Pencil,
  Check,
  X
} from "lucide-react";

import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  autoPostIndustryApi,
  autoPostCalendarApi
} from "../../services/api";
import PremiumTimePicker from "@/components/PremiumTimePicker";

const AutoPilotManager: React.FC = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [industryConfig, setIndustryConfig] = useState<any>(null);
  const [calendarConfig, setCalendarConfig] = useState<any>(null);

  const [slotInput, setSlotInput] = useState({ time: "", keywords: "" });
  const [eventInput, setEventInput] = useState({ date: "", topic: "" });

  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const KEYWORD_SUGGESTIONS = [
    "AI","SaaS","Fintech","Game","Blockchain","Web3",
    "Crypto","VR","AR","Metaverse","India","Tech"
  ];

  // =====================================================
  // SAFE URN
  // =====================================================
  const getUrn = () => {
    if (!user?.linkedInProfile) return null;
    if (Array.isArray(user.linkedInProfile)) return user.linkedInProfile[0]?.urn;
    return user.linkedInProfile.urn;
  };

  // =====================================================
  // VALIDATION
  // =====================================================
  const isValid24HourTime = (time: string) =>
    /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

  const handleKeywordChange = (value: string) => {
    const clean = value.replace(/\s/g, "").replace(/[^a-zA-Z0-9]/g, "");
    setSlotInput(prev => ({ ...prev, keywords: clean }));
  };

  const selectSuggestion = (word: string) => {
    setSlotInput(prev => ({ ...prev, keywords: word }));
  };

  // =====================================================
  // LOAD DATA
  // =====================================================
  const loadData = async () => {
    try {
      const [industryRes, calendarRes] = await Promise.all([
        autoPostIndustryApi.getAll(),
        autoPostCalendarApi.getAll()
      ]);

      setIndustryConfig(industryRes.data[0] || null);
      setCalendarConfig(calendarRes.data[0] || null);
    } catch {
      toast.error("Failed to load configs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.linkedInConnected) {
      toast.error("Please connect LinkedIn first");
      setLoading(false);
      return;
    }
    loadData();
  }, [user]);

  // =====================================================
  // CREATE CONFIG
  // =====================================================
  const createIndustry = async () => {
    const urn = getUrn();
    if (!urn) return toast.error("LinkedIn not connected");

    const res = await autoPostIndustryApi.create({ urn, enabled: true });
    setIndustryConfig(res.data);
  };

  const createCalendar = async () => {
    const urn = getUrn();
    if (!urn) return toast.error("LinkedIn not connected");

    const res = await autoPostCalendarApi.create({ urn, enabled: true });
    setCalendarConfig(res.data);
  };

  // =====================================================
  // INDUSTRY CRUD
  // =====================================================
  const addSlot = async () => {
    if (!industryConfig) return;
    if (!isValid24HourTime(slotInput.time))
      return toast.error("Invalid time HH:mm");

    if (!slotInput.keywords)
      return toast.error("Keyword required");

    await autoPostIndustryApi.addSlot(industryConfig._id, slotInput);
    setSlotInput({ time: "", keywords: "" });
    loadData();
  };

  const saveSlotEdit = async () => {
    await autoPostIndustryApi.update(industryConfig._id, industryConfig);
    setEditingSlotId(null);
    loadData();
  };

  const deleteSlot = async (slotId: string) => {
    await autoPostIndustryApi.deleteSlot(industryConfig._id, slotId);
    loadData();
  };

  // =====================================================
  // CALENDAR CRUD
  // =====================================================
  const addEvent = async () => {
    if (!calendarConfig) return;
    if (!eventInput.date || !eventInput.topic)
      return toast.error("Fill all fields");

    await autoPostCalendarApi.addEvent(calendarConfig._id, eventInput);
    setEventInput({ date: "", topic: "" });
    loadData();
  };

  const saveEventEdit = async () => {
    await autoPostCalendarApi.update(calendarConfig._id, calendarConfig);
    setEditingEventId(null);
    loadData();
  };

  const deleteEvent = async (eventId: string) => {
    await autoPostCalendarApi.deleteEvent(calendarConfig._id, eventId);
    loadData();
  };

  // =====================================================
  // LOADER
  // =====================================================
  if (loading)
    return (
      <div className="flex justify-center py-40">
        <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
      </div>
    );

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 text-white">

      <h1 className="text-4xl font-black tracking-tight">
        Autonomous Posting Engine
      </h1>

      {/* ================= INDUSTRY ================= */}

      <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-xl">

        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-black flex gap-2 items-center">
            <TrendingUp className="text-blue-400"/> Industry Auto Post
          </h2>

          {!industryConfig && (
            <button onClick={createIndustry} className="bg-blue-600 px-6 py-3 rounded-xl">
              Create Config
            </button>
          )}
        </div>

        {industryConfig && (
          <>
            {/* ADD SLOT */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-8 backdrop-blur">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

                <div className="md:col-span-3">
                  <label className="text-xs text-gray-400 mb-2 block font-semibold tracking-wide">
                    Schedule Time
                  </label>

                  <PremiumTimePicker
                    value={slotInput.time}
                    onChange={(value: string) => {
                      if (!isValid24HourTime(value)) {
                        toast.error("Use HH:mm");
                        return;
                      }
                      setSlotInput(prev => ({ ...prev, time: value }));
                    }}
                  />
                </div>

                <div className="md:col-span-7">
                  <label className="text-xs text-gray-400 mb-2 block font-semibold tracking-wide">
                    Topic Keyword
                  </label>

                  <input
                    value={slotInput.keywords}
                    onChange={(e)=>handleKeywordChange(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl"
                  />

                  <div className="flex flex-wrap gap-2 mt-3">
                    {KEYWORD_SUGGESTIONS.map(word => (
                      <button
                        key={word}
                        onClick={()=>selectSuggestion(word)}
                        className="px-3 py-1 text-xs rounded-full border bg-slate-800 border-slate-700"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 mt-6">
                  <button
                    onClick={addSlot}
                    className="w-full h-[44px] bg-green-600 rounded-xl"
                  >
                    Add Slot
                  </button>
                </div>

              </div>
            </div>

            {/* SLOT LIST */}
            {industryConfig.schedules?.map((slot:any)=>(
              <div key={slot._id} className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-5 flex justify-between mb-3">

                {editingSlotId === slot._id ? (
                  <>
                    <input
                      type="time"
                      value={slot.time}
                      onChange={(e)=>{
                        const updated = {...industryConfig};
                        const target = updated.schedules.find(s=>s._id===slot._id);
                        target.time = e.target.value;
                        setIndustryConfig(updated);
                      }}
                      className="bg-slate-800 px-3 py-2 rounded-lg"
                    />

                    <input
                      value={slot.keywords}
                      onChange={(e)=>{
                        const updated = {...industryConfig};
                        const target = updated.schedules.find(s=>s._id===slot._id);
                        target.keywords = e.target.value;
                        setIndustryConfig(updated);
                      }}
                      className="bg-slate-800 px-3 py-2 rounded-lg"
                    />

                    <button onClick={saveSlotEdit}><Check/></button>
                    <button onClick={()=>setEditingSlotId(null)}><X/></button>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="font-bold">{slot.time}</div>
                      <div className="text-sm text-gray-400">{slot.keywords}</div>
                      <div className="text-xs text-gray-500">
                        Last Posted: {slot.lastAutoPostDate || "Never"}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={()=>setEditingSlotId(slot._id)}><Pencil/></button>
                      <button onClick={()=>deleteSlot(slot._id)}>
                        <Trash2 className="text-red-500"/>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

          </>
        )}
      </div>

      {/* ================= CALENDAR ================= */}

      <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-xl">

        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-black flex gap-2 items-center">
            <CalendarDays className="text-indigo-400"/> Calendar Auto Post
          </h2>

          {!calendarConfig && (
            <button onClick={createCalendar} className="bg-indigo-600 px-6 py-3 rounded-xl">
              Create Config
            </button>
          )}
        </div>

        {calendarConfig && (
          <>
            <div className="flex gap-3 mb-6">
              <input
                type="date"
                value={eventInput.date}
                onChange={(e)=>setEventInput(prev=>({...prev,date:e.target.value}))}
                className="bg-slate-800 px-4 py-3 rounded-xl"
              />
              <input
                value={eventInput.topic}
                onChange={(e)=>setEventInput(prev=>({...prev,topic:e.target.value}))}
                className="bg-slate-800 px-4 py-3 rounded-xl flex-1"
              />
              <button onClick={addEvent} className="bg-green-600 px-4 rounded-xl">
                <Plus/>
              </button>
            </div>

            {calendarConfig.events?.map((event:any)=>(
              <div key={event._id} className="flex justify-between bg-slate-800 p-4 rounded-xl mb-3">

                {editingEventId === event._id ? (
                  <>
                    <input
                      type="date"
                      value={event.date}
                      onChange={(e)=>{
                        const updated={...calendarConfig};
                        const target=updated.events.find(ev=>ev._id===event._id);
                        target.date=e.target.value;
                        setCalendarConfig(updated);
                      }}
                    />
                    <input
                      value={event.topic}
                      onChange={(e)=>{
                        const updated={...calendarConfig};
                        const target=updated.events.find(ev=>ev._id===event._id);
                        target.topic=e.target.value;
                        setCalendarConfig(updated);
                      }}
                    />
                    <button onClick={saveEventEdit}><Check/></button>
                    <button onClick={()=>setEditingEventId(null)}><X/></button>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="font-bold">{event.topic}</div>
                      <div className="text-sm text-gray-400">{event.date}</div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={()=>setEditingEventId(event._id)}><Pencil/></button>
                      <button onClick={()=>deleteEvent(event._id)}>
                        <Trash2 className="text-red-500"/>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </div>

    </div>
  );
};

export default AutoPilotManager;
