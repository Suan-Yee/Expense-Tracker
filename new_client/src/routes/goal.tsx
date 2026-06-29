import { createFileRoute, redirect } from '@tanstack/react-router'
import GoalPage from '../pages/GoalPage'
import { useAuthStore } from '../store/authStore'

export const Route = createFileRoute('/goal')({
    beforeLoad: () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
            throw redirect({ to: '/login', search: { redirect: '/goal' } });
        }
    },
    component: GoalPage,
    context: () => ({ title: 'Goals - Expense-Tracker' }),
})
