import { CalendarDays, Search, X } from "lucide-react";
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

  const activeFilters = [
    filters.search ? { key: "search", label: `Search: ${filters.search}`, clear: () => setSearchValue("") } : null,
    filters.category && filters.category !== ALL ? { key: "category", label: `Category: ${filters.category}`, clear: () => setFilters({ category: ALL }) } : null,
    filters.startDate || filters.endDate ? { key: "date", label: `${filters.startDate || "Any time"} – ${filters.endDate || "Today"}`, clear: () => setFilters({ startDate: null, endDate: null }) } : null,
  ].filter(Boolean) as Array<{ key: string; label: string; clear: () => void }>;

  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      {/* Search Input */}
      <div className="w-full lg:max-w-sm">
        <label htmlFor="transaction-search" className="control-label">Search</label>
        <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input 
            id="transaction-search"
            type="text" 
            placeholder="Search transactions..." 
            value={searchValue}
            onChange={handleSearchChange}
            className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white"
        />
        {searchValue && <button type="button" onClick={() => setSearchValue("")} className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Clear search"><X size={15} /></button>}
        </div>
      </div>

      {/* Filters and Date */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-end">
        
        <DateRangePicker 
            startDate={filters.startDate || null} 
            endDate={filters.endDate || null} 
            onChange={(s, e) => {
                setFilters({ startDate: s, endDate: e });
            }} 
        />

        <div className="min-w-0 lg:w-[190px]">
            <CustomSelect 
                options={filterOptions}
                value={filters.category || ALL}
                onChange={(val) => setFilters({ category: val })}
                className="w-full"
            />
        </div>
        
      </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"><CalendarDays size={13} />Active:</span>
          {activeFilters.map((filter) => (
            <button key={filter.key} type="button" onClick={filter.clear} className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-xs font-medium capitalize text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300" aria-label={`Remove ${filter.label} filter`}>
              {filter.label}<X size={12} />
            </button>
          ))}
          {activeFilters.length > 1 && <button type="button" onClick={() => { setSearchValue(""); setFilters({ search: "", category: ALL, startDate: null, endDate: null }); }} className="min-h-8 px-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white">Clear all</button>}
        </div>
      )}
    </div>
  );
}
