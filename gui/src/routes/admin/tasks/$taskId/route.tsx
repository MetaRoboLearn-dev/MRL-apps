import {createFileRoute, Outlet} from '@tanstack/react-router'
import TaskProviders from "../../../../providers/wrappers/TaskProviders.tsx";
import {queryOptions, useSuspenseQuery} from "@tanstack/react-query";
import {getTaskById} from "../../../../api/tasksApi.ts";

const taskQueryOptions = (taskId: string) =>
  queryOptions({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById(taskId)
  })

export const Route = createFileRoute('/admin/tasks/$taskId')({
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(taskQueryOptions(params.taskId))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { taskId } = Route.useParams()
  const { data: task } = useSuspenseQuery(taskQueryOptions(taskId))

  return (
    <TaskProviders task={task}>
      <Outlet />
    </TaskProviders>
  )
}
