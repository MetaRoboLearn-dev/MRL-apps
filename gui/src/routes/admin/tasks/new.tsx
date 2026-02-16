import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/admin/tasks/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/tasks/new"!</div>
}
