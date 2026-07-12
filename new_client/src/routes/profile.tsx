import { createFileRoute, redirect } from '@tanstack/react-router'
import ProfilePage from '../pages/ProfilePage'
import { useAuthStore } from '../store/authStore'

export const Route = createFileRoute('/profile')({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/login', search: { redirect: '/profile' } })
    }
  },
  component: ProfilePage,
  context: () => ({ title: 'Profile - Expense Tracker' }),
})
