import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/tasks/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/tasks/"!</div>
}
