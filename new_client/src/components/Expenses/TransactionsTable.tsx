import { Edit2, Trash2, ArrowDown, ArrowUp, RefreshCw } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { CATEGORY_COLORS } from "../../constants/categories"
import { formatCurrency } from "../../utils/formatUtils"
import { formatDate } from "../../utils/dateUtils"
import { motion } from "framer-motion"
import type { Expense } from "../../types"

interface TransactionsTableProps {
  transactions: Expense[];
  onEdit: (transaction: Expense) => void;
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
    <>
    <div className="space-y-2 py-1 md:hidden">
      {transactions.map((tr) => (
        <article key={tr._id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {tr.isRecurring && <span title="Recurring transaction" className="grid size-6 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"><RefreshCw size={11} /></span>}
                <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-white">{tr.description}</h2>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">{formatDate(tr.date, "MMM dd, yyyy")}</p>
            </div>
            <p className={`shrink-0 text-sm font-semibold ${tr.type === "income" || (tr.type === undefined && tr.amount > 0) ? "text-emerald-700 dark:text-emerald-300" : tr.type === "saving" ? "text-blue-600 dark:text-blue-300" : "text-slate-900 dark:text-white"}`}>
              {(tr.type === "income" || (tr.type === undefined && tr.amount > 0)) ? "+" : ""}{formatCurrency(Math.abs(tr.amount))}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <Badge className={CATEGORY_COLORS[tr.category] ?? "bg-slate-100 text-slate-600"}>{tr.category.charAt(0).toUpperCase() + tr.category.slice(1)}</Badge>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(tr)} aria-label={`Edit ${tr.description}`}><Edit2 size={15} /></Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(tr._id)} aria-label={`Delete ${tr.description}`} className="hover:bg-red-50 hover:text-red-700"><Trash2 size={15} /></Button>
            </div>
          </div>
        </article>
      ))}
    </div>
    <div className="hidden min-w-max w-full md:block">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur dark:bg-slate-900/95">
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
              className="group border-b border-slate-100 bg-transparent hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40"
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
                {formatDate(tr.createdAt, "MM/dd/yyyy HH:mm")}
              </td>
              <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-1.5">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(tr)} aria-label={`Edit ${tr.description}`} className="text-slate-400 hover:text-emerald-700 hover:bg-emerald-50">
                    <Edit2 size={14} strokeWidth={2.5} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(tr._id)} aria-label={`Delete ${tr.description}`} className="text-slate-400 hover:text-red-700 hover:bg-red-50">
                    <Trash2 size={14} strokeWidth={2.5} />
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}
