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

const AutoPilotManager: React.FC = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [industryConfig, setIndustryConfig] = useState<any>(null);
  const [calendarConfig, setCalendarConfig] = useState<any>(null);

  const [slotInput, setSlotInput] = useState({ time: "", keywords: "" });
  const [eventInput, setEventInput] = useState({ date: "", topic: "" });

  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

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
      return;
    }
    loadData();
  }, []);

  // =====================================================
  // CREATE CONFIGS
  // =====================================================

  const createIndustry = async () => {
    const res = await autoPostIndustryApi.create({
      urn: user.linkedInProfile[0].urn,
      enabled: true
    });
    setIndustryConfig(res.data);
    toast.success("Industry config created");
  };

  const createCalendar = async () => {
    const res = await autoPostCalendarApi.create({
      urn: user.linkedInProfile[0].urn,
      enabled: true
    });
    setCalendarConfig(res.data);
    toast.success("Calendar config created");
  };

  // =====================================================
  // INDUSTRY CRUD
  // =====================================================

  const addSlot = async () => {
    if (!slotInput.time || !slotInput.keywords)
      return toast.error("Fill all fields");

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

  if (loading) {
    return (
      <div className="flex justify-center py-40">
        <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 text-white">

      <h1 className="text-4xl font-black tracking-tight">
        Autonomous Posting Engine
      </h1>

      {/* ================================================= */}
      {/* INDUSTRY AUTO POST */}
      {/* ================================================= */}

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
            <div className="flex gap-3 mb-6">
              <input
                placeholder="09:00"
                value={slotInput.time}
                onChange={(e)=>setSlotInput({...slotInput,time:e.target.value})}
                className="bg-slate-800 px-4 py-3 rounded-xl"
              />
              <input
                placeholder="AI, Fintech"
                value={slotInput.keywords}
                onChange={(e)=>setSlotInput({...slotInput,keywords:e.target.value})}
                className="bg-slate-800 px-4 py-3 rounded-xl flex-1"
              />
              <button onClick={addSlot} className="bg-green-600 px-4 rounded-xl">
                <Plus/>
              </button>
            </div>

            {industryConfig.schedules?.map((slot:any)=>(
              <div key={slot._id} className="flex justify-between bg-slate-800 p-4 rounded-xl mb-3">

                {editingSlotId === slot._id ? (
                  <>
                    <input
                      value={slot.time}
                      onChange={(e)=>{
                        slot.time = e.target.value;
                        setIndustryConfig({...industryConfig});
                      }}
                      className="bg-slate-700 px-3 rounded"
                    />
                    <input
                      value={slot.keywords}
                      onChange={(e)=>{
                        slot.keywords = e.target.value;
                        setIndustryConfig({...industryConfig});
                      }}
                      className="bg-slate-700 px-3 rounded"
                    />
                    <button onClick={saveSlotEdit}><Check/></button>
                    <button onClick={()=>setEditingSlotId(null)}><X/></button>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="font-bold">{slot.time}</div>
                      <div className="text-sm text-gray-400">{slot.keywords}</div>
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

      {/* ================================================= */}
      {/* CALENDAR AUTO POST */}
      {/* ================================================= */}

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
                onChange={(e)=>setEventInput({...eventInput,date:e.target.value})}
                className="bg-slate-800 px-4 py-3 rounded-xl"
              />
              <input
                placeholder="Event topic"
                value={eventInput.topic}
                onChange={(e)=>setEventInput({...eventInput,topic:e.target.value})}
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
                        event.date = e.target.value;
                        setCalendarConfig({...calendarConfig});
                      }}
                      className="bg-slate-700 px-3 rounded"
                    />
                    <input
                      value={event.topic}
                      onChange={(e)=>{
                        event.topic = e.target.value;
                        setCalendarConfig({...calendarConfig});
                      }}
                      className="bg-slate-700 px-3 rounded"
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
