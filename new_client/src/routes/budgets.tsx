import { createFileRoute, redirect } from '@tanstack/react-router'
import BudgetsPage from '../pages/BudgetsPage'
import { useAuthStore } from '../store/authStore'

export const Route = createFileRoute('/budgets')({
    beforeLoad: () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
            throw redirect({ to: '/login', search: { redirect: '/budgets' } });
        }
    },
    component: BudgetsPage,
    context: () => ({ title: 'Budgets - Expense-Tracker' }),
})
