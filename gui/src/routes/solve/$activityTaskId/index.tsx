import {createFileRoute} from '@tanstack/react-router'
import {queryOptions, useSuspenseQuery} from "@tanstack/react-query";
import {getTaskById} from "../../../api/tasksApi.ts";
import TaskProviders from "../../../providers/wrappers/TaskProviders.tsx";
import TaskScreen from "../../../components/Task/TaskScreen.tsx";

const actTaskQueryOptions = (actTaskId: string) =>
  queryOptions({
    queryKey: ['actTask', actTaskId],
    queryFn: () => getTaskById(actTaskId)
  })

export const Route = createFileRoute('/solve/$activityTaskId/')({
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(actTaskQueryOptions(params.activityTaskId))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { activityTaskId } = Route.useParams();
  const { data: task } = useSuspenseQuery(actTaskQueryOptions(activityTaskId));

  return (
    <TaskProviders task={task} mode={'solve'}>
      <TaskScreen />
    </TaskProviders>
  );
}
