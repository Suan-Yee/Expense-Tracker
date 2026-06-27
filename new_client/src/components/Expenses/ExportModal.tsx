import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, FileText, FileSpreadsheet, Download, CheckCircle2, Loader2 } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { Expense } from "../../types"
import { formatCurrency } from "../../utils/formatUtils"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  expenses: Expense[]
}

type ExportFormat = "csv" | "pdf"

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

function formatAmount(exp: Expense) {
  const sign = exp.type === "income" ? "+" : ""
  return `${sign}$${Math.abs(exp.amount).toFixed(2)}`
}

// ─── CSV ─────────────────────────────────────────────────────────────────────

function exportCSV(expenses: Expense[]) {
  const headers = ["Date", "Description", "Category", "Type", "Amount", "Tags", "Recurring", "Frequency"]
  const rows = expenses.map(e => [
    formatDate(e.date),
    `"${e.description.replace(/"/g, '""')}"`,
    e.category,
    e.type,
    formatAmount(e),
    (e.tags ?? []).join("; "),
    e.isRecurring ? "Yes" : "No",
    e.frequency ?? "",
  ])

  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `expenses_${new Date().toISOString().split("T")[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// ─── PDF ─────────────────────────────────────────────────────────────────────

function exportPDF(expenses: Expense[]) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })

  // Header bar
  doc.setFillColor(16, 185, 129) // emerald-500
  doc.rect(0, 0, 297, 20, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Expense Tracker — Transaction Report", 10, 13)
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}`, 230, 13)

  // Summary row
  const totalIncome   = expenses.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0)
  const totalExpenses = expenses.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0)
  const totalSavings  = expenses.filter(e => e.type === "saving").reduce((s, e) => s + e.amount, 0)

  doc.setTextColor(30, 41, 59)
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text(`Total records: ${expenses.length}`, 10, 28)
  doc.setTextColor(16, 185, 129)
  doc.text(`Income: +${formatCurrency(totalIncome)}`, 60, 28)
  doc.setTextColor(239, 68, 68)
  doc.text(`Expenses: ${formatCurrency(totalExpenses)}`, 120, 28)
  doc.setTextColor(59, 130, 246)
  doc.text(`Savings: ${formatCurrency(totalSavings)}`, 185, 28)

  // Table
  autoTable(doc, {
    startY: 33,
    head: [["Date", "Description", "Category", "Type", "Amount", "Tags", "Recurring"]],
    body: expenses.map(e => [
      formatDate(e.date),
      e.description,
      e.category.charAt(0).toUpperCase() + e.category.slice(1),
      e.type.charAt(0).toUpperCase() + e.type.slice(1),
      formatAmount(e),
      (e.tags ?? []).map(t => `#${t}`).join(" ") || "—",
      e.isRecurring ? `✓ ${e.frequency ?? ""}` : "—",
    ]),
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 28 },
      4: { halign: "right", fontStyle: "bold" },
      6: { cellWidth: 28 },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 4) {
        const v = data.cell.raw as string
        if (v.startsWith("+")) data.cell.styles.textColor = [16, 185, 129]
        else if (!v.startsWith("+")) data.cell.styles.textColor = [30, 41, 59]
      }
    },
    margin: { left: 10, right: 10 },
  })

  doc.save(`expenses_${new Date().toISOString().split("T")[0]}.pdf`)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExportModal({ isOpen, onClose, expenses }: ExportModalProps) {
  const [selected, setSelected] = useState<ExportFormat>("pdf")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    // Small delay so the loading state renders before the blocking PDF operation
    await new Promise(r => setTimeout(r, 100))
    try {
      if (selected === "csv") exportCSV(expenses)
      else exportPDF(expenses)
      setDone(true)
      setTimeout(() => { setDone(false); onClose() }, 1400)
    } finally {
      setLoading(false)
    }
  }

  const totalIncome   = expenses.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0)
  const totalExpenses = expenses.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[3px]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
            className="fixed left-1/2 top-1/2 z-50 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white/95 backdrop-blur-2xl shadow-2xl shadow-slate-900/15 border border-white overflow-hidden"
          >
            {/* Gradient top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500" />

            <div className="px-7 py-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-[17px] font-extrabold text-slate-800">Export Transactions</h2>
                  <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                    {expenses.length} transaction{expenses.length !== 1 ? "s" : ""} · filtered view
                  </p>
                </div>
                <button onClick={onClose} className="flex size-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              {/* Summary chips */}
              <div className="flex gap-2 mb-5">
                <span className="rounded-xl bg-emerald-50 px-3 py-1.5 text-[12px] font-bold text-emerald-600">
                  Income +{formatCurrency(totalIncome)}
                </span>
                <span className="rounded-xl bg-red-50 px-3 py-1.5 text-[12px] font-bold text-red-500">
                  Expenses {formatCurrency(totalExpenses)}
                </span>
              </div>

              {/* Format picker */}
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Choose Format</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {([
                  { fmt: "pdf" as ExportFormat, icon: FileText,        label: "PDF Report",     desc: "Formatted table with summary",  accent: "emerald" },
                  { fmt: "csv" as ExportFormat, icon: FileSpreadsheet, label: "CSV Spreadsheet", desc: "Open in Excel, Google Sheets",  accent: "blue"    },
                ] as const).map(({ fmt, icon: Icon, label, desc, accent }) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setSelected(fmt)}
                    className={`relative flex flex-col gap-2 rounded-2xl border-2 p-4 text-left transition-all ${
                      selected === fmt
                        ? accent === "emerald"
                          ? "border-emerald-400 bg-emerald-50/80 shadow-sm shadow-emerald-100"
                          : "border-blue-400 bg-blue-50/80 shadow-sm shadow-blue-100"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    {selected === fmt && (
                      <motion.span
                        layoutId="checkmark"
                        className="absolute top-3 right-3"
                      >
                        <CheckCircle2 size={14} className={accent === "emerald" ? "text-emerald-500" : "text-blue-500"} strokeWidth={2.5} />
                      </motion.span>
                    )}
                    <div className={`flex size-9 items-center justify-center rounded-xl ${
                      selected === fmt
                        ? accent === "emerald" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      <Icon size={18} strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-800">{label}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Export button */}
              <button
                onClick={handleExport}
                disabled={loading || done || expenses.length === 0}
                className={`w-full flex items-center justify-center gap-2.5 rounded-2xl py-3.5 text-[14px] font-extrabold text-white transition-all active:scale-[0.98] disabled:opacity-60 ${
                  done
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-200/60"
                }`}
              >
                {done ? (
                  <>
                    <CheckCircle2 size={17} strokeWidth={2.5} />
                    Downloaded!
                  </>
                ) : loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Preparing…
                  </>
                ) : (
                  <>
                    <Download size={17} strokeWidth={2.5} />
                    Export {selected.toUpperCase()}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
