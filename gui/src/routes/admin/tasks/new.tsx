import {createFileRoute} from '@tanstack/react-router'
import TaskProviderWrapper from "../../../providers/wrappers/TaskProviderWrapper.tsx";

export const Route = createFileRoute('/admin/tasks/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <TaskProviderWrapper>
      Hello "/admin/tasks/new"!
    </TaskProviderWrapper>
  )
}
