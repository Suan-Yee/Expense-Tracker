import { useState, useRef, useEffect } from "react";
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay, isSameDay, isBefore, isWithinInterval } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DateRangePickerProps {
  startDate: string | null;
  endDate: string | null;
  onChange: (start: string | null, end: string | null) => void;
  className?: string;
}

export default function DateRangePicker({ startDate, endDate, onChange, className = "" }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [currentMonth, setCurrentMonth] = useState(startDate ? new Date(startDate) : new Date());
  
  // Local state for selecting
  const [localStart, setLocalStart] = useState<Date | null>(startDate ? new Date(startDate + "T00:00:00") : null);
  const [localEnd, setLocalEnd] = useState<Date | null>(endDate ? new Date(endDate + "T00:00:00") : null);

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

  const daysInMonth = getDaysInMonth(currentMonth);
  const startDay = getDay(startOfMonth(currentMonth));
  const blanks = Array.from({ length: startDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDateClick = (d: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);

    if (!localStart || (localStart && localEnd)) {
      setLocalStart(clickedDate);
      setLocalEnd(null);
    } else if (localStart && !localEnd) {
      if (isBefore(clickedDate, localStart)) {
        setLocalStart(clickedDate);
        setLocalEnd(null);
      } else {
        setLocalEnd(clickedDate);
        // Dispatch changes when end date is confirmed
        onChange(
            format(localStart, "yyyy-MM-dd"),
            format(clickedDate, "yyyy-MM-dd")
        );
        setTimeout(() => setIsOpen(false), 200);
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalStart(null);
    setLocalEnd(null);
    onChange(null, null);
    setIsOpen(false);
  }

  const getDayClasses = (dayDate: Date) => {
    if (!localStart) return "text-slate-700 hover:bg-slate-100";
    
    const isStart = isSameDay(dayDate, localStart);
    const isEnd = localEnd && isSameDay(dayDate, localEnd);
    
    if (isStart || isEnd) {
        return "bg-emerald-500 text-white shadow-md shadow-emerald-500/30";
    }

    if (localStart && localEnd && isWithinInterval(dayDate, { start: localStart, end: localEnd })) {
        return "bg-emerald-50 text-emerald-700";
    }

    if (isSameDay(dayDate, new Date())) {
        return "bg-slate-50 text-emerald-600 font-bold border border-emerald-200 hover:bg-emerald-50";
    }

    return "text-slate-700 hover:bg-slate-100";
  }

  let displayText = "Select Date Range";
  if (startDate && endDate) {
      displayText = `${format(new Date(startDate + "T00:00:00"), "MMM dd")} - ${format(new Date(endDate + "T00:00:00"), "MMM dd, yyyy")}`;
  } else if (startDate) {
      displayText = `${format(new Date(startDate + "T00:00:00"), "MMM dd, yyyy")} - ...`;
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full min-w-[200px] items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none whitespace-nowrap"
      >
        <CalendarIcon size={14} className={`transition-colors duration-300 ${isOpen || startDate ? "text-emerald-500" : "text-slate-400"}`} />
        <span>{displayText}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 z-50 mt-1.5 w-[280px] overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 p-4"
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

            <div className="grid grid-cols-7 gap-y-1">
              {blanks.map(b => (
                <div key={`blank-${b}`} className="h-8"></div>
              ))}
              {days.map(d => {
                const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);

                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDateClick(d)}
                    className={`flex h-8 w-full items-center justify-center text-[13px] font-medium transition-all ${getDayClasses(dayDate)}`}
                    style={{ borderRadius: isSameDay(dayDate, localStart || dayDate) || isSameDay(dayDate, localEnd || dayDate) ? '8px' : '0px' }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                <button
                    type="button"
                    onClick={handleClear}
                    className="text-[12px] font-semibold text-slate-400 hover:text-red-500 transition-colors"
                >
                    Clear dates
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
