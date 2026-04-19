import { format, parseISO, isValid } from "date-fns";
import { Edit2, Trash2, ArrowDown, ArrowUp } from "lucide-react";
import { CATEGORY_COLORS } from "../../constants/categories";

interface TransactionsTableProps {
  transactions: any[];
  isPanelOpen: boolean;
  onEdit: (transaction: any) => void;
  onDelete: (id: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  onSort: (key: string) => void;
}

export default function TransactionsTable({ 
  transactions, 
  isPanelOpen, 
  onEdit, 
  onDelete,
  sortConfig, 
  onSort 
}: TransactionsTableProps) {
  
  const formatDate = (dateValue: any, formatStr: string) => {
    if (!dateValue) return "N/A";
    const date = typeof dateValue === 'string' ? parseISO(dateValue) : new Date(dateValue);
    return isValid(date) ? format(date, formatStr) : "Invalid Date";
  };
  
  const getSortIcon = (columnName: string) => {
    if (sortConfig?.key !== columnName) {
      return null;
    }
    return sortConfig.direction === "asc" ? <ArrowUp size={12} className="ml-1" /> : <ArrowDown size={12} className="ml-1" />;
  };

  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-slate-200 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            <th className="py-3 px-4 min-w-[120px]">
              <button onClick={() => onSort("date")} className="flex items-center hover:text-slate-600 transition-colors font-bold whitespace-nowrap outline-none">
                Date {getSortIcon("date")}
              </button>
            </th>
            <th className="py-3 px-4 font-bold min-w-[150px]">Description</th>
            <th className="py-3 px-4 font-bold min-w-[120px]">Category</th>
            <th className="py-3 px-4 text-left">
              <button onClick={() => onSort("amount")} className="inline-flex items-center justify-start hover:text-slate-600 transition-colors font-bold w-full outline-none">
                Amount {getSortIcon("amount")}
              </button>
            </th>
            <th className="py-3 px-4 font-bold whitespace-nowrap">Insert Date</th>
            {/* Actions Column */}
            <th className={`py-3 px-4 text-center transition-all ${isPanelOpen ? "w-0 px-0 opacity-0 overflow-hidden" : "w-[100px] opacity-100"}`}>
               Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tr) => (
            <tr 
              key={tr._id} 
              className="border-b border-slate-100 transition-colors hover:bg-slate-50/50 group"
            >
              <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                {formatDate(tr.date, "MMM dd, yyyy")}
              </td>
              <td className="py-3.5 px-4 font-bold text-slate-700">
                {tr.description}
              </td>
              <td className="py-3.5 px-4">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${CATEGORY_COLORS[tr.category] ?? "bg-slate-100 text-slate-600"}`}>
                  {tr.category.charAt(0).toUpperCase() + tr.category.slice(1)}
                </span>
              </td>
              <td className={`py-3.5 px-4 text-left font-bold ${tr.amount > 0 ? "text-emerald-500" : "text-slate-800"}`}>
                {tr.amount > 0 ? "+" : ""}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tr.amount)}
              </td>
              <td className="py-3.5 px-4 text-slate-400 text-[12px] whitespace-nowrap">
                 {formatDate(tr.insertDate || tr.createdAt, "MM/dd/yyyy HH:mm")}
              </td>

              <td className={`py-3.5 px-4 transition-all ${isPanelOpen ? "w-0 px-0 opacity-0 overflow-hidden" : "w-[100px] opacity-100"}`}>
                <div className="flex items-center justify-center gap-2">
                  <button 
                    onClick={() => onEdit(tr)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                    aria-label="Edit"
                  >
                    <Edit2 size={14} strokeWidth={2.5}/>
                  </button>
                  <button 
                    onClick={() => onDelete(tr._id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} strokeWidth={2.5}/>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
