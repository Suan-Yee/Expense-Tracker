import { Search } from "lucide-react";
import { useState } from "react";
import DateRangePicker from "./DateRangePicker";
import CustomSelect from "./CustomSelect";
import { EXPENSE_CATEGORIES } from "../../constants/categories";

const ALL = "all";

const filterOptions = [
  { label: "All Categories", value: ALL },
  ...EXPENSE_CATEGORIES,
];

export default function FiltersBar() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState(ALL);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input 
            type="text" 
            placeholder="Search transactions..." 
            className="h-10 w-full rounded-xl border border-slate-200 bg-white/60 pl-9 pr-4 text-[13px] text-slate-700 outline-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 placeholder:text-slate-400"
        />
      </div>

      {/* Filters and Date */}
      <div className="flex items-center gap-3">
        
        <DateRangePicker 
            startDate={startDate} 
            endDate={endDate} 
            onChange={(s, e) => {
                setStartDate(s);
                setEndDate(e);
            }} 
        />

        <div className="w-[165px]">
            <CustomSelect 
                options={filterOptions}
                value={categoryFilter}
                onChange={setCategoryFilter}
                className="w-full"
            />
        </div>
        
      </div>
    </div>
  );
}

