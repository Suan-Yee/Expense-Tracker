import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import DateRangePicker from "./DateRangePicker";
import CustomSelect from "./CustomSelect";
import { EXPENSE_CATEGORIES } from "../../constants/categories";
import { useExpenseStore } from "../../store/expenseStore";

const ALL = "all";

const filterOptions = [
  { label: "All Categories", value: ALL },
  ...EXPENSE_CATEGORIES,
];

export default function FiltersBar() {
  const { filters, setFilters } = useExpenseStore();
  const [searchValue, setSearchValue] = useState(filters.search || "");

  useEffect(() => {
    const timer = setTimeout(() => {
        if (searchValue !== filters.search) {
            setFilters({ search: searchValue });
        }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue, setFilters, filters.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input 
            type="text" 
            placeholder="Search transactions..." 
            value={searchValue}
            onChange={handleSearchChange}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white/60 pl-9 pr-4 text-[13px] text-slate-700 outline-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 placeholder:text-slate-400"
        />
      </div>

      {/* Filters and Date */}
      <div className="flex items-center gap-3">
        
        <DateRangePicker 
            startDate={filters.startDate || null} 
            endDate={filters.endDate || null} 
            onChange={(s, e) => {
                setFilters({ startDate: s, endDate: e });
            }} 
        />

        <div className="w-[165px]">
            <CustomSelect 
                options={filterOptions}
                value={filters.category || ALL}
                onChange={(val) => setFilters({ category: val })}
                className="w-full"
            />
        </div>
        
      </div>
    </div>
  );
}

