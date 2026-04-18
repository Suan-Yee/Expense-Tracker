import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination() {
  return (
    <div className="flex items-center justify-between text-[13px] text-slate-500 font-medium px-4">
      <div>
        Showing <span className="font-bold text-slate-700">1</span> to <span className="font-bold text-slate-700">5</span> of <span className="font-bold text-slate-700">42</span> transactions
      </div>
      
      <div className="flex items-center gap-2">
        <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <ChevronLeft size={16} />
        </button>
        <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
