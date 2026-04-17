import { createFileRoute } from '@tanstack/react-router'
import ExpensePage from '../pages/ExpensePage'

export const Route = createFileRoute('/expenses')({
  component: ExpensePage,
})