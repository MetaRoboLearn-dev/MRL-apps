import {createFileRoute} from '@tanstack/react-router'
import TaskProviders from "../../../providers/wrappers/TaskProviders.tsx";

export const Route = createFileRoute('/admin/tasks/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <TaskProviders>
      Hello "/admin/tasks/new"!
    </TaskProviders>
  )
}
