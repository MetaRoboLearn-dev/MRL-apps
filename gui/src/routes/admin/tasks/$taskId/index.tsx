import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/tasks/$taskId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { taskId } = Route.useParams()
  return <div>Hello "/admin/tasks/{taskId}"!</div>
}
