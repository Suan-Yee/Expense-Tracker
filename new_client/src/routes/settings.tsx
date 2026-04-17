import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: () => <div className="p-8"><h1>Settings</h1></div>,
})
