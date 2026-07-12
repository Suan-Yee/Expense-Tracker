import { createFileRoute, redirect } from '@tanstack/react-router'
import SettingsPage from '../pages/SettingsPage'
import { useAuthStore } from '../store/authStore'

export const Route = createFileRoute('/settings')({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) throw redirect({ to: '/login' })
  },
  component: SettingsPage,
  context: () => ({ title: 'Settings - Expense Tracker' }),
})
