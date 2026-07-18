import { useState, useEffect } from "react";
import { Plus, Download, ReceiptText } from "lucide-react";
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
import PageHeader from "../components/Common/PageHeader";
import EmptyState from "../components/Common/EmptyState";
import { Button } from "../components/ui/button";
import { useNotificationStore } from "../store/notificationStore";
import GlobalError from "../components/Common/GlobalError";

export default function ExpensesPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Expense | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { expenses, getAllExpenses, deleteExpense, setFilters, filters, isLoading, error, currentPage = 1, itemsPerPage = 10 } = useExpenseStore();
  const notify = useNotificationStore((state) => state.notify);

  const paginatedExpenses = expenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const hasActiveFilters = Boolean(filters.search || filters.startDate || filters.endDate || (filters.category && filters.category !== "all"));

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
      const deleteError = useExpenseStore.getState().error;
      if (!deleteError) {
        notify({ tone: "success", title: "Transaction deleted", message: "The transaction was removed from your records." });
        setTransactionToDelete(null);
        if (isPanelOpen) closePanel();
      } else {
        notify({ tone: "error", title: "Transaction wasn’t deleted", message: deleteError });
      }
    }
  };

  return (
    <div className="page-shell lg:h-[100svh] lg:overflow-hidden">
      <PageHeader
        eyebrow="Transactions"
        title="Expenses"
        description="Review every movement of money, find what you need, and keep your records accurate."
        actions={<>
          <Button variant="outline"
            onClick={() => setIsExportOpen(true)}
            disabled={expenses.length === 0}
          >
            <Download size={15} strokeWidth={2.5} />
            Export
          </Button>
          <Button
            onClick={openAddPanel}
          >
            <Plus size={16} strokeWidth={3} />
            Add transaction
          </Button>
        </>}
      />

      {/* Main Content Area */}
      <div className="z-10 flex min-h-0 w-full flex-1 flex-col gap-6 overflow-hidden">
        
        {/* Left Side: Table & Filters */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="app-surface flex min-h-0 flex-1 flex-col overflow-hidden p-4 sm:p-5">
            <FiltersBar />
            
            <div className="relative mt-4 min-h-0 min-w-0 flex-1 overflow-auto scroll-smooth [scrollbar-gutter:stable]">
                {isLoading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/75 dark:bg-slate-900/75" role="status" aria-label="Loading transactions">
                     <div className="size-9 animate-spin rounded-full border-[3px] border-emerald-200 border-t-emerald-700" />
                  </div>
                )}
                {!isLoading && error && expenses.length === 0 ? (
                  <GlobalError message={error} onRetry={() => void getAllExpenses()} />
                ) : <TransactionsTable
                transactions={paginatedExpenses} 
                onEdit={openEditPanel} 
                onDelete={(id) => setTransactionToDelete(id)}
                sortConfig={sortConfig}
                onSort={handleSort}
                />}
                
                {!isLoading && !error && expenses.length === 0 && (
                  <EmptyState
                    compact
                    icon={ReceiptText}
                    title={hasActiveFilters ? "No matching transactions" : "Start with your first transaction"}
                    description={hasActiveFilters ? "Try a broader date range or clear the current filters." : "Add income, spending, or savings to build your financial overview."}
                    action={hasActiveFilters
                      ? <Button variant="outline" size="sm" onClick={() => setFilters({ search: "", category: "all", startDate: undefined, endDate: undefined })}>Clear filters</Button>
                      : <Button size="sm" onClick={openAddPanel}><Plus size={15} /> Add transaction</Button>}
                  />
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
