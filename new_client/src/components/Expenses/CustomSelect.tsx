import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: (string | SelectOption)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({ options, value, onChange, placeholder = "Select...", className = "" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Normalize options to {label, value} shape
  const normalized: SelectOption[] = options.map((o) =>
    typeof o === "string" ? { label: o, value: o } : o
  );

  const selectedOption = normalized.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? value ?? placeholder;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all hover:bg-slate-100 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      >
        <span className={value ? "text-slate-800 font-medium" : "text-slate-400"}>
          {displayLabel}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ml-2 ${isOpen ? "rotate-180 text-emerald-500" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 z-50 mt-1.5 w-full min-w-[160px] overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50"
          >
            <div className="max-h-60 overflow-y-auto p-1">
              {normalized.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                    value === option.value
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {option.label}
                  {value === option.value && <Check size={14} strokeWidth={3} className="text-emerald-500 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
