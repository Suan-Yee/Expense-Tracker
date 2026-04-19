import { ChevronLeft, ChevronRight } from "lucide-react";
import { useExpenseStore } from "../../store/expenseStore";

export default function Pagination() {
  const { expenses, totalCount } = useExpenseStore();

  // If we had pagination state, these would be calculated
  const startCount = expenses.length > 0 ? 1 : 0;
  const endCount = expenses.length;

  return (
    <div className="flex items-center justify-between text-[13px] text-slate-500 font-medium px-4">
      <div>
        Showing <span className="font-bold text-slate-700">{startCount}</span> to <span className="font-bold text-slate-700">{endCount}</span> of <span className="font-bold text-slate-700">{totalCount}</span> transactions
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          disabled={true} // Pagination not yet fully implemented in backend filters
          className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        <button 
          disabled={true}
          className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
