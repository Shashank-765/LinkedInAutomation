import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Clock } from "lucide-react";

export default function PremiumTimePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  const generateTimeOptions = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m++) {
        const hour = String(h).padStart(2, "0");
        const minute = String(m).padStart(2, "0");
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  };

  const allTimes = useMemo(() => generateTimeOptions(), []);
  const filteredTimes = allTimes.filter((t) => t.includes(search));

  // close outside click
  useEffect(() => {
    const handler = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">

      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl cursor-pointer hover:border-blue-500 transition"
      >
        <div className="flex items-center gap-2 text-white">
          <Clock size={16} />
          {value || "Select time"}
        </div>
        <ChevronDown size={18} className={`transition ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <div className="absolute mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50">

          <input
            placeholder="Search time..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border-b border-slate-700 outline-none rounded-t-xl text-white"
          />

          <div className="max-h-64 overflow-y-auto custom-scroll">
            {filteredTimes.map((time) => (
              <div
                key={time}
                onClick={() => {
                  onChange(time);   // ✅ send value only
                  setOpen(false);
                }}
                className="px-4 py-2 hover:bg-blue-600 cursor-pointer text-white transition"
              >
                {time}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
