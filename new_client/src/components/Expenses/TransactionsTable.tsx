import { Edit2, Trash2, ArrowDown, ArrowUp, RefreshCw } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { CATEGORY_COLORS } from "../../constants/categories"
import { formatCurrency } from "../../utils/formatUtils"
import { formatDate } from "../../utils/dateUtils"
import { motion } from "framer-motion"

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
  onEdit,
  onDelete,
  sortConfig,
  onSort,
}: TransactionsTableProps) {
  const getSortIcon = (columnName: string) => {
    if (sortConfig?.key !== columnName) {
      return <ArrowDown size={12} className="ml-1 opacity-25 hover:opacity-60 transition-opacity" />
    }
    return sortConfig.direction === "asc"
      ? <ArrowUp size={13} className="ml-1 text-violet-600 font-extrabold stroke-[3]" />
      : <ArrowDown size={13} className="ml-1 text-violet-600 font-extrabold stroke-[3]" />
  }

  return (
    <div className="w-full">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-slate-200 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            <th className="py-3 px-3 sm:px-4 min-w-[110px]">
              <button onClick={() => onSort("date")} className="flex items-center hover:text-slate-600 transition-colors font-bold whitespace-nowrap outline-none">
                Date {getSortIcon("date")}
              </button>
            </th>
            <th className="py-3 px-3 sm:px-4 min-w-[140px]">
              <button onClick={() => onSort("description")} className="flex items-center hover:text-slate-600 transition-colors font-bold whitespace-nowrap outline-none">
                Description {getSortIcon("description")}
              </button>
            </th>
            <th className="py-3 px-3 sm:px-4 min-w-[110px]">
              <button onClick={() => onSort("category")} className="flex items-center hover:text-slate-600 transition-colors font-bold whitespace-nowrap outline-none">
                Category {getSortIcon("category")}
              </button>
            </th>
            <th className="py-3 px-3 sm:px-4 min-w-[100px] text-left">
              <button onClick={() => onSort("amount")} className="inline-flex items-center justify-start hover:text-slate-600 transition-colors font-bold w-full outline-none">
                Amount {getSortIcon("amount")}
              </button>
            </th>
            <th className="hidden lg:table-cell py-3 px-3 sm:px-4 min-w-[130px]">
              Insert Date
            </th>
            <th className="py-3 px-3 sm:px-4 text-center w-[90px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tr, i) => (
            <motion.tr
              key={tr._id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: i * 0.015 }}
              className={`border-b border-slate-100/80 transition-colors group ${i % 2 === 1 ? "bg-slate-50/60" : "bg-transparent"} hover:bg-slate-100/80`}
            >
              <td className="py-3.5 px-3 sm:px-4 text-slate-500 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {tr.isRecurring && (
                    <span title="Recurring" className="inline-flex items-center justify-center size-5 rounded-full bg-violet-100 text-violet-500 shrink-0">
                      <RefreshCw size={10} strokeWidth={2.5} />
                    </span>
                  )}
                  {formatDate(tr.date, "MMM dd, yyyy")}
                </div>
              </td>
              <td className="py-3.5 px-3 sm:px-4 font-bold text-slate-700">
                {tr.description}
              </td>
              <td className="py-3.5 px-3 sm:px-4">
                <Badge className={CATEGORY_COLORS[tr.category] ?? "bg-slate-100 text-slate-600"}>
                  {tr.category.charAt(0).toUpperCase() + tr.category.slice(1)}
                </Badge>
              </td>
              <td className={`py-3.5 px-3 sm:px-4 text-left font-bold whitespace-nowrap ${
                tr.type === "income" || (tr.type === undefined && tr.amount > 0) ? "text-emerald-500" :
                tr.type === "saving" ? "text-blue-600" : "text-slate-800"
              }`}>
                {(tr.type === "income" || (tr.type === undefined && tr.amount > 0)) ? "+" : ""}
                {formatCurrency(Math.abs(tr.amount))}
              </td>
              <td className="hidden lg:table-cell py-3.5 px-3 sm:px-4 text-slate-400 text-[12px] whitespace-nowrap">
                {formatDate(tr.insertDate || tr.createdAt, "MM/dd/yyyy HH:mm")}
              </td>
              <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-1.5">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(tr)} className="size-7 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50">
                    <Edit2 size={14} strokeWidth={2.5} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(tr._id)} className="size-7 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50">
                    <Trash2 size={14} strokeWidth={2.5} />
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
