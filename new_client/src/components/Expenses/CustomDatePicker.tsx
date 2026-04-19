import { useState, useRef, useEffect } from "react";
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomDatePickerProps {
  value: string; // ISO date format YYYY-MM-DD
  onChange: (date: string) => void;
  className?: string;
}

export default function CustomDatePicker({ value, onChange, className = "" }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (!value) return new Date();
    return value.length === 10 ? new Date(value + "T00:00:00") : new Date(value);
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Robust date parsing helper for display and logic
  const parseDateForUI = (val: string) => {
    if (!val) return new Date();
    // If it is YYYY-MM-DD, append T00:00:00 to avoid UTC shift
    if (val.length === 10) return new Date(val + "T00:00:00");
    return new Date(val);
  };

  const selectedDate = value ? parseDateForUI(value) : null;
  const daysInMonth = getDaysInMonth(currentMonth);
  const startDay = getDay(startOfMonth(currentMonth));
  const blanks = Array.from({ length: startDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDateClick = (dayStr: string) => {
    onChange(dayStr);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all hover:bg-slate-100 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      >
        <CalendarIcon size={16} className={`transition-colors duration-300 ${isOpen ? "text-emerald-500" : "text-slate-400"}`} />
        <span className="font-medium text-slate-700">
          {value ? format(parseDateForUI(value), "MMM dd, yyyy") : "Select Date"}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 bottom-[calc(100%+6px)] z-50 w-[280px] origin-bottom-right overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_0px_40px_rgba(0,0,0,0.12)] p-4"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button 
                type="button" 
                onClick={handlePrevMonth}
                className="flex size-7 items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
               >
                <ChevronLeft size={16} />
              </button>
              <h4 className="text-[14px] font-bold text-slate-800">
                {format(currentMonth, "MMMM yyyy")}
              </h4>
              <button 
                type="button" 
                onClick={handleNextMonth}
                className="flex size-7 items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
               >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                <div key={d} className="text-[11px] font-bold text-slate-400">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {blanks.map(b => (
                <div key={`blank-${b}`} className="size-8"></div>
              ))}
              {days.map(d => {
                const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
                // Adjusting isolated string creation considering JS local timezone nuances
                const dayStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                
                const isSelected = selectedDate && isSameDay(dayDate, selectedDate);
                const isToday = isSameDay(dayDate, new Date());

                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDateClick(dayStr)}
                    className={`flex size-8 items-center justify-center rounded-lg text-[13px] font-medium transition-all ${
                        isSelected 
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" 
                            : isToday
                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
