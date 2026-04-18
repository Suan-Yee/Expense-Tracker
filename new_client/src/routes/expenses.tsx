import { createFileRoute, redirect } from '@tanstack/react-router'
import ExpensesPage from '../pages/ExpensesPage'
import { useAuthStore } from '../store/authStore';

export const Route = createFileRoute('/expenses')({
  beforeLoad: () => {
      const { isAuthenticated } = useAuthStore.getState();
  
      if (!isAuthenticated) {
        throw redirect({
          to: "/login",
          search: {
            redirect: "/expenses",
          },
        });
      }
    },
  component: ExpensesPage,
  context: () => ({
    title: "Expense - Expense-Tracker"
  })
})