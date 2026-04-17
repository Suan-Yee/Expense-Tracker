import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/budgets')({
  component: () => <div className="p-8"><h1>Budgets</h1></div>,
})
