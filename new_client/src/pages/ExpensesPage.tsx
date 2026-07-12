import { useState, useEffect } from "react";
import { Plus, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FiltersBar from "../components/Expenses/FiltersBar";
import TransactionsTable from "../components/Expenses/TransactionsTable";
import Pagination from "../components/Expenses/Pagination";
import TransactionPanel from "../components/Expenses/TransactionPanel";
import ExportModal from "../components/Expenses/ExportModal";
import { useExpenseStore } from "../store/expenseStore";
import ActionConfirmModal from "../components/Common/ActionConfirmModal";
import type { Expense } from "../types";
import { useModalAccessibility } from "../hooks/useModalAccessibility";

export default function ExpensesPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Expense | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { expenses, getAllExpenses, deleteExpense, setFilters, filters, isLoading, currentPage = 1, itemsPerPage = 10 } = useExpenseStore();

  const paginatedExpenses = expenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Map backend sort string ("-date", "amount") to table sortConfig ({ key, direction })
  const sortConfig = filters.sort ? {
    key: filters.sort.startsWith("-") ? filters.sort.slice(1) : filters.sort,
    direction: filters.sort.startsWith("-") ? ("desc" as const) : ("asc" as const)
  } : null;

  useEffect(() => {
    getAllExpenses();
  }, [getAllExpenses]);

  const handleSort = (key: string) => {
    let newSort = key;
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      newSort = `-${key}`;
    }
    setFilters({ sort: newSort });
  };

  const openAddPanel = () => {
    setEditingTransaction(null);
    setIsPanelOpen(true);
  };

  const openEditPanel = (tr: Expense) => {
    setEditingTransaction(tr);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setEditingTransaction(null), 300); // Clear after animation
  };
  const panelRef = useModalAccessibility<HTMLDivElement>(isPanelOpen, closePanel);

  const confirmDelete = async () => {
    if (transactionToDelete) {
      await deleteExpense(transactionToDelete);
      setTransactionToDelete(null);
      if (isPanelOpen) {
        closePanel();
      }
    }
  };

  return (
    <div className="relative isolate flex h-[calc(100svh-5rem)] min-h-0 w-full flex-col overflow-hidden px-4 py-6 sm:px-8 lg:h-[100svh] lg:px-10 lg:py-8">
      {/* Header section */}
      <div className="z-10 mb-6 flex w-full shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
          Expenses
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsExportOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/78 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download size={15} strokeWidth={2.5} />
            Export
          </button>
          <button
            onClick={openAddPanel}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-500/20 transition-all hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
          >
            <Plus size={16} strokeWidth={3} />
            Add Expense
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="z-10 flex min-h-0 w-full flex-1 flex-col gap-6 overflow-hidden">
        
        {/* Left Side: Table & Filters */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-white/60 bg-white/78 p-4 shadow-sm shadow-slate-200/50 backdrop-blur-xl sm:p-6 dark:border-slate-800 dark:bg-slate-900/78 dark:shadow-slate-950/40">
            <FiltersBar />
            
            <div className="relative mt-4 min-h-0 min-w-0 flex-1 overflow-auto scroll-smooth [scrollbar-gutter:stable]">
                {isLoading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                     <div className="size-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  </div>
                )}
                <TransactionsTable 
                transactions={paginatedExpenses} 
                onEdit={openEditPanel} 
                onDelete={(id) => setTransactionToDelete(id)}
                sortConfig={sortConfig}
                onSort={handleSort}
                />
                
                {!isLoading && expenses.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                    <p className="text-sm font-medium">No transactions found</p>
                  </div>
                )}
            </div>
            
            <div className="mt-4 shrink-0 border-t border-slate-100 pt-4 dark:border-slate-800">
               <Pagination />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Add/Edit drawer — keeps the transaction table at full width */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close transaction panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePanel}
              className="fixed inset-0 z-40 cursor-default bg-slate-950/25 backdrop-blur-[3px]"
            />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="transaction-panel-title"
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 48 }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-[420px]"
            >
              <TransactionPanel
                key={editingTransaction?._id ?? "new-transaction"}
                transaction={editingTransaction}
                onClose={closePanel}
                onDelete={(id) => setTransactionToDelete(id)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ActionConfirmModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Yes, Delete"
        variant="danger"
        isLoading={isLoading}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        expenses={expenses}
      />
    </div>
  );
}
