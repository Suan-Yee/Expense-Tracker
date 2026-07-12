import { createFileRoute, redirect } from '@tanstack/react-router'
import AnalyticsPage from '../pages/AnalyticsPage'
import { useAuthStore } from '../store/authStore'

export const Route = createFileRoute('/analytics')({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/login', search: { redirect: '/analytics' } })
    }
  },
  component: AnalyticsPage,
  context: () => ({ title: 'Analytics - Expense Tracker' }),
})
