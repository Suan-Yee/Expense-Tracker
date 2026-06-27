import { ChevronLeft, ChevronRight } from "lucide-react";
import { useExpenseStore } from "../../store/expenseStore";

export default function Pagination() {
  const { expenses, currentPage = 1, itemsPerPage = 10, setCurrentPage, setItemsPerPage } = useExpenseStore();
  const totalCount = expenses.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const validPage = Math.min(currentPage, totalPages);
  const startCount = totalCount > 0 ? (validPage - 1) * itemsPerPage + 1 : 0;
  const endCount = Math.min(validPage * itemsPerPage, totalCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 text-[13px] text-slate-500 font-medium px-4">
      <div className="flex items-center gap-3">
        <span>
          Showing <span className="font-bold text-slate-700">{startCount}</span> to <span className="font-bold text-slate-700">{endCount}</span> of <span className="font-bold text-slate-700">{totalCount}</span> transactions
        </span>
        <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
          <span className="text-xs">Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white/80 py-1 px-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 shadow-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setCurrentPage(Math.max(1, validPage - 1))}
          disabled={validPage <= 1 || totalCount === 0}
          className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white hover:border-slate-300 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed font-bold"
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="px-2 font-bold text-slate-700 text-xs">
          Page {validPage} of {totalPages}
        </span>
        <button 
          onClick={() => setCurrentPage(Math.min(totalPages, validPage + 1))}
          disabled={validPage >= totalPages || totalCount === 0}
          className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white hover:border-slate-300 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed font-bold"
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
